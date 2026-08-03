import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { OAuth2Client } from 'google-auth-library';
import { User } from './models/user.js';
import { WebSample } from './models/WebSample.js';
import { PurchasedWeb } from './models/purchasedWeb.js';
import { Chat } from './models/chat.js';
import { generateReply } from './utils/geminiBot.js';
import { AdminNotification } from './models/adminNotification.js';
import { notifyAdmin, getVapidPublicKey, saveAdminPushSubscription, sendWebPushToAdmins } from './utils/adminNotifier.js';



const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'vishlink_jwt_secret_key_2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Primary Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'drzq6kjgp',
  api_key: process.env.CLOUD_API_KEY || '984621416722855',
  api_secret: process.env.CLOUD_API_SECRET || 'Wu_h-_KRjRBasTVfjD_CYh2J0ec',
});

// Memory Storage for Multer uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 1. Primary MongoDB Connection (Temporary & Main Data)
const mongoUrl = process.env.MongoDB_URL || 'mongodb://localhost:27017/vishlink';

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Primary MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('Primary MongoDB connection error:', err.message);
  });

// 2. Permanent MongoDB Connection (For Permanent Links)
const permanentDbUrl = process.env.PERMANENT_MONGODB_URL || mongoUrl;
const permanentConn = mongoose.createConnection(permanentDbUrl);

permanentConn.on('connected', () => {
  console.log('Permanent MongoDB Database connected successfully.');
});

permanentConn.on('error', (err) => {
  console.error('Permanent MongoDB connection error:', err.message);
});

// Permanent PurchasedWeb Model bound to Permanent Database Connection
const PermanentPurchasedWeb = permanentConn.model(
  'purchasedWeb',
  PurchasedWeb.schema,
  'purchasedWeb'
);

// Auth Middleware Helpers
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
      next();
    });
  } else {
    next();
  }
};

// Admin Only Middleware
const adminOnly = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Admin authentication required.' });
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(403).json({ success: false, message: 'User not found.' });
    
    // Check admin email or role
    const adminEmails = ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'];
    const isAdminUser = user.role === 'admin' || user.isAdmin === true || adminEmails.includes(user.email.toLowerCase());
    
    if (!isAdminUser) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }
    
    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- ADMIN NOTIFICATION API ROUTES ---------------- //

// Fetch Admin Notifications
app.get('/api/admin/notifications', authenticateToken, adminOnly, async (req, res) => {
  try {
    const notifications = await AdminNotification.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    const unreadCount = await AdminNotification.countDocuments({ read: false });

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark Notifications as Read
app.put('/api/admin/notifications/mark-read', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (notificationId) {
      await AdminNotification.findByIdAndUpdate(notificationId, { read: true });
    } else {
      await AdminNotification.updateMany({ read: false }, { read: true });
    }
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fetch VAPID Public Key for Web Push Subscription
app.get('/api/admin/vapid-public-key', (req, res) => {
  res.json({ success: true, publicKey: getVapidPublicKey() });
});

// Save Admin Web Push Subscription in DB
app.post('/api/admin/subscribe-push', authenticateToken, adminOnly, async (req, res) => {
  try {
    const rawSubscription = req.body;
    const userAgent = req.headers['user-agent'] || '';
    await saveAdminPushSubscription(req.user.id, rawSubscription, userAgent);
    res.json({ success: true, message: '✅ Admin Web Push subscription saved successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Test Web Push Notification
app.post('/api/admin/notifications/test-push', authenticateToken, adminOnly, async (req, res) => {
  try {
    const result = await sendWebPushToAdmins({
      title: '🧪 VishLink Web Push Test Alert!',
      message: `Hello Admin! Web Push notification system is working perfectly! (${new Date().toLocaleTimeString()})`,
    });

    if (result.sent > 0) {
      res.json({ success: true, message: `✅ Web Push alert sent to ${result.sent} browser(s)!` });
    } else if (result.total === 0) {
      res.status(400).json({
        success: false,
        message: 'No browser subscriptions found. Click "Enable Browser Web Push" in Admin Panel first!',
      });
    } else {
      res.status(400).json({ success: false, message: 'Failed to deliver Web Push notification.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ---------------- AUTH ROUTES ---------------- //


// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email, username and password.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminEmails = ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'];
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';

    const newUser = new User({
      email: email.toLowerCase(),
      username,
      passwordHash,
      role,
      isAdmin: role === 'admin',
    });
    await newUser.save();

    // Trigger Admin Notification for New User Signup
    notifyAdmin({
      type: 'NEW_USER_SIGNUP',
      title: '🎉 New User Registered',
      message: `User ${newUser.username} (${newUser.email}) joined VishLink!`,
      details: {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        provider: 'Email & Password',
      },
    }).catch((err) => console.error('Admin signup notify error:', err));


    const token = jwt.sign({ id: newUser._id, email: newUser.email, username: newUser.username, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        avatarUrl: newUser.avatarUrl,
        role: newUser.role,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login (Email or Username)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, username, emailOrUsername, password } = req.body;
    const loginInput = String(emailOrUsername || email || username || '').trim();

    if (!loginInput || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and password are required.' });
    }

    const user = await User.findOne({
      $or: [
        { email: loginInput.toLowerCase() },
        { username: { $regex: `^${loginInput.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, $options: 'i' } },
      ],
    });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const adminEmails = ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'];
    if (adminEmails.includes(user.email.toLowerCase()) && user.role !== 'admin') {
      user.role = 'admin';
      user.isAdmin = true;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isAdmin: user.isAdmin || user.role === 'admin',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Google Sign In
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, googleUser } = req.body;
    let email = '';
    let username = '';
    let googleId = '';
    let avatarUrl = '';

    if (credential) {
      if (googleClient && GOOGLE_CLIENT_ID) {
        try {
          const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          email = payload?.email || '';
          username = payload?.name || payload?.email?.split('@')[0] || 'User';
          googleId = payload?.sub || '';
          avatarUrl = payload?.picture || '';
        } catch (verifyErr) {
          console.warn('googleClient verifyIdToken fallback:', verifyErr.message);
        }
      }

      if (!email && typeof credential === 'string' && credential.includes('.')) {
        try {
          const base64Url = credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            Buffer.from(base64, 'base64')
              .toString()
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          email = payload?.email || '';
          username = payload?.name || payload?.email?.split('@')[0] || 'Google User';
          googleId = payload?.sub || '';
          avatarUrl = payload?.picture || '';
        } catch (e) {
          console.error('Credential decode error:', e);
        }
      }
    } else if (googleUser) {
      email = googleUser.email;
      username = googleUser.name || googleUser.username || email.split('@')[0];
      googleId = googleUser.id || googleUser.sub || 'google_' + Date.now();
      avatarUrl = googleUser.picture || googleUser.avatarUrl || '';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid Google authentication payload.' });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account email not found.' });
    }

    const adminEmails = ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'];
    const isAdmin = adminEmails.includes(email.toLowerCase());

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        username,
        googleId,
        avatarUrl,
        role: isAdmin ? 'admin' : 'user',
        isAdmin,
      });
      await user.save();

      // Trigger Admin Notification for New Google Signup
      notifyAdmin({
        type: 'NEW_USER_SIGNUP',
        title: '🎉 New Google Signup',
        message: `User ${user.username} (${user.email}) signed up via Google!`,
        details: {
          userId: user._id,
          username: user.username,
          email: user.email,
          provider: 'Google One-Tap / OAuth',
        },
      }).catch((err) => console.error('Admin google signup notify error:', err));
    } else {

      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      if (googleId && !user.googleId) user.googleId = googleId;
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
        user.isAdmin = true;
      }
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Google Login successful!',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isAdmin: user.isAdmin || user.role === 'admin',
      },
    });
  } catch (err) {
    console.error('Google Sign In error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Current User Details
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const adminEmails = ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'];
    const isAdmin = user.role === 'admin' || user.isAdmin === true || adminEmails.includes(user.email.toLowerCase());

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        role: isAdmin ? 'admin' : 'user',
        isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- TEMPLATES ROUTES ---------------- //

app.get('/api/templates', async (req, res) => {
  try {
    const templates = await WebSample.find({}).sort({ priority: -1, _id: -1 }).lean();
    const sanitizedTemplates = templates.map((t) => {
      let webUrl = t.webUrl || '';
      if (!webUrl || webUrl.includes('localhost') || webUrl.includes('127.0.0.1')) {
        webUrl = 'https://all-sub-websites.onrender.com/wish';
      }

      let imgUrlStr = '';
      if (typeof t.imageUrl === 'string' && t.imageUrl.trim()) {
        imgUrlStr = t.imageUrl.trim();
      } else if (t.imageUrl && typeof t.imageUrl === 'object') {
        imgUrlStr = t.imageUrl.url || t.imageUrl.secure_url || t.imageUrl.path || '';
      }
      if (!imgUrlStr && typeof t.image === 'string' && t.image.trim()) {
        imgUrlStr = t.image.trim();
      }

      const finalImgUrl = imgUrlStr || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800';
      const imageUrlObj = {
        url: finalImgUrl,
        filename: (t.imageUrl && typeof t.imageUrl === 'object' && t.imageUrl.filename) || '',
      };

      return {
        ...t,
        webUrl,
        imageUrl: imageUrlObj,
        image: finalImgUrl,
      };
    });
    res.json({ success: true, templates: sanitizedTemplates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/templates/:id', async (req, res) => {
  try {
    const template = await WebSample.findById(req.params.id).lean();
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    let webUrl = template.webUrl || '';
    if (!webUrl || webUrl.includes('localhost') || webUrl.includes('127.0.0.1')) {
      webUrl = 'https://all-sub-websites.onrender.com/wish';
    }

    let imgUrlStr = '';
    if (typeof template.imageUrl === 'string' && template.imageUrl.trim()) {
      imgUrlStr = template.imageUrl.trim();
    } else if (template.imageUrl && typeof template.imageUrl === 'object') {
      imgUrlStr = template.imageUrl.url || template.imageUrl.secure_url || '';
    }
    if (!imgUrlStr && typeof template.image === 'string' && template.image.trim()) {
      imgUrlStr = template.image.trim();
    }

    const imageUrlObj = {
      url: imgUrlStr || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800',
      filename: (template.imageUrl && typeof template.imageUrl === 'object' && template.imageUrl.filename) || '',
    };

    res.json({ success: true, template: { ...template, webUrl, imageUrl: imageUrlObj } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- ORDERS & PURCHASE ROUTES ---------------- //

// Submit Purchase Order
app.post(
  '/api/orders',
  optionalAuth,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'paymentProof', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        templateId,
        webName,
        senderName,
        receiverName,
        specialMessage,
        musicTrack,
        themeColor,
        isTemporary,
        totalPrice,
      } = req.body;

      if (!senderName || !senderName.trim()) {
        return res.status(400).json({ success: false, message: 'Your name (Sender) is required.' });
      }

      if (!receiverName || !receiverName.trim()) {
        return res.status(400).json({ success: false, message: "Recipient's name is required." });
      }

      if (!specialMessage || !specialMessage.trim()) {
        return res.status(400).json({ success: false, message: 'Wish message is required.' });
      }

      // Find template in primary database
      let selectedWeb = null;
      if (templateId && mongoose.Types.ObjectId.isValid(templateId)) {
        selectedWeb = await WebSample.findById(templateId).lean();
      }

      const requiredPhotos = selectedWeb ? selectedWeb.imageNeeded : 5;
      const isTemp = isTemporary !== 'false';

      // Check photo validation
      const uploadedFilesCount = req.files?.images ? req.files.images.length : 0;
      if (requiredPhotos > 0 && uploadedFilesCount < requiredPhotos) {
        return res.status(400).json({
          success: false,
          message: `This template requires exactly ${requiredPhotos} photo(s).`,
        });
      }

      // Check User
      let authorUser = null;
      if (req.user) {
        authorUser = await User.findById(req.user.id);
      }

      // Upload Images to Cloudinary
      const uploadedImageObjs = [];
      if (req.files && req.files.images) {
        for (const file of req.files.images) {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          const cloudRes = await cloudinary.uploader.upload(dataURI, {
            folder: 'vishlink_wishes',
          });
          uploadedImageObjs.push({
            url: cloudRes.secure_url,
            filename: cloudRes.public_id,
          });
        }
      }

      // Upload Payment Proof if present
      let paymentProofObj = null;
      if (req.files && req.files.paymentProof && req.files.paymentProof[0]) {
        const file = req.files.paymentProof[0];
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const cloudRes = await cloudinary.uploader.upload(dataURI, {
          folder: 'vishlink_payments',
        });
        paymentProofObj = {
          url: cloudRes.secure_url,
          filename: cloudRes.public_id,
        };
      }

      // Link Generation matching reference project (Sanitize any localhost values in MongoDB):
      const purchaseId = `VL-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const rawTemplateUrl = selectedWeb ? selectedWeb.webUrl : '';
      let baseWebUrl = 'https://all-sub-websites.onrender.com/wish';

      if (rawTemplateUrl && typeof rawTemplateUrl === 'string') {
        const trimmed = rawTemplateUrl.trim().replace(/\/+$/, '');
        if (trimmed && !trimmed.includes('localhost') && !trimmed.includes('127.0.0.1')) {
          baseWebUrl = trimmed;
        }
      }

      let generatedWishingUrl = '';
      if (isTemp) {
        generatedWishingUrl = `${baseWebUrl}/${purchaseId}`;
      } else {
        generatedWishingUrl = `${baseWebUrl}/tulipParisBMW/${purchaseId}`;
      }

      const costAmount = Number(totalPrice) || (isTemp ? (selectedWeb?.priceForTemporary || 199) : (selectedWeb?.priceForPermanent || 399));
      const isFreeLink = costAmount === 0;
      const isLiveStatus = isFreeLink; // Free links are auto live, paid links require Admin approval (isLive = false)

      const orderDataPayload = {
        purchaseId,
        webUrl: generatedWishingUrl,
        webName: webName || selectedWeb?.webName || 'Wish Surprise Website',
        sender: senderName.trim(),
        receiver: receiverName.trim(),
        price: costAmount,
        purchaseMode: 'upi',
        paidCredits: 0,
        images: uploadedImageObjs,
        paymentProofUrl: paymentProofObj,
        specialMsg: [specialMessage.trim()],
        musicTrack: musicTrack || 'Happy Birthday Remix',
        themeColor: themeColor || 'Rose Pink',
        author: authorUser ? authorUser._id : null,
        isTemporary: isTemp,
        isLive: isLiveStatus,
        adminInteracted: isFreeLink ? true : false,
        adminInterected: isFreeLink ? true : false,
        expiresAt: isTemp ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) : null,
      };

      // SAVE IN PERMANENT DATABASE IF NOT TEMPORARY (MATCHING REFERENCE PROJECT!)
      let newOrder;
      if (isTemp) {
        newOrder = new PurchasedWeb(orderDataPayload);
        await newOrder.save();
      } else {
        newOrder = new PermanentPurchasedWeb(orderDataPayload);
        await newOrder.save();
      }

      // Trigger Free Admin Notification for New Template Sale / Purchase
      notifyAdmin({
        type: 'TEMPLATE_SALE',
        title: '🛒 Template Sold / Purchase Order Received',
        message: `Template "${newOrder.webName}" bought for ₹${newOrder.price} by ${newOrder.sender}!`,
        details: {
          orderId: newOrder.purchaseId,
          templateName: newOrder.webName,
          price: newOrder.price,
          sender: newOrder.sender,
          receiver: newOrder.receiver,
          isTemporary: isTemp,
          buyerEmail: authorUser ? authorUser.email : 'Guest / Direct',
        },
      }).catch((err) => console.error('Admin template sale notify error:', err));


      if (authorUser) {
        try {
          await User.findByIdAndUpdate(authorUser._id, {
            $push: {
              webCollection: {
                purchasedId: newOrder._id,
                webName: newOrder.webName,
                dateOfBuy: newOrder.date || new Date(),
                receiver: newOrder.receiver,
                price: newOrder.price,
                purchaseMode: 'upi',
                paidCredits: 0,
                expiresAt: newOrder.expiresAt,
                paymentProofUrl: paymentProofObj,
                permanentLink: !isTemp && isLiveStatus ? newOrder.webUrl : '',
              },
            },
          });
        } catch (pushErr) {
          console.log('webCollection push error:', pushErr.message);
        }
      }

      res.json({
        success: true,
        message: isLiveStatus ? 'Wish Link created successfully!' : 'Wish Link submitted! Awaiting Admin Approval & Payment Verification.',
        order: {
          id: newOrder.purchaseId,
          wishingSlug: purchaseId,
          wishingUrl: newOrder.webUrl,
          templateName: newOrder.webName,
          webName: newOrder.webName,
          senderName: newOrder.sender,
          receiverName: newOrder.receiver,
          specialMessage: newOrder.specialMsg[0],
          uploadedImages: newOrder.images.map((img) => img.url),
          themeColor: newOrder.themeColor,
          musicTrack: newOrder.musicTrack,
          totalPrice: newOrder.price,
          purchaseDate: new Date(newOrder.date).toLocaleDateString(),
          status: isLiveStatus ? 'Active & Ready' : 'Pending Admin Approval',
        },
      });
    } catch (err) {
      console.error('Order creation error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// My Orders List (Active Wish Links + Complete Order History from webCollection)
app.get('/api/orders/my-orders', authenticateToken, async (req, res) => {
  try {
    const tempOrders = await PurchasedWeb.find({ author: req.user.id }).sort({ date: -1 }).lean();
    const permOrders = await PermanentPurchasedWeb.find({ author: req.user.id }).sort({ date: -1 }).lean();
    const currentUser = await User.findById(req.user.id).select('webCollection').lean();

    const activeCombined = [...tempOrders, ...permOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

    const formattedActiveOrders = activeCombined.map((o) => ({
      id: o.purchaseId || String(o._id),
      wishingSlug: o.purchaseId || String(o._id),
      wishingUrl: o.webUrl,
      templateName: o.webName || 'Wishing Template',
      webName: o.webName || 'Wishing Template',
      senderName: o.sender,
      receiverName: o.receiver,
      specialMessage: o.specialMsg ? o.specialMsg[0] : '',
      uploadedImages: (o.images || []).map((img) => img.url),
      themeColor: o.themeColor,
      totalPrice: o.price,
      rawDate: new Date(o.date || Date.now()).getTime(),
      purchaseDate: new Date(o.date || Date.now()).toLocaleDateString(),
      status: o.isLive ? 'Active & Ready' : 'Processing',
      musicTrack: o.musicTrack,
      isTemporary: o.isTemporary,
      isFakePaymentProof: false,
    })).sort((a, b) => b.rawDate - a.rawDate);

    const webColl = Array.isArray(currentUser?.webCollection) ? currentUser.webCollection : [];
    const formattedHistoryOrders = webColl
      .map((item) => ({
        id: item.purchasedId ? String(item.purchasedId) : String(item._id),
        wishingSlug: item.purchasedId ? String(item.purchasedId) : String(item._id),
        wishingUrl: item.permanentLink || '',
        templateName: item.webName || 'Wish Link Webpage',
        webName: item.webName || 'Wish Link Webpage',
        senderName: '',
        receiverName: item.receiver || '',
        specialMessage: '',
        uploadedImages: [],
        totalPrice: item.price || 0,
        rawDate: new Date(item.dateOfBuy || item.adminActionAt || Date.now()).getTime(),
        purchaseDate: new Date(item.dateOfBuy || item.adminActionAt || Date.now()).toLocaleDateString(),
        status: item.isFakePaymentProof ? 'Fake Payment Rejected' : item.permanentLink ? 'Active & Live' : 'Order Recorded',
        isFakePaymentProof: Boolean(item.isFakePaymentProof),
        adminFakePaymentNote: item.adminFakePaymentNote || '',
        isTemporary: true,
      }));

    // Deduplicate formatted active links
    const uniqueActiveOrders = [];
    const activeSeen = new Set();
    formattedActiveOrders.forEach((ao) => {
      const key = String(ao.id || ao.wishingUrl || ao.wishingSlug);
      if (!activeSeen.has(key)) {
        activeSeen.add(key);
        uniqueActiveOrders.push(ao);
      }
    });

    const combinedHistory = [...formattedHistoryOrders];
    uniqueActiveOrders.forEach((ao) => {
      const exists = combinedHistory.some(
        (ho) => String(ho.id) === String(ao.id) || (ho.wishingUrl && ho.wishingUrl === ao.wishingUrl)
      );
      if (!exists) {
        combinedHistory.push(ao);
      }
    });

    const uniqueHistoryOrders = [];
    const historySeen = new Set();
    combinedHistory.forEach((ho) => {
      const key = String(ho.id || ho.wishingUrl || ho.wishingSlug);
      if (!historySeen.has(key)) {
        historySeen.add(key);
        uniqueHistoryOrders.push(ho);
      }
    });

    uniqueActiveOrders.sort((a, b) => b.rawDate - a.rawDate);
    uniqueHistoryOrders.sort((a, b) => b.rawDate - a.rawDate);

    res.json({
      success: true,
      orders: uniqueActiveOrders,
      activeLinks: uniqueActiveOrders,
      historyLinks: uniqueHistoryOrders,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Find Order by ID or Slug
// Update Purchased Wish Link Details (User or Admin)
app.put('/api/orders/:id/update', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { senderName, receiverName, specialMessage, themeColor, musicTrack } = req.body;

    let order = await PurchasedWeb.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { purchaseId: id }],
    });

    if (!order) {
      order = await PermanentPurchasedWeb.findOne({
        $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { purchaseId: id }],
      });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Wish Link Order not found.' });
    }

    const adminEmails = ['kunal.81789vishu@gmail.com', 'yash.97184@ybl'];
    const isAdmin = req.user.role === 'admin' || adminEmails.includes((req.user.email || '').toLowerCase());
    
    if (order.author && order.author.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this wish link.' });
    }

    if (senderName && senderName.trim()) order.sender = senderName.trim();
    if (receiverName && receiverName.trim()) order.receiver = receiverName.trim();
    if (specialMessage && specialMessage.trim()) order.specialMsg = [specialMessage.trim()];
    if (themeColor && themeColor.trim()) order.themeColor = themeColor.trim();
    if (musicTrack && musicTrack.trim()) order.musicTrack = musicTrack.trim();

    await order.save();

    if (req.user && req.user.id) {
      try {
        await User.updateOne(
          { _id: req.user.id, 'webCollection.purchasedId': order._id },
          {
            $set: {
              'webCollection.$.receiver': order.receiver,
            },
          }
        );
      } catch (uErr) {
        console.log('webCollection update error:', uErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Wish Link details updated successfully in database!',
      order: {
        id: order.purchaseId || String(order._id),
        wishingSlug: order.purchaseId || String(order._id),
        wishingUrl: order.webUrl,
        templateName: order.webName,
        webName: order.webName,
        senderName: order.sender,
        receiverName: order.receiver,
        specialMessage: order.specialMsg ? order.specialMsg[0] : '',
        uploadedImages: (order.images || []).map((img) => (typeof img === 'string' ? img : img.url)),
        themeColor: order.themeColor,
        totalPrice: order.price,
        purchaseDate: new Date(order.date || Date.now()).toLocaleDateString(),
        status: order.isLive ? 'Active & Ready' : 'Processing',
        musicTrack: order.musicTrack,
        isTemporary: order.isTemporary,
      },
    });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Find Order by ID or Slug

app.get('/api/orders/find', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Please enter Order ID or Link Slug' });

    let order = await PurchasedWeb.findOne({
      $or: [{ purchaseId: String(query).trim() }, { webUrl: { $regex: String(query).trim(), $options: 'i' } }],
    }).lean();

    if (!order) {
      order = await PermanentPurchasedWeb.findOne({
        $or: [{ purchaseId: String(query).trim() }, { webUrl: { $regex: String(query).trim(), $options: 'i' } }],
      }).lean();
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'No wish link or order found matching query.' });
    }

    res.json({
      success: true,
      order: {
        id: order.purchaseId,
        wishingSlug: order.purchaseId,
        wishingUrl: order.webUrl,
        templateName: order.webName || 'Wishing Template',
        webName: order.webName || 'Wishing Template',
        senderName: order.sender,
        receiverName: order.receiver,
        specialMessage: order.specialMsg ? order.specialMsg[0] : '',
        uploadedImages: (order.images || []).map((img) => img.url),
        themeColor: order.themeColor,
        totalPrice: order.price,
        purchaseDate: new Date(order.date).toLocaleDateString(),
        status: order.isLive ? 'Active & Ready' : 'Processing',
        musicTrack: order.musicTrack,
        isTemporary: order.isTemporary,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- ADMIN ONLY ENDPOINTS ---------------- //

app.get('/api/admin/orders', authenticateToken, adminOnly, async (req, res) => {
  try {
    const tempOrders = await PurchasedWeb.find({}).sort({ date: -1 }).lean();
    const permOrders = await PermanentPurchasedWeb.find({}).sort({ date: -1 }).lean();

    const formattedTemp = tempOrders.map((o) => ({ ...o, dbType: 'Temporary (Primary)' }));
    const formattedPerm = permOrders.map((o) => ({ ...o, dbType: 'Permanent DB' }));

    const allOrders = [...formattedTemp, ...formattedPerm].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const templatesCount = await WebSample.countDocuments({});
    const usersCount = await User.countDocuments({});

    const pendingOrdersCount = allOrders.filter(
      (o) => o.isLive === false || o.isLive === 'false' || (o.price > 0 && o.isLive !== true)
    ).length;

    res.json({
      success: true,
      stats: {
        totalOrders: allOrders.length,
        tempOrdersCount: tempOrders.length,
        permOrdersCount: permOrders.length,
        pendingOrdersCount,
        templatesCount,
        usersCount,
      },
      orders: allOrders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Users List (Paginated 20 per batch + Search)
app.get('/api/admin/users', authenticateToken, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const search = req.query.search ? req.query.search.trim() : '';

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit) || 1;
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedUsers = await Promise.all(
      users.map(async (u) => {
        const tempCount = await PurchasedWeb.countDocuments({ author: u._id });
        const permCount = await PermanentPurchasedWeb.countDocuments({ author: u._id });
        return {
          ...u,
          totalLinksCount: tempCount + permCount,
        };
      })
    );

    res.json({
      success: true,
      users: formattedUsers,
      page,
      limit,
      totalUsers,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin User Role Toggle
app.post('/api/admin/users/:id/toggle-admin', authenticateToken, adminOnly, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    targetUser.role = targetUser.role === 'admin' ? 'user' : 'admin';
    targetUser.isAdmin = targetUser.role === 'admin';
    await targetUser.save();

    res.json({ success: true, message: `User role updated to ${targetUser.role}`, user: targetUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete User Account
app.delete('/api/admin/users/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Template
app.post('/api/admin/templates', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { webName, webUrl, description, priceForTemporary, priceForPermanent, imageNeeded, priority, tags, imageUrl } = req.body;

    if (!webName || !webUrl) {
      return res.status(400).json({ success: false, message: 'Web Name and Web URL are required.' });
    }

    const newTemplate = new WebSample({
      webName: webName.trim(),
      webUrl: webUrl.trim(),
      description: description ? description.trim() : 'Interactive wishing template',
      priceForTemporary: typeof priceForTemporary === 'number' ? priceForTemporary : Number(priceForTemporary) || 0,
      priceForPermanent: typeof priceForPermanent === 'number' ? priceForPermanent : Number(priceForPermanent) || 399,
      imageNeeded: typeof imageNeeded === 'number' ? imageNeeded : 5,
      priority: Number(priority) || 10,
      tags: Array.isArray(tags) ? tags : ['birthday', 'all'],
      imageUrl: { url: imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800' },
      isLive: true,
    });

    await newTemplate.save();
    res.json({ success: true, message: 'New template added successfully!', template: newTemplate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper to find template by ObjectId or String ID
const findTemplateSafely = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const found = await WebSample.findById(id);
    if (found) return found;
  }
  return await WebSample.findOne({ webName: new RegExp(id, 'i') });
};

// Edit Template (PUT)
app.put('/api/admin/templates/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { webName, webUrl, description, priceForTemporary, priceForPermanent, imageNeeded, priority, tags, imageUrl } = req.body;

    const template = await findTemplateSafely(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    if (webName) template.webName = webName.trim();
    if (webUrl) template.webUrl = webUrl.trim();
    if (description !== undefined) template.description = description.trim();
    if (priceForTemporary !== undefined) template.priceForTemporary = Number(priceForTemporary);
    if (priceForPermanent !== undefined) template.priceForPermanent = Number(priceForPermanent);
    if (imageNeeded !== undefined) template.imageNeeded = Number(imageNeeded);
    if (priority !== undefined) template.priority = Number(priority);
    if (Array.isArray(tags)) template.tags = tags;
    if (imageUrl) template.imageUrl = { url: imageUrl.trim() };

    await template.save();
    res.json({ success: true, message: 'Template updated successfully!', template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Edit Template (POST fallback for legacy forms)
app.post('/api/admin/templates/:id/edit', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { webName, webUrl, description, priceForTemporary, priceForPermanent, imageNeeded, priority, tags, imageUrl } = req.body;

    const template = await findTemplateSafely(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    if (webName) template.webName = webName.trim();
    if (webUrl) template.webUrl = webUrl.trim();
    if (description !== undefined) template.description = description.trim();
    if (priceForTemporary !== undefined) template.priceForTemporary = Number(priceForTemporary);
    if (priceForPermanent !== undefined) template.priceForPermanent = Number(priceForPermanent);
    if (imageNeeded !== undefined) template.imageNeeded = Number(imageNeeded);
    if (priority !== undefined) template.priority = Number(priority);
    if (Array.isArray(tags)) template.tags = tags;
    if (imageUrl) template.imageUrl = { url: imageUrl.trim() };

    await template.save();
    res.json({ success: true, message: 'Template updated successfully!', template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/templates/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    await WebSample.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Template deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/orders/:id/approve', authenticateToken, adminOnly, async (req, res) => {
  try {
    const filter = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ purchaseId: req.params.id }, { _id: req.params.id }] }
      : { purchaseId: req.params.id };

    let order = await PurchasedWeb.findOne(filter);
    if (order) {
      const targetLiveState = !order.isLive;
      const updatedOrder = await PurchasedWeb.findOneAndUpdate(
        filter,
        { $set: { isLive: targetLiveState, adminInteracted: true, adminInterected: true } },
        { new: true }
      );
      return res.json({
        success: true,
        message: `Order live status updated to ${updatedOrder.isLive}`,
        isLive: updatedOrder.isLive,
        adminInteracted: updatedOrder.adminInteracted,
      });
    }

    let permOrder = await PermanentPurchasedWeb.findOne(filter);
    if (permOrder) {
      const targetLiveState = !permOrder.isLive;
      const updatedPermOrder = await PermanentPurchasedWeb.findOneAndUpdate(
        filter,
        { $set: { isLive: targetLiveState, adminInteracted: true, adminInterected: true } },
        { new: true }
      );
      return res.json({
        success: true,
        message: `Permanent order live status updated to ${updatedPermOrder.isLive}`,
        isLive: updatedPermOrder.isLive,
        adminInteracted: updatedPermOrder.adminInteracted,
      });
    }

    res.status(404).json({ success: false, message: 'Order not found.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/orders/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const reason = String(req.query.reason || req.body?.reason || '').trim().toLowerCase();
    const isFakePayment = reason === 'fake-payment' || reason === 'fake_payment';

    const filter = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ purchaseId: req.params.id }, { _id: req.params.id }] }
      : { purchaseId: req.params.id };

    let toDelete = await PurchasedWeb.findOne(filter);
    if (!toDelete) {
      toDelete = await PermanentPurchasedWeb.findOne(filter);
    }

    if (!toDelete) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (isFakePayment && toDelete.author) {
      const fakePaymentNote = 'Fake payment proof submitted. Request was rejected by admin.';
      await User.updateOne(
        { _id: toDelete.author },
        {
          $push: {
            webCollection: {
              purchasedId: toDelete._id,
              webName: toDelete.webName || 'Wish Link Webpage',
              receiver: toDelete.receiver || '',
              price: toDelete.price || 0,
              dateOfBuy: toDelete.date || new Date(),
              isFakePaymentProof: true,
              adminFakePaymentNote: fakePaymentNote,
              adminActionAt: new Date(),
              permanentLink: '',
            },
          },
        }
      );
    }

    await PurchasedWeb.findOneAndDelete(filter);
    await PermanentPurchasedWeb.findOneAndDelete(filter);

    res.json({
      success: true,
      message: isFakePayment ? 'Order rejected & marked as Fake Payment Proof.' : 'Order deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- AI CHATBOT ROUTE ---------------- //

app.post('/api/chat', optionalAuth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    const aiReply = await generateReply(message, conversationHistory || []);

    if (req.user) {
      let userChat = await Chat.findOne({ user: req.user.id });
      if (!userChat) {
        userChat = new Chat({ user: req.user.id, messages: [] });
      }
      userChat.messages.push({ senderRole: 'user', text: message });
      userChat.messages.push({ senderRole: 'bot', text: aiReply });
      userChat.lastMessage = aiReply;
      userChat.lastMessageAt = new Date();
      await userChat.save();
    }

    res.json({ success: true, reply: aiReply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- FEEDBACK & SUGGESTIONS ROUTE ---------------- //

const feedbackSchema = new mongoose.Schema({
  feedbackmsg: { type: String, default: '' },
  suggestion: { type: String, default: '' },
  comment: { type: String, default: '' },
  message: { type: String, default: '' },
  text: { type: String, default: '' },
  content: { type: String, default: '' },
  email: { type: String, default: '' },
  userName: { type: String, default: '' },
  name: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
});
const Feedback = mongoose.model('feedback', feedbackSchema, 'feedbacks');

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, userName, email, rating, suggestion, feedbackmsg, comment, message } = req.body;
    const bodyText = (feedbackmsg || suggestion || comment || message || '').trim();
    if (!bodyText) {
      return res.status(400).json({ success: false, message: 'Feedback message is required.' });
    }

    const cleanName = (name || userName || '').trim() || 'Anonymous User';

    const newFeedback = new Feedback({
      feedbackmsg: bodyText,
      suggestion: bodyText,
      comment: bodyText,
      userName: cleanName,
      name: cleanName,
      email: email?.trim() || '',
      rating: Number(rating) || 5,
    });

    await newFeedback.save();
    res.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/feedback', authenticateToken, adminOnly, async (req, res) => {
  try {
    let rawFeedbacks = [];
    try {
      rawFeedbacks = await Feedback.find().sort({ date: -1, createdAt: -1 }).limit(100).lean();
    } catch (dbErr) {
      console.error('Feedback DB query error:', dbErr.message);
    }

    const feedbacks = rawFeedbacks.map((f) => {
      const realMessage = f.feedbackmsg || f.suggestion || f.comment || f.message || f.text || f.content || '';
      const realName = f.userName || f.name || (f.email ? f.email.split('@')[0] : 'Anonymous User');

      return {
        _id: String(f._id || Math.random()),
        name: realName,
        email: f.email || 'No email provided',
        rating: Number(f.rating) || 5,
        suggestion: realMessage || 'User feedback submitted',
        feedbackmsg: realMessage,
        createdAt: f.date || f.createdAt || new Date(),
      };
    });

    res.json({ success: true, feedbacks });
  } catch (err) {
    console.error('Admin feedback fetch error:', err);
    res.status(500).json({ success: false, message: err.message, feedbacks: [] });
  }
});

app.delete('/api/admin/feedback/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Feedback deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`VishLink Backend server listening on http://localhost:${PORT}`);
});
