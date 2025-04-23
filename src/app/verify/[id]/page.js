"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUserByNationalId } from '../../../lib/api';
import { getOTPRemainingTime, getCurrentOTP } from '../../../lib/otpStorage';

export default function VerifyPage() {
  const { id: nationalId } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [currentOTP, setCurrentOTP] = useState(''); // تخزين الـ OTP الحالي

  // جلب بيانات المستخدم وجلب/إنشاء OTP
  useEffect(() => {
    async function fetchUserAndGetOTP() {
      try {
        setLoading(true);
        
        // جلب بيانات المستخدم
        const user = await getUserByNationalId(nationalId);
        if (!user) {
          setError('لم يتم العثور على بيانات لهذا الرقم الوطني');
          setLoading(false);
          return;
        }
        
        setUserData(user);
        
        // التحقق أولاً من وجود OTP حالي عبر API
        try {
          const otpsResponse = await fetch('/api/get-active-otps');
          const otpsData = await otpsResponse.json();
          
          // إذا وجد OTP حالي، استخدمه
          if (otpsData.activeOTPs && otpsData.activeOTPs[nationalId]) {
            const activeOTP = otpsData.activeOTPs[nationalId];
            setCurrentOTP(activeOTP.otp);
            setCountdown(activeOTP.remainingTime);
            setCodeSent(true);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching active OTP:', err);
          // نستمر حتى لو فشل جلب الـ OTPs
        }
        
        // إذا لم يكن هناك OTP نشط، نقوم بطلب إنشاء واحد
        // ملاحظة: سيقوم النظام الجديد بإرجاع الرمز الموجود إذا كان نشطاً
        // لا يتم إنشاء رمز جديد إلا إذا لم يكن هناك رمز أو انتهت صلاحيته
        const response = await fetch('/api/generate-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nationalId })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.message || 'حدث خطأ أثناء إرسال رمز التحقق');
        } else {
          // تم إرسال OTP بنجاح
          setCodeSent(true);
          
          // تخزين الـ OTP الذي تم إنشاؤه أو استرجاعه
          if (data.otp) {
            setCurrentOTP(data.otp);
          }
          
          // الحصول على الوقت المتبقي
          const remainingTime = getOTPRemainingTime(nationalId);
          setCountdown(remainingTime || 600);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'حدث خطأ أثناء جلب بيانات المستخدم');
      } finally {
        setLoading(false);
      }
    }

    if (nationalId) {
      fetchUserAndGetOTP();
    }
  }, [nationalId]);

  // العد التنازلي للوقت المتبقي
  useEffect(() => {
    if (codeSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeSent, countdown]);

  // طلب إعادة إرسال OTP - سيعيد نفس الرمز إذا كان نشطاً
  const handleResendCode = async () => {
    try {
      setVerifying(true);
      
      // تحقق أولاً من الوقت المتبقي - إذا كان هناك وقت، لا حاجة للإرسال
      const remainingTime = getOTPRemainingTime(nationalId);
      if (remainingTime > 0) {
        // هناك رمز نشط بالفعل
        const existingOTP = getCurrentOTP(nationalId);
        if (existingOTP) {
          setCurrentOTP(existingOTP);
          setCountdown(remainingTime);
          setCodeSent(true);
          setOtpError('');
          setVerifying(false);
          return;
        }
      }
      
      // إذا لم يكن هناك رمز نشط، إرسال طلب للحصول على رمز جديد
      const response = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setOtpError(data.message || 'حدث خطأ أثناء إعادة إرسال رمز التحقق');
      } else {
        // تم إرسال OTP بنجاح
        setCodeSent(true);
        setOtpError('');
        
        // تحديث الـ OTP الحالي
        if (data.otp) {
          setCurrentOTP(data.otp);
        }
        
        // تحديث العد التنازلي
        const newRemaining = getOTPRemainingTime(nationalId);
        setCountdown(newRemaining || 600);
      }
    } catch (err) {
      console.error('Error:', err);
      setOtpError(err.message || 'حدث خطأ أثناء إعادة إرسال رمز التحقق');
    } finally {
      setVerifying(false);
    }
  };

  // التحقق من OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setOtpError('يرجى إدخال رمز تحقق صحيح مكون من 6 أرقام');
      return;
    }
    
    try {
      setVerifying(true);
      setOtpError('');
      
      // إرسال طلب التحقق من OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nationalId, 
          otpCode: verificationCode 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setOtpError(data.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
      } else {
        // تم التحقق بنجاح
        setVerificationSuccess(true);
        
        // الانتقال إلى الصفحة الرئيسية بعد 3 ثوانٍ
        setTimeout(() => {
          router.push(`/user/${nationalId}`);
        }, 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setOtpError(err.message || 'حدث خطأ أثناء التحقق من الرمز');
    } finally {
      setVerifying(false);
    }
  };

  // نسخ الـ OTP إلى الحافظة
  const copyOTPToClipboard = () => {
    if (currentOTP) {
      navigator.clipboard.writeText(currentOTP);
      // يمكن إضافة إشعار بأنه تم النسخ
    }
  };

  // استخدام الـ OTP مباشرة
  const useOTP = () => {
    if (currentOTP) {
      setVerificationCode(currentOTP);
    }
  };

  // تنسيق الوقت المتبقي
  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // محتوى التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">حدث خطأ</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // لم يتم العثور على بيانات المستخدم
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">الرقم الوطني غير موجود</h2>
          <p className="text-gray-600">لم نتمكن من العثور على معلومات لهذا الرقم الوطني</p>
        </div>
      </div>
    );
  }

  // حالة التحقق الناجح
  if (verificationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100" dir="rtl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
        >
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">تم التحقق بنجاح</h2>
          <p className="text-gray-600 mb-4">تم التحقق من هويتك بنجاح، جاري تحويلك...</p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="bg-green-500 h-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // عرض نموذج التحقق
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
      dir="rtl"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6">التحقق من الهوية</h1>
        
        <div className="mb-6 text-center">
          <p className="mb-1 text-black">الاسم: <span className="font-semibold text-black">{userData.personal_info.full_name}</span></p>
          <p className="mb-4 text-black">الرقم الوطني: <span className="font-semibold text-black">{nationalId}</span></p>
          
          <p className="text-sm text-black">تم إرسال رمز التحقق إلى رقم الهاتف المسجل: {userData.phone.replace(/(\d{3})\d+(\d{4})/, "$1*****$2")}</p>
          
          {countdown > 0 && (
            <p className="text-xs text-blue-500 mt-1">
              الوقت المتبقي: {formatRemainingTime(countdown)}
            </p>
          )}

          {/* عرض رمز OTP الثابت */}
          {currentOTP && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-black mb-2">رمز التحقق الحالي:</p>
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="text-lg font-mono bg-blue-50 p-2 rounded-md border border-blue-200 text-black">
                  {currentOTP}
                </div>
                <button 
                  onClick={copyOTPToClipboard}
                  className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded text-black"
                  title="نسخ إلى الحافظة"
                >
                  نسخ
                </button>
                <button 
                  onClick={useOTP}
                  className="text-xs bg-blue-200 hover:bg-blue-300 p-1 rounded text-black"
                  title="استخدام الرمز"
                >
                  استخدام
                </button>
              </div>
              <p className="text-xs text-green-600 mt-2">
                هذا الرمز ثابت لمدة 10 دقائق كاملة
              </p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="block text-sm font-medium text-black">
              رمز التحقق
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="أدخل رمز التحقق المكون من 6 أرقام"
              className="w-full p-3 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              maxLength={6}
              disabled={verifying}
            />
          </div>

          {otpError && (
            <p className="text-sm text-red-600 text-center">{otpError}</p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={verifying}
          >
            {verifying ? 'جارِ التحقق...' : 'تحقق'}
          </motion.button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={handleResendCode}
            disabled={countdown > 0 || verifying}
            className={`text-sm ${countdown > 0 || verifying ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
          >
            {countdown > 0 
              ? `إعادة إرسال الرمز بعد (${formatRemainingTime(countdown)})` 
              : verifying ? 'جارِ إعادة الإرسال...' : 'إعادة إرسال الرمز'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
