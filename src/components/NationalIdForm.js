// components/NationalIdForm.js
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NationalIdForm({ onSubmit, loading }) {
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');

  const validateNationalId = (id) => {
    // Basic validation - ensure ID is numeric and has 13 digits
    if (!/^\d{13}$/.test(id)) {
      return 'الرقم الوطني يجب أن يتكون من 13 رقم';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateNationalId(nationalId);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    onSubmit(nationalId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 text-right">
          الرقم الوطني
        </label>
        <input
          type="text"
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          placeholder="أدخل الرقم الوطني هنا"
          className="w-full p-3 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          dir="rtl"
        />
        {error && (
          <p className="text-sm text-red-600 text-right">{error}</p>
        )}
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري التحقق...
          </span>
        ) : (
          'تحقق'
        )}
      </motion.button>
    </form>
  );
}