import { motion } from 'framer-motion';

export default function OtpStatus({ status, onGenerateOtp, loading }) {
  // التحقق مما إذا كان OTP نشطًا أم لا
  const isOtpActive = status?.hasOtp && new Date(status.otpExpiresAt) > new Date();
  
  // حساب الوقت المتبقي لانتهاء صلاحية OTP
  const calculateTimeRemaining = () => {
    if (!isOtpActive) return null;
    
    const expiresAt = new Date(status.otpExpiresAt);
    const now = new Date();
    const diffMs = expiresAt - now;
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="text-center">
      {isOtpActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-4 bg-green-100 rounded-md mb-4">
            <p className="text-green-800 font-semibold">
              تم إنشاء رمز التحقق OTP
            </p>
            <p className="text-sm text-green-700 mt-2">
              ينتهي بعد: {calculateTimeRemaining()}
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            يرجى استخدام رمز التحقق في التطبيق الخاص بك
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-4 bg-yellow-100 rounded-md mb-4">
            <p className="text-yellow-800">
              {status?.hasOtp 
                ? 'انتهت صلاحية رمز التحقق OTP' 
                : 'لا يوجد رمز تحقق OTP نشط'}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGenerateOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? 'جارِ الإنشاء...' : 'إنشاء رمز تحقق OTP جديد'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
} 