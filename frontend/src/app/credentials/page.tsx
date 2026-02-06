'use client';

import { useState } from 'react';

export default function CredentialsPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const credentials = {
    email: 'hello.ganeshshah@gmail.com',
    password: 'anukarki',
    backendUrl: 'https://backend-kappa-three-25.vercel.app/api',
    frontendUrl: 'https://www.anukarki.xyz'
  };

  const testBackendDirectly = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${credentials.backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();
      setTestResult({
        status: response.status,
        success: response.ok,
        data
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testThroughProxy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();
      setTestResult({
        status: response.status,
        success: response.ok,
        data
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          newPassword: credentials.password,
          secretKey: 'reset-admin-2026'
        })
      });

      const data = await response.json();
      setTestResult({
        status: response.status,
        success: response.ok,
        data,
        message: response.ok ? '✅ Password reset successful! Try logging in now.' : '❌ Password reset failed'
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reset-password/verify?email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`);
      const data = await response.json();
      setTestResult({
        status: response.status,
        success: response.ok,
        data
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Credentials & Testing</h1>
        
        {/* Credentials Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Credentials</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="font-medium w-32">Email:</span>
              <code className="bg-gray-100 px-3 py-1 rounded">{credentials.email}</code>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium w-32">Password:</span>
              <code className="bg-gray-100 px-3 py-1 rounded">{credentials.password}</code>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium w-32">Backend URL:</span>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">{credentials.backendUrl}</code>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testBackendDirectly}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Backend Directly'}
            </button>
            <button
              onClick={testThroughProxy}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Through Proxy'}
            </button>
            <button
              onClick={resetPassword}
              disabled={loading}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              {loading ? 'Resetting...' : '🔧 Reset Password'}
            </button>
            <button
              onClick={verifyPassword}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : '🔍 Verify Password'}
            </button>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>💡 Tip:</strong> If login fails, click &quot;Reset Password&quot; first, then try &quot;Test Through Proxy&quot; again.
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Result</h2>
            {testResult.message && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                {testResult.message}
              </div>
            )}
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="mb-2">
                <span className="font-medium">Status: </span>
                <span className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                  {testResult.status || 'Error'}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Success: </span>
                <span>{testResult.success ? 'Yes ✅' : 'No ❌'}</span>
              </div>
              <div>
                <span className="font-medium">Response:</span>
                <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto text-sm">
                  {JSON.stringify(testResult.data || testResult.error, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/admin" className="block text-blue-600 hover:underline">
              → Go to Admin Login
            </a>
            <a href="/api/debug" className="block text-blue-600 hover:underline" target="_blank">
              → View Debug Info
            </a>
            <a href="/api/test" className="block text-blue-600 hover:underline" target="_blank">
              → View Test Endpoint
            </a>
            <a href={`${credentials.backendUrl}/health`} className="block text-blue-600 hover:underline" target="_blank">
              → Backend Health Check
            </a>
          </div>
        </div>

        {/* MongoDB Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">If Login Still Fails</h2>
          <p className="mb-4">Update the password hash in MongoDB Atlas:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to MongoDB Atlas → blog database → users collection</li>
            <li>Find user with email: {credentials.email}</li>
            <li>Edit the document</li>
            <li>Replace password field with:</li>
          </ol>
          <code className="block bg-white p-3 rounded mt-2 text-sm break-all">
            $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWHvqqvG
          </code>
          <p className="mt-2 text-sm text-gray-600">This hash corresponds to password: {credentials.password}</p>
        </div>
      </div>
    </div>
  );
}