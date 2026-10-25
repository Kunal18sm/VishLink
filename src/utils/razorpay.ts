/**
 * Razorpay Standard Web Checkout Integration Helper
 * VishLink - Digital Wishing Webpage Generator
 */

export interface RazorpayOrderResponse {
  success: boolean;
  order_id: string;
  id?: string;
  amount: number;
  currency: string;
  receipt?: string;
  key_id?: string;
  message?: string;
}

export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OpenCheckoutParams {
  amountInPaise: number;
  currency?: string;
  receipt?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  themeColor?: string;
}

/**
 * Dynamically loads Razorpay checkout script if not already present on page
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');

    let attempts = 0;
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        clearInterval(interval);
        resolve(true);
      } else if (++attempts > 30) {
        clearInterval(interval);
        resolve(!!((window as any).Razorpay));
      }
    }, 100);

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        clearInterval(interval);
        resolve(true);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      clearInterval(interval);
      resolve(true);
    };
    script.onerror = () => {
      clearInterval(interval);
      console.error('Failed to load Razorpay SDK checkout.js');
      resolve(false);
    };
    document.head.appendChild(script);
  });
};

/**
 * Retrieves the public Razorpay Key ID from Vite env or fallback server endpoint
 */
export const getRazorpayKeyId = async (): Promise<string> => {
  const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }

  try {
    const res = await fetch('/api/razorpay/key');
    const data = await res.json();
    if (res.ok && data.success && data.key_id) {
      return data.key_id;
    }
  } catch (err) {
    console.warn('Could not fetch Razorpay key from backend:', err);
  }

  return '';
};

/**
 * Step 1: Create Order on backend (POST /api/create-order)
 */
export const createRazorpayOrder = async (
  amountInPaise: number,
  currency: string = 'INR',
  receipt?: string,
  notes?: Record<string, string>
): Promise<RazorpayOrderResponse> => {
  const token = localStorage.getItem('vishlink_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt,
      notes,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to initialize payment order with Razorpay.');
  }

  return data;
};

/**
 * Step 3: Verify Payment Signature on backend (POST /api/verify-payment)
 */
export const verifyRazorpayPayment = async (
  payload: RazorpayPaymentSuccess & { orderId?: string }
): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem('vishlink_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Payment signature verification failed.');
  }

  return data;
};

/**
 * Step 2: Open Razorpay Standard Checkout Modal
 */
export const launchRazorpayCheckout = async (
  params: OpenCheckoutParams
): Promise<RazorpayPaymentSuccess> => {
  console.log('[Razorpay] Initiating checkout with params:', params);

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error('Razorpay payment gateway SDK could not be loaded. Please check your internet connection.');
  }

  // 1. Create order on backend (amount in paise >= 100)
  console.log('[Razorpay] Requesting order creation from backend...');
  const orderData = await createRazorpayOrder(
    params.amountInPaise,
    params.currency || 'INR',
    params.receipt,
    params.notes
  );
  console.log('[Razorpay] Order created successfully:', orderData);

  const keyId = orderData.key_id || (await getRazorpayKeyId());
  if (!keyId) {
    throw new Error('Razorpay Key ID is missing. Please configure VITE_RAZORPAY_KEY_ID.');
  }

  // 2. Open standard web checkout modal
  return new Promise((resolve, reject) => {
    let isHandled = false;

    const options = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: params.name || 'VishLink',
      description: params.description || 'Personalized 3D Wishing Website Link',
      image: params.image || '/icons/icon-192.svg',
      order_id: orderData.order_id || orderData.id,
      prefill: params.prefill || {},
      notes: params.notes || {},
      theme: {
        color: params.themeColor || '#e15b70',
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          console.log('[Razorpay] Modal dismissed by user');
          if (!isHandled) {
            isHandled = true;
            reject(new Error('Payment window was closed by the user.'));
          }
        },
      },
      handler: async (response: RazorpayPaymentSuccess) => {
        console.log('[Razorpay] Payment successful response received:', response);
        isHandled = true;
        try {
          // Verify on backend
          console.log('[Razorpay] Verifying payment signature on backend...');
          const verifyRes = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          console.log('[Razorpay] Payment verified successfully:', verifyRes);
          resolve(response);
        } catch (err: any) {
          console.error('[Razorpay] Verification error:', err);
          reject(err);
        }
      },
    };

    try {
      console.log('[Razorpay] Opening checkout popup modal...');
      const rzpInstance = new (window as any).Razorpay(options);

      rzpInstance.on('payment.failed', (failedResponse: any) => {
        console.error('[Razorpay] Payment failed:', failedResponse);
        isHandled = true;
        const errorMsg =
          failedResponse.error?.description ||
          failedResponse.error?.reason ||
          'Payment failed. Please try again.';
        reject(new Error(errorMsg));
      });

      rzpInstance.open();
    } catch (launchErr: any) {
      console.error('[Razorpay] Error creating instance:', launchErr);
      reject(launchErr);
    }
  });
};
