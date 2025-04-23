import { NextResponse } from 'next/server';
import { verifyOTP, getCurrentOTP, getOtpStatus } from '../../../lib/otpStorage';
import { getUserByNationalId } from '../../../lib/api';

export async function POST(request) {
  // تمكين CORS
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    // التحقق من كلا الاسمين المحتملين لرمز OTP (otpCode أو otp)
    const { nationalId, otpCode, otp } = body;
    
    // استخدام otpCode أو otp حسب ما هو متوفر
    const verificationCode = otpCode || otp;
    
    if (!nationalId || !verificationCode) {
      return new NextResponse(
        JSON.stringify({ message: 'الرقم الوطني ورمز التحقق مطلوبان' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    console.log(`Verifying OTP for ${nationalId}: ${verificationCode}`);
    
    // التحقق أولاً مما إذا كان هناك OTP مخزن لهذا المستخدم
    const otpStatus = getOtpStatus(nationalId);
    
    if (!otpStatus.exists) {
      console.log(`No OTP found for ${nationalId}`);
      return new NextResponse(
        JSON.stringify({ message: 'لم يتم العثور على رمز تحقق لهذا المستخدم' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // التحقق من رمز OTP
    const isValid = verifyOTP(nationalId, verificationCode);
    
    if (!isValid) {
      console.log(`OTP verification failed for ${nationalId}`);
      
      // التحقق مما إذا كان OTP غير صالح لأنه منتهي الصلاحية
      const currentOTP = getCurrentOTP(nationalId);
      
      if (currentOTP && currentOTP === verificationCode && !otpStatus.active) {
        return new NextResponse(
          JSON.stringify({ 
            message: 'رمز التحقق منتهي الصلاحية، يرجى طلب رمز جديد',
            expired: true 
          }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          }
        );
      }
      
      return new NextResponse(
        JSON.stringify({ message: 'رمز التحقق غير صحيح' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    console.log(`OTP verification successful for ${nationalId}`);
    
    // الحصول على بيانات المستخدم
    const userData = await getUserByNationalId(nationalId);
    
    if (!userData) {
      return new NextResponse(
        JSON.stringify({ message: 'لم يتم العثور على بيانات المستخدم' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // إرسال البيانات دون حساسة مثل الرقم الوطني الكامل
    const safeUserData = {
      name: userData.personal_info.full_name,
      dateOfBirth: userData.personal_info.date_of_birth,
      gender: userData.personal_info.gender,
      maskedPhone: userData.phone.replace(/(\d{3})\d+(\d{4})/, "$1*****$2"),
      address: userData.personal_info.address,
      // يمكن إضافة بيانات أخرى حسب الحاجة
    };
    
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: 'تم التحقق بنجاح',
        userData: safeUserData
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new NextResponse(
      JSON.stringify({ message: 'حدث خطأ أثناء التحقق من الرمز' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

// معالجة طلبات OPTIONS (CORS preflight)
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 