"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NationalIdForm from '../../components/NationalIdForm';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (nationalId) => {
    setLoading(true);
    setError('');
    console.log('Submitting national ID:', nationalId);
    
    try {
      // التحقق من وجود الرقم الوطني
      console.log('Sending request to /api/check-id');
      const checkResponse = await fetch('/api/check-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId })
      });
      
      console.log('Response status:', checkResponse.status);
      
      // Try to parse the JSON response even if the status is not OK
      let checkData;
      try {
        checkData = await checkResponse.json();
        console.log('Response data:', checkData);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('خطأ في استقبال البيانات من الخادم');
      }
      
      if (!checkResponse.ok) {
        throw new Error(checkData.message || 'خطأ في التحقق من الرقم الوطني');
      }
      
      if (!checkData.exists) {
        setError('الرقم الوطني غير موجود');
        setLoading(false);
        return;
      }
      
      // الانتقال إلى صفحة التحقق
      console.log('Redirecting to verify page');
      router.push(`/verify/${nationalId}`);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'حدث خطأ ما');
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
        <h1 className="text-2xl font-bold text-center mb-6">التحقق من الرقم الوطني</h1>
        <NationalIdForm onSubmit={handleSubmit} loading={loading} />
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
} 