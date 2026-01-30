// Payment Gateway Integration
// Using Razorpay for Indian payments (₹)

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // in paise (₹1 = 100 paise)
  currency: string;
  beatId: number;
  beatTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
}

// Check if demo mode is enabled (set to true for testing without backend)
const DEMO_MODE = process.env.NEXT_PUBLIC_PAYMENT_DEMO_MODE === 'true' || true; // Default to true for demo

export const initiatePayment = async (options: PaymentOptions): Promise<void> => {
  // Demo mode: Simulate payment without Razorpay
  if (DEMO_MODE) {
    return simulatePayment(options);
  }

  // Production mode: Use Razorpay
  return new Promise((resolve, reject) => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        createPayment(options, resolve, reject);
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay SDK'));
      };
      document.body.appendChild(script);
    } else {
      createPayment(options, resolve, reject);
    }
  });
};

// Simulate payment for demo/testing purposes
const simulatePayment = async (options: PaymentOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Show a confirmation dialog
    const confirmed = window.confirm(
      `Demo Payment Mode\n\n` +
      `Beat: ${options.beatTitle}\n` +
      `Amount: ₹${(options.amount / 100).toFixed(2)}\n\n` +
      `Click OK to simulate successful payment.\n` +
      `Click Cancel to cancel.`
    );

    if (confirmed) {
      // Simulate payment processing delay
      setTimeout(() => {
        const orderId = `demo_order_${Date.now()}`;
        const paymentId = `demo_pay_${Date.now()}`;
        
        console.log('Demo Payment Successful:', {
          orderId,
          paymentId,
          amount: options.amount,
          beatId: options.beatId,
        });

        // Store purchase in localStorage for demo
        const purchases = JSON.parse(localStorage.getItem('demo_purchases') || '[]');
        purchases.push({
          orderId,
          paymentId,
          beatId: options.beatId,
          beatTitle: options.beatTitle,
          amount: options.amount,
          userId: options.userId,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('demo_purchases', JSON.stringify(purchases));

        resolve();
      }, 1000);
    } else {
      reject(new Error('Payment cancelled by user'));
    }
  });
};

const createPayment = async (
  options: PaymentOptions,
  resolve: () => void,
  reject: (error: Error) => void
) => {
  try {
    // In production, get order_id from your backend API
    // First, create order on your backend
    const orderResponse = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || 'INR',
        beatId: options.beatId,
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create payment order. Please check your backend API.');
    }

    const { orderId } = await orderResponse.json();

    if (!orderId) {
      throw new Error('Invalid order ID received from server');
    }

    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
      amount: options.amount,
      currency: options.currency || 'INR',
      name: 'Beat22',
      description: `Purchase: ${options.beatTitle}`,
      order_id: orderId,
      handler: async function (response: any) {
        try {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              beatId: options.beatId,
            }),
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
          }

          console.log('Payment successful:', response);
          resolve();
        } catch (error: any) {
          reject(new Error('Payment verification failed: ' + (error.message || 'Unknown error')));
        }
      },
      prefill: {
        name: options.userName,
        email: options.userEmail,
      },
      theme: {
        color: '#6366f1',
      },
      modal: {
        ondismiss: function() {
          reject(new Error('Payment cancelled by user'));
        },
      },
      notes: {
        beatId: options.beatId.toString(),
        userId: options.userId,
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    
    razorpay.on('payment.failed', function (response: any) {
      reject(new Error(response.error.description || 'Payment failed'));
    });

    razorpay.open();
  } catch (error: any) {
    reject(new Error('Failed to initiate payment: ' + (error.message || 'Unknown error')));
  }
};

// Alternative: Stripe integration (if you prefer Stripe)
export const initiateStripePayment = async (options: PaymentOptions): Promise<void> => {
  // In production, create a payment intent on your backend
  // For demo purposes, we'll show a redirect approach
  
  try {
    // This would typically be an API call to your backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || 'inr',
        beatId: options.beatId,
      }),
    });

    const { clientSecret } = await response.json();

    // Redirect to Stripe Checkout or use Stripe Elements
    // This is a simplified example
    window.location.href = `/checkout?client_secret=${clientSecret}`;
  } catch (error) {
    throw new Error('Failed to initiate payment');
  }
};
