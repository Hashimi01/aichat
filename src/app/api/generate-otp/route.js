import { checkNationalId } from '../../src/lib/api';
import { generateOtp } from '../../src/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { nationalId } = req.body;
  
  if (!nationalId) {
    return res.status(400).json({ message: 'الرقم الوطني مطلوب' });
  }
  
  try {
    // التحقق من وجود الرقم الوطني قبل إنشاء OTP
    const exists = await checkNationalId(nationalId);
    
    if (!exists) {
      return res.status(404).json({ message: 'الرقم الوطني غير موجود' });
    }
    
    const otpData = generateOtp(nationalId);
    
    // لا نرسل رمز OTP في الاستجابة للأمان، بل نرسل فقط المعلومات المتعلقة بالتوقيت
    return res.status(200).json({
      success: true,
      createdAt: otpData.createdAt,
      expiresAt: otpData.expiresAt
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إنشاء OTP' });
  }
} 