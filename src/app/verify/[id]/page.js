"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OtpStatus from '../../../../components/OtpStatus';

export default function VerifyPage({ params }) {
  const { id: nationalId } = params;
  const [loading, setLoading] = useState(true);
  const [otpStatus, setOtpStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkOtpStatus = async () => {
      try {
        const response = await fetch(`/api/check-otp-status?nationalId=${nationalId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'خطأ في التحقق من حالة OTP');
        }
        
        setOtpStatus(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'حدث خطأ ما');
      } finally {
        setLoading(false);
      }
    };

    checkOtpStatus();
  }, [nationalId]);

  const handleGenerateOtp = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'خطأ في إنشاء OTP');
      }
      
      // تحديث حالة OTP بعد الإنشاء
      setOtpStatus({
        hasOtp: true,
        otpCreatedAt: new Date().toISOString(),
        otpExpiresAt: data.expiresAt
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'حدث خطأ في إنشاء OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6">حالة رمز التحقق OTP</h1>
        <p className="text-center mb-6 text-gray-700">الرقم الوطني: {nationalId}</p>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center"
          >
            {error}
          </motion.div>
        ) : (
          <OtpStatus 
            status={otpStatus} 
            onGenerateOtp={handleGenerateOtp} 
            loading={loading}
          />
        )}
      </motion.div>
    </motion.div>
  );
} 