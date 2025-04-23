import { NextResponse } from 'next/server';
import { getActiveOTPs } from '../../../lib/otpStorage';

// واجهة API لعرض جميع رموز OTP النشطة
// ملاحظة: هذه الواجهة للاختبار والتطوير فقط وينبغي إزالتها في الإنتاج
export async function GET(request) {
  try {
    const activeOTPs = getActiveOTPs();
    
    // حساب الرموز النشطة
    let activeCount = 0;
    Object.values(activeOTPs).forEach(otp => {
      if (otp.active) activeCount++;
    });
    
    return NextResponse.json({
      message: 'تم استرجاع رموز OTP النشطة بنجاح',
      count: Object.keys(activeOTPs).length,
      activeCount: activeCount,
      activeOTPs
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error getting active OTPs:', error);
    return NextResponse.json(
      { message: 'حدث خطأ أثناء استرجاع رموز OTP النشطة' },
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

// معالجة طلبات POST
export async function POST(request) {
  return NextResponse.json(
    { message: 'Method Not Allowed' },
    { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

// معالجة طلبات OPTIONS (CORS preflight)
export async function OPTIONS(request) {
  return NextResponse.json(
    null,
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
} 