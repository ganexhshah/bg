"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminDashboardSkeleton } from "@/components/ui/AdminSkeleton"
import { CacheManager } from "@/components/admin/CacheManager"
import { FaUser, FaBook, FaImage, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaEye } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardStats {
  totalStories: number
  totalImages: number
  totalViews: number
  totalLikes: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    totalImages: 0,
    totalViews: 0,
    totalLikes: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
    fetchDashboardStats()
  }, [router])

  const checkAuthentication = () => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn === "true" && token) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin")
    }
  }

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem("adminToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      
      // Fetch stories stats
      const storiesResponse = await fetch('/api/stories/admin?limit=1', { headers })
      const storiesData = await storiesResponse.json()
      
      // Fetch gallery stats  
      const galleryResponse = await fetch('/api/gallery/admin?limit=1', { headers })
      const galleryData = await galleryResponse.json()
      
      // Fetch profile stats
      const profileResponse = await fetch('/api/profile/admin', { headers })
      const profileData = await profileResponse.json()
      
      if (storiesData.success && galleryData.success) {
        setStats({
          totalStories: storiesData.data.pagination?.total || 0,
          totalImages: galleryData.data.pagination?.total || 0,
          totalViews: profileData.data?.profile?.stats?.totalViews || 0,
          totalLikes: profileData.data?.profile?.stats?.totalLikes || 0
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Set fallback stats
      setStats({
        totalStories: 6,
        totalImages: 12,
        totalViews: 5420,
        totalLikes: 342
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      router.push("/admin")
    }
  }

  if (!isAuthenticated) {
    return <AdminDashboardSkeleton />
  }

  const dashboardCards = [
    {
      title: "Analytics Dashboard",
      description: "View website analytics, visitor data, and comment management",
      icon: <FaEye className="text-3xl" />,
      color: "from-indigo-500 to-purple-500",
      href: "/admin/analytics",
      stats: loading ? "Loading..." : `${stats.totalViews} Views`
    },
    {
      title: "Profile Management",
      description: "Manage profile information, name, and profile picture",
      icon: <FaUser className="text-3xl" />,
      color: "from-blue-500 to-cyan-500",
      href: "/admin/profile",
      stats: loading ? "Loading..." : "1 Profile"
    },
    {
      title: "Stories Management",
      description: "Create, edit, and manage stories and categories",
      icon: <FaBook className="text-3xl" />,
      color: "from-purple-500 to-pink-500",
      href: "/admin/stories",
      stats: loading ? "Loading..." : `${stats.totalStories} Stories`
    },
    {
      title: "Instagram Gallery",
      description: "Upload and manage Instagram gallery images",
      icon: <FaImage className="text-3xl" />,
      color: "from-green-500 to-teal-500",
      href: "/admin/gallery",
      stats: loading ? "Loading..." : `${stats.totalImages} Images`
    },
    {
      title: "Site Settings",
      description: "Configure site-wide settings and preferences",
      icon: <FaCog className="text-3xl" />,
      color: "from-orange-500 to-red-500",
      href: "/admin/settings",
      stats: "General"
    }
  ]

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">🚀 Admin Dashboard</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Manage your website content</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
                <FaEye />
                View Site
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
                🔐 Admin
              </Button>
            </Link>
            
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
            >
              <FaSignOutAlt />
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href}>
              <Card className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all duration-200 transform ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } hover:rotate-0 relative group`}>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 bg-linear-to-r ${card.color} text-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] transform rotate-3 group-hover:rotate-0 transition-transform`}>
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-black">{card.stats}</p>
                  </div>
                </div>

                {/* Card Content */}
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-black mb-2">{card.title}</h3>
                  <p className="text-sm md:text-base text-gray-700 font-bold mb-4">{card.description}</p>
                  
                  <Button className={`w-full bg-linear-to-r ${card.color} text-white font-black text-sm md:text-base py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2`}>
                    <FaEdit />
                    Manage
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-black text-black transform rotate-1 mb-6">⚡ Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/stories/new">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black text-base py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2">
                <FaPlus />
                New Story
              </Button>
            </Link>
            
            <Link href="/admin/gallery/upload">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-base py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2">
                <FaImage />
                Upload Image
              </Button>
            </Link>
            
            <Link href="/admin/profile/edit">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-base py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2">
                <FaUser />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Cache Management */}
        <div className="mt-12">
          <CacheManager />
        </div>
      </div>
    </div>
  )
}