import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_API_URL || 'https://backend-kappa-three-25.vercel.app/api';
  
  try {
    // Test backend health
    const response = await fetch(`${backendUrl.replace('/api', '')}/api/health`);
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'API proxy test successful',
      backendUrl,
      backendHealth: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'API proxy test failed',
      backendUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}