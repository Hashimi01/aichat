import { NextResponse } from 'next/server';

// تكوين محدد لسياسة CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 ساعة
};

export function middleware(request) {
  // تحديد ما إذا كان الطلب موجه إلى واجهة API
  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  
  // إذا لم يكن طلب API، استمر بدون تعديل
  if (!isApiRequest) {
    return NextResponse.next();
  }
  
  // معالجة طلبات CORS preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  // للطلبات الأخرى، أضف رؤوس CORS واستمر
  const response = NextResponse.next();
  
  // إضافة رؤوس CORS إلى الاستجابة
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// تكوين الميدلوير ليتم تطبيقه فقط على مسارات معينة
export const config = {
  matcher: [
    // طبق على جميع طلبات API
    '/api/:path*',
  ],
}; 