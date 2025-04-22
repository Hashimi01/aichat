import { verifyOtp } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { nationalId, otp } = req.body;
  
  if (!nationalId || !otp) {
    return res.status(400).json({ message: 'الرقم الوطني ورمز التحقق OTP مطلوبان' });
  }
  
  try {
    const verification = verifyOtp(nationalId, otp);
    
    if (verification.valid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: verification.reason });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء التحقق من OTP' });
  }
} 