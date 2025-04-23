'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfilePage() {
  const { id: nationalId } = useParams();
  const router = useRouter();
  
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // جلب معلومات المستخدم من واجهة API بدلاً من استدعاء الدالة مباشرة
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user-info?nationalId=${nationalId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('لم يتم العثور على المستخدم');
          } else {
            throw new Error('فشل في جلب معلومات المستخدم');
          }
        }
        
        const data = await response.json();
        
        if (data.success && data.user) {
          setUserInfo(data.user);
        } else {
          throw new Error(data.error || 'لم يتم العثور على بيانات المستخدم');
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (nationalId) {
      fetchUserInfo();
    }
  }, [nationalId]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleBackToVerify = () => {
    router.push(`/verify/${nationalId}`);
  };
  
  const renderUserInfoField = (label, value) => {
    return (
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value || 'غير متوفر'}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-lg font-medium text-gray-700">جاري تحميل معلومات المستخدم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-3 text-lg font-medium text-gray-900">خطأ في جلب البيانات</h2>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </div>
          <p className="text-center text-gray-600 my-4">
            قد تحتاج إلى التحقق من رمز OTP أولاً قبل الوصول إلى هذه المعلومات.
          </p>
          <button 
            onClick={handleBackToVerify}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة إلى صفحة التحقق
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-3 text-lg font-medium text-gray-900">لم يتم العثور على البيانات</h2>
            <p className="mt-2 text-sm text-gray-500">لم نتمكن من العثور على معلومات لهذا الرقم الوطني</p>
          </div>
          <button 
            onClick={handleBackToVerify}
            className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة إلى صفحة التحقق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* رأس الصفحة */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">بطاقة معلومات المستخدم</h1>
            <p className="text-lg">الرقم الوطني: {nationalId}</p>
          </div>
          
          {/* المعلومات الشخصية */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* صورة المستخدم والمعلومات الأساسية */}
              <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                <div className="mx-auto bg-gray-200 rounded-full w-40 h-40 mb-4 overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{userInfo.personal_info?.full_name || userInfo.fullName}</h2>
                <p className="text-gray-600 mb-1">{userInfo.occupation}</p>
                <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-700 font-semibold">رقم الهاتف: {userInfo.phone}</p>
                  <p className="text-gray-700">البريد الإلكتروني: {userInfo.email}</p>
                </div>
              </div>
              
              {/* معلومات مفصلة */}
              <div className="md:w-2/3 md:pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderUserInfoField('مكان الميلاد', userInfo.personal_info?.place_of_birth || userInfo.placeOfBirth)}
                  {renderUserInfoField('تاريخ الميلاد', userInfo.personal_info?.date_of_birth || userInfo.dateOfBirth)}
                  {renderUserInfoField('الجنس', userInfo.personal_info?.gender || userInfo.gender)}
                  {renderUserInfoField('الحالة الاجتماعية', userInfo.personal_info?.marital_status || userInfo.maritalStatus)}
                  {renderUserInfoField('الجنسية', userInfo.personal_info?.nationality || userInfo.nationality)}
                  {renderUserInfoField('العنوان', userInfo.personal_info?.address || userInfo.address)}
                </div>
                
                <div className="mt-6">
                  <div className="bg-green-50 p-4 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 font-semibold">
                      حالة التحقق: {userInfo.verificationStatus === 'verified' ? 'تم التحقق' : 'غير متحقق'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* أزرار التنقل */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              onClick={handleBackToVerify}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors"
            >
              العودة للتحقق
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 