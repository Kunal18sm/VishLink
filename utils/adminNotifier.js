import webPush from 'web-push';
import { AdminNotification } from '../models/adminNotification.js';
import { AdminPushSubscription } from '../models/adminPushSubscription.js';

const DEFAULT_VAPID_PUBLIC_KEY = 'BAZnvSkGFkLkwUQsZpfR7dIsRlhqoBgIuLne-bqW7xC7SDaLZUgqHtQg-pqCEIpdImL3czKePulR0TJfbVAIygc';
const DEFAULT_VAPID_PRIVATE_KEY = 'zU3fduPRV5fi-dDrdlMiKrXfM0u7gK0Q-pUlg5dDn14';
const DEFAULT_VAPID_SUBJECT = 'mailto:admin@wishlink.in';

let vapidKeys = {
  publicKey: String(process.env.VAPID_PUBLIC_KEY || '').trim() || DEFAULT_VAPID_PUBLIC_KEY,
  privateKey: String(process.env.VAPID_PRIVATE_KEY || '').trim() || DEFAULT_VAPID_PRIVATE_KEY,
  subject: String(process.env.VAPID_SUBJECT || '').trim() || DEFAULT_VAPID_SUBJECT,
};

try {
  webPush.setVapidDetails(vapidKeys.subject, vapidKeys.publicKey, vapidKeys.privateKey);
} catch (e) {
  console.warn('VAPID setup warning:', e.message);
}

export function getVapidPublicKey() {
  return vapidKeys.publicKey;
}

/**
 * Register or update Admin Web Push Subscription in MongoDB
 */
export async function saveAdminPushSubscription(userId, rawSub, userAgent = '') {
  if (!rawSub || !rawSub.endpoint || !rawSub.keys || !rawSub.keys.p256dh || !rawSub.keys.auth) {
    throw new Error('Invalid Web Push subscription payload.');
  }

  return AdminPushSubscription.findOneAndUpdate(
    { endpoint: rawSub.endpoint },
    {
      $set: {
        user: userId,
        endpoint: rawSub.endpoint,
        expirationTime: rawSub.expirationTime ? new Date(rawSub.expirationTime) : null,
        keys: {
          p256dh: rawSub.keys.p256dh,
          auth: rawSub.keys.auth,
        },
        userAgent: String(userAgent || '').slice(0, 500),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/**
 * Send Web Push Notification to all Admin Subscriptions
 */
export async function sendWebPushToAdmins(payload) {
  try {
    const subscriptions = await AdminPushSubscription.find({}).lean();
    if (!subscriptions.length) {
      console.log('ℹ️ No Admin Web Push Subscriptions found in database yet.');
      return { sent: 0, total: 0 };
    }

    const targetUrl = payload.link || payload.url || '/requests/dashboard';

    const pushPayload = JSON.stringify({
      title: payload.title || 'VishLink Admin Alert 🔔',
      body: payload.message || payload.body || 'New activity recorded.',
      icon: '/assets/icon-192.png',
      badge: '/assets/icon-192.png',
      url: targetUrl,
      data: {
        url: targetUrl,
      },
    });

    let sent = 0;
    const expiredEndpoints = [];

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth,
              },
            },
            pushPayload,
            { TTL: 60, urgency: 'high' }
          );
          sent += 1;
          await AdminPushSubscription.updateOne({ _id: sub._id }, { $set: { lastUsedAt: new Date() } });
        } catch (err) {
          if (err.statusCode === 404 || err.statusCode === 410) {
            expiredEndpoints.push(sub.endpoint);
          } else {
            console.warn('Web push delivery notice:', err.message);
          }
        }
      })
    );

    if (expiredEndpoints.length) {
      await AdminPushSubscription.deleteMany({ endpoint: { $in: expiredEndpoints } });
    }

    console.log(`✅ Web Push Notification sent to ${sent}/${subscriptions.length} admin browser subscriptions!`);
    return { sent, total: subscriptions.length };
  } catch (err) {
    console.error('❌ Error sending Web Push to admins:', err.message);
    return { sent: 0, error: err.message };
  }
}

/**
 * Dispatch Admin Notification (Saves to DB + Sends Web Push to Admin Browsers)
 */
export async function notifyAdmin({ type, title, message, link, details = {} }) {
  console.log(`\n🔔 [ADMIN WEB NOTIFICATION - ${type}] ${title}: ${message}`);

  const notifLink = link || '/requests/dashboard';

  // 1. Save to Database for Admin Activity Log
  let savedAlert = null;
  try {
    const notif = new AdminNotification({
      type: type || 'general',
      title: title || 'Notification',
      message: message || 'New activity recorded.',
      link: notifLink,
      details,
      read: false,
      isRead: false,
    });
    savedAlert = await notif.save();
  } catch (err) {
    console.error('Failed to save Admin notification to DB:', err.message);
  }

  // 2. Dispatch Web Push Notification to Admin Browsers
  sendWebPushToAdmins({ title, message, type, link: notifLink }).catch(() => {});

  return savedAlert;
}
