// استخدام قاعدة بيانات بسيطة في الذاكرة للتطوير
// في البيئة الإنتاجية يمكن استبدالها بقاعدة بيانات حقيقية مثل MongoDB أو PostgreSQL

let otpDatabase = {
  // nationalId: { otp: '123456', createdAt: Date, expiresAt: Date }
};

export function getOtpStatus(nationalId) {
  const otpData = otpDatabase[nationalId];
  
  if (!otpData) {
    return { hasOtp: false };
  }
  
  return {
    hasOtp: true,
    otpCreatedAt: otpData.createdAt,
    otpExpiresAt: otpData.expiresAt
  };
}

export function generateOtp(nationalId) {
  // إنشاء OTP عشوائي من 6 أرقام
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 دقائق من الآن
  
  otpDatabase[nationalId] = {
    otp,
    createdAt: now,
    expiresAt
  };
  
  return {
    otp,
    createdAt: now,
    expiresAt
  };
}

export function verifyOtp(nationalId, otpToVerify) {
  const otpData = otpDatabase[nationalId];
  
  if (!otpData) {
    return { valid: false, reason: 'لا يوجد OTP مرتبط بهذا الرقم الوطني' };
  }
  
  if (new Date() > otpData.expiresAt) {
    return { valid: false, reason: 'انتهت صلاحية رمز التحقق OTP' };
  }
  
  if (otpData.otp !== otpToVerify) {
    return { valid: false, reason: 'رمز التحقق OTP غير صحيح' };
  }
  
  return { valid: true };
} 