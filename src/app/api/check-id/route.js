import { checkNationalId } from '../../../lib/api';

export default async function handler(req, res) {
    // السماح بكل من GET و POST
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    // استخراج الرقم الوطني من الجسم أو من query حسب نوع الطلب
    const nationalId = req.method === 'POST' ? req.body.nationalId : req.query.nationalId;
    
    if (!nationalId) {
      return res.status(400).json({ message: 'الرقم الوطني مطلوب' });
    }
    
    try {
      const exists = await checkNationalId(nationalId);
      return res.status(200).json({ exists });
    } catch (error) {
      console.error('Error checking national ID:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء التحقق من الرقم الوطني' });
    }
  }