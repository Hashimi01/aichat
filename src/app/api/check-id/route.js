import { checkNationalId } from '../../../lib/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { nationalId } = req.body;
  
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