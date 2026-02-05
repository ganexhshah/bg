import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL || 'https://backend-kappa-three-25.vercel.app/api';
  
  try {
    console.log('🔍 Debug: Testing backend connection...');
    console.log('🔍 Backend URL:', backendUrl);
    
    // Test health endpoint
    const healthUrl = `${backendUrl.replace('/api', '')}/api/health`;
    console.log('🔍 Health URL:', healthUrl);
    
    const healthResponse = await fetch(healthUrl);
    const healthData = await healthResponse.json();
    
    console.log('🔍 Health Response:', healthResponse.status, healthData);
    
    // Test auth endpoint with dummy data
    const authUrl = `${backendUrl}/auth/login`;
    console.log('🔍 Auth URL:', authUrl);
    
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    const authText = await authResponse.text();
    console.log('🔍 Auth Response:', authResponse.status, authText);
    
    return NextResponse.json({
      success: true,
      message: 'Debug test completed',
      results: {
        backendUrl,
        health: {
          url: healthUrl,
          status: healthResponse.status,
          data: healthData
        },
        auth: {
          url: authUrl,
          status: authResponse.status,
          response: authText
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🔍 Debug Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Debug test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      backendUrl,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}