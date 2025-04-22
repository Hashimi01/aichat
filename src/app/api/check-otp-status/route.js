import { getOtpStatus } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { nationalId } = req.query;
  
  if (!nationalId) {
    return res.status(400).json({ message: 'الرقم الوطني مطلوب' });
  }
  
  try {
    const status = getOtpStatus(nationalId);
    return res.status(200).json(status);
  } catch (error) {
    console.error('Error checking OTP status:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء التحقق من حالة OTP' });
  }
} 