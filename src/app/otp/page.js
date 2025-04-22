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
    
    try {
      // التحقق من وجود الرقم الوطني
      const checkResponse = await fetch('/api/check-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId })
      });
      
      const checkData = await checkResponse.json();
      
      if (!checkResponse.ok) {
        throw new Error(checkData.message || 'خطأ في التحقق من الرقم الوطني');
      }
      
      if (!checkData.exists) {
        setError('الرقم الوطني غير موجود');
        setLoading(false);
        return;
      }
      
      // الانتقال إلى صفحة التحقق
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