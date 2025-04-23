import { NextResponse } from 'next/server';
import { getOtpStatus } from '../../../lib/otpStorage';

export async function GET(request) {
  // تمكين CORS
  const origin = request.headers.get('origin');

  // الحصول على معرف المستخدم من المعلمات
  const searchParams = request.nextUrl.searchParams;
  const nationalId = searchParams.get('nationalId');

  if (!nationalId) {
    return new NextResponse(
      JSON.stringify({ message: 'الرقم الوطني مطلوب' }),
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

  try {
    const status = getOtpStatus(nationalId);
    return new NextResponse(
      JSON.stringify(status),
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
    console.error('Error checking OTP status:', error);
    return new NextResponse(
      JSON.stringify({ message: 'حدث خطأ أثناء التحقق من حالة OTP' }),
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