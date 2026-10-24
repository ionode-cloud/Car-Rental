import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log(' Razorpay instance initialized');
  } catch (err) {
    console.warn('⚠️ Razorpay initialization failed:', err.message);
  }
} else {
  console.log('ℹ️ Razorpay keys not provided; using development test payment simulator.');
}

export default razorpayInstance;
