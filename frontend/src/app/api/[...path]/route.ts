import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_URL || 'https://backend-kappa-three-25.vercel.app/api';

async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams?.path?.join('/') || '';
    const url = `${API_BASE_URL}/${path}`;
    
    console.log(`🔄 API Proxy: ${request.method} ${url}`);
    console.log(`🔧 Backend URL: ${API_BASE_URL}`);
    
    // Get the request body if it exists
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = JSON.stringify(await request.json());
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Forward headers (excluding host and content-length)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (!['host', 'content-length', 'connection'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Add query parameters
    const searchParams = new URL(request.url).searchParams;
    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    console.log(`📡 Final URL: ${finalUrl}`);

    const response = await fetch(finalUrl, {
      method: request.method,
      headers,
      body,
    });

    console.log(`📊 Response Status: ${response.status}`);

    // Get response data (works for both success and error)
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { success: false, message: text };
    }

    console.log(`📦 Response Data: ${JSON.stringify(responseData).substring(0, 200)}...`);

    // Return the response with the same status code
    return NextResponse.json(responseData, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('❌ API proxy error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'API proxy error',
        error: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: API_BASE_URL
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}