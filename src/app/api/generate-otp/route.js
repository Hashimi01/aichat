import { NextResponse } from 'next/server';
import { generateOTP, getCurrentOTP } from '../../../lib/otpStorage';
import { getUserByNationalId } from '../../../lib/api';

export async function POST(request) {
  try {
    const { nationalId } = await request.json();
    
    // التحقق من صحة الرقم الوطني
    if (!nationalId || typeof nationalId !== 'string') {
      return new NextResponse(
        JSON.stringify({ message: 'الرجاء توفير رقم وطني صالح' }),
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
    
    // جلب بيانات المستخدم للتحقق من وجوده
    const user = await getUserByNationalId(nationalId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'لم يتم العثور على مستخدم بهذا الرقم الوطني' }),
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
    
    // التحقق من وجود OTP نشط أولاً
    let otp = getCurrentOTP(nationalId);
    
    // إذا لم يكن هناك OTP نشط، قم بإنشاء واحد جديد
    if (!otp) {
      const otpData = generateOTP(nationalId);
      otp = otpData.otp;
    }
    
    // في التطبيق الحقيقي، هنا سيتم إرسال OTP عبر SMS أو البريد الإلكتروني
    console.log(`OTP for user ${nationalId}: ${otp}`);
    
    // إخفاء رقم الهاتف بشكل جزئي لتعزيز الأمان
    const maskedPhone = user.phone.replace(/(\d{3})\d+(\d{4})/, "$1*****$2");
    
    // إرجاع OTP في الاستجابة (هذا للاختبار فقط وغير آمن في بيئة الإنتاج)
    return new NextResponse(
      JSON.stringify({ 
        message: 'تم إرسال رمز التحقق بنجاح',
        maskedPhone: maskedPhone,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
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
    console.error('Error generating OTP:', error);
    return new NextResponse(
      JSON.stringify({ message: 'حدث خطأ أثناء إنشاء رمز التحقق' }),
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