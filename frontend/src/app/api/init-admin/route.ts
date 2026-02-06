import { NextResponse } from 'next/server';

export async function POST() {
  const backendUrl = process.env.BACKEND_API_URL || 'https://backend-kappa-three-25.vercel.app/api';
  
  try {
    console.log('🔧 Initializing admin user...');
    
    // Call backend to create admin user
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'hello.ganeshshah@gmail.com',
        password: 'anukarki',
        role: 'admin'
      })
    });
    
    const data = await response.json();
    
    console.log('🔧 Admin creation response:', response.status, data);
    
    return NextResponse.json({
      success: true,
      message: 'Admin initialization attempted',
      status: response.status,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🔧 Admin initialization error:', error);
    return NextResponse.json({
      success: false,
      message: 'Admin initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to initialize admin user',
    credentials: {
      email: 'hello.ganeshshah@gmail.com',
      password: 'anukarki'
    }
  });
}