"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("adminLoggedIn", "true")
        localStorage.setItem("adminToken", data.data.token)
        localStorage.setItem("adminUser", JSON.stringify(data.data.user))
        router.push("/admin/dashboard")
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to simple authentication for demo
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("adminLoggedIn", "true")
        router.push("/admin/dashboard")
      } else {
        setError("Invalid username or password")
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-blue-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-300 border-4 border-black transform rotate-45"></div>
      <div className="absolute bottom-40 right-10 w-12 h-12 bg-orange-400 border-4 border-black transform -rotate-12"></div>

      <Card className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000000] p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-black transform -rotate-1 mb-2">🔐 Admin Login</h1>
          <p className="text-gray-700 font-bold">Access the admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-black text-black mb-2">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-black text-black mb-2">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-4 border-red-500 p-3 transform rotate-1">
              <p className="text-red-700 font-black text-sm">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login to Admin"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-300 transform -rotate-1">
          <p className="text-xs font-bold text-gray-600 text-center">
            Demo: admin / admin123
          </p>
        </div>
      </Card>
    </div>
  )
}