import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams?.path?.join('/') || '';
    const url = `${API_BASE_URL}/${path}`;
    
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

    const response = await fetch(finalUrl, {
      method: request.method,
      headers,
      body,
    });

    // Log the response for debugging
    console.log(`API Request: ${request.method} ${finalUrl}`);
    console.log(`Response Status: ${response.status}`);

    const responseData = await response.json();
    
    // Log response data for debugging
    if (!response.ok) {
      console.error('API Error Response:', responseData);
    }

    return NextResponse.json(responseData, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
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