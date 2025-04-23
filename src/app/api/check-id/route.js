import { NextResponse } from 'next/server';
// استيراد البيانات مباشرة
import { data } from '../data/route';

// إضافة وظيفة مساعدة لإضافة رؤوس CORS
function corsResponse(body, status = 200) {
  return NextResponse.json(body, { 
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function POST(request) {
  console.log('POST request to /api/check-id received');
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { nationalId } = body;
    
    if (!nationalId) {
      console.log('National ID is missing');
      return corsResponse({ message: 'الرقم الوطني مطلوب' }, 400);
    }
    
    // التحقق من وجود الرقم الوطني مباشرة من البيانات
    console.log('Checking national ID:', nationalId);
    const exists = data.some(item => item.nin === nationalId);
    console.log('National ID exists:', exists);
    
    return corsResponse({ exists });
  } catch (error) {
    console.error('Error processing request:', error);
    return corsResponse({ message: 'Invalid request body' }, 400);
  }
}

export async function GET(request) {
  console.log('GET request to /api/check-id received');
  const searchParams = request.nextUrl.searchParams;
  const nationalId = searchParams.get('nationalId');
  
  if (!nationalId) {
    console.log('National ID is missing');
    return corsResponse({ message: 'الرقم الوطني مطلوب' }, 400);
  }
  
  // التحقق من وجود الرقم الوطني مباشرة من البيانات
  console.log('Checking national ID:', nationalId);
  const exists = data.some(item => item.nin === nationalId);
  console.log('National ID exists:', exists);
  
  return corsResponse({ exists });
}

// إضافة دعم طلبات OPTIONS لـ CORS
export async function OPTIONS(request) {
  return corsResponse(null);
}