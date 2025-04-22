import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NationalIdForm({ onSubmit, loading }) {
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من صحة الرقم الوطني (مثال بسيط)
    if (!nationalId || nationalId.length < 9) {
      setError('الرجاء إدخال رقم وطني صحيح');
      return;
    }
    
    setError('');
    onSubmit(nationalId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="nationalId" className="block text-gray-700 mb-2">
          الرقم الوطني
        </label>
        <input
          id="nationalId"
          type="text"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل الرقم الوطني"
          disabled={loading}
        />
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {loading ? 'جارِ التحقق...' : 'تحقق من الرقم الوطني'}
      </motion.button>
    </form>
  );
} 