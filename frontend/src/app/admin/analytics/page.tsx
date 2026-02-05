"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminDashboardSkeleton } from "@/components/ui/AdminSkeleton"
import { TrafficChart, TopPagesChart, DeviceChart, BrowserChart, CountryChart } from "@/components/charts/AnalyticsCharts"
import { FaArrowLeft, FaUsers, FaEye, FaComments, FaClock, FaGlobe, FaDesktop, FaMobile, FaTablet, FaChrome, FaFirefox, FaSafari, FaEdge, FaCheck, FaTimes, FaTrash, FaExclamationTriangle, FaCalendarAlt, FaChartLine, FaMapMarkerAlt, FaDownload, FaSync } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { analyticsAPI } from "@/lib/api"

interface AnalyticsData {
  overview: {
    totalVisitors: number
    uniqueVisitors: number
    totalPageViews: number
    totalComments: number
    avgSessionDuration: number
    bounceRate: number
  }
  topPages: Array<{
    url: string
    title: string
    views: number
    uniqueViews: number
  }>
  topCountries: Array<{
    country: string
    countryCode: string
    visitors: number
  }>
  browserStats: Array<{
    browser: string
    users: number
  }>
  deviceStats: Array<{
    device: string
    users: number
  }>
  dailyStats: Array<{
    date: string
    pageViews: number
    uniqueVisitors: number
  }>
}

interface Visitor {
  _id: string
  sessionId: string
  ipAddress: string
  browser: { name: string; version: string }
  os: { name: string; version: string }
  device: string
  location: {
    country?: string
    countryCode?: string
    city?: string
  }
  pageViews: number
  totalTimeSpent: number
  isReturning: boolean
  createdAt: string
}

interface Comment {
  _id: string
  storyId: { title: string; slug?: string }
  user: { name: string; email?: string }
  text: string
  isApproved: boolean
  isSpam: boolean
  likes: number
  timestamp: string
}

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [period, setPeriod] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [commentStats, setCommentStats] = useState({ total: 0, pending: 0, approved: 0, spam: 0 })
  const [commentFilter, setCommentFilter] = useState("all")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn !== "true" || !token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      fetchAnalyticsData()
    }
  }, [router, period])

  useEffect(() => {
    if (isAuthenticated && activeTab === "visitors") {
      fetchVisitors()
    } else if (isAuthenticated && activeTab === "comments") {
      fetchComments()
    }
  }, [activeTab, isAuthenticated, commentFilter])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await analyticsAPI.getDashboardData(period)
      
      if (response.success) {
        setAnalyticsData(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setError("Failed to load analytics data")
      
      // Mock data for demo
      setAnalyticsData({
        overview: {
          totalVisitors: 1247,
          uniqueVisitors: 892,
          totalPageViews: 3456,
          totalComments: 89,
          avgSessionDuration: 245,
          bounceRate: 28.5
        },
        topPages: [
          { url: "/", title: "Home", views: 1234, uniqueViews: 892 },
          { url: "/stories", title: "Stories", views: 567, uniqueViews: 423 },
          { url: "/proof", title: "Proof", views: 234, uniqueViews: 189 }
        ],
        topCountries: [
          { country: "United States", countryCode: "US", visitors: 456 },
          { country: "United Kingdom", countryCode: "GB", visitors: 234 },
          { country: "Canada", countryCode: "CA", visitors: 123 }
        ],
        browserStats: [
          { browser: "Chrome", users: 567 },
          { browser: "Firefox", users: 234 },
          { browser: "Safari", users: 123 }
        ],
        deviceStats: [
          { device: "desktop", users: 678 },
          { device: "mobile", users: 456 },
          { device: "tablet", users: 113 }
        ],
        dailyStats: [
          { date: "2024-01-01", pageViews: 234, uniqueVisitors: 123 },
          { date: "2024-01-02", pageViews: 345, uniqueVisitors: 167 },
          { date: "2024-01-03", pageViews: 456, uniqueVisitors: 234 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchVisitors = async () => {
    try {
      const response = await analyticsAPI.getVisitors(1, 20)
      
      if (response.success) {
        setVisitors(response.data.visitors)
      } else {
        // Mock data
        setVisitors([
          {
            _id: "1",
            sessionId: "session_123",
            ipAddress: "192.168.1.1",
            browser: { name: "Chrome", version: "91.0" },
            os: { name: "Windows", version: "10" },
            device: "desktop",
            location: { country: "United States", countryCode: "US", city: "New York" },
            pageViews: 5,
            totalTimeSpent: 245,
            isReturning: false,
            createdAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error("Error fetching visitors:", error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await analyticsAPI.getComments(1, 20, commentFilter)
      
      if (response.success) {
        setComments(response.data.comments)
        setCommentStats(response.data.stats)
      } else {
        // Mock data
        setComments([
          {
            _id: "1",
            storyId: { title: "My First Story", slug: "my-first-story" },
            user: { name: "John Doe", email: "john@example.com" },
            text: "Great story! Really enjoyed reading it.",
            isApproved: false,
            isSpam: false,
            likes: 3,
            timestamp: new Date().toISOString()
          }
        ])
        setCommentStats({ total: 89, pending: 12, approved: 67, spam: 10 })
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleCommentAction = async (commentId: string, action: string) => {
    try {
      await analyticsAPI.updateComment(commentId, action)
      fetchComments() // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error)
      alert("Failed to update comment")
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await analyticsAPI.deleteComment(commentId)
        fetchComments() // Refresh comments
      } catch (error) {
        console.error("Error deleting comment:", error)
        alert("Failed to delete comment")
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return <FaChrome className="text-blue-500" />
      case 'firefox': return <FaFirefox className="text-orange-500" />
      case 'safari': return <FaSafari className="text-blue-400" />
      case 'edge': return <FaEdge className="text-blue-600" />
      default: return <FaGlobe className="text-gray-500" />
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <FaDesktop className="text-gray-600" />
      case 'mobile': return <FaMobile className="text-green-500" />
      case 'tablet': return <FaTablet className="text-purple-500" />
      default: return <FaDesktop className="text-gray-500" />
    }
  }

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'NL': '🇳🇱',
      'IN': '🇮🇳',
      'JP': '🇯🇵',
      'BR': '🇧🇷'
    }
    return flags[countryCode] || '🌍'
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "visitors", label: "Visitors", icon: <FaUsers /> },
    { id: "comments", label: "Comments", icon: <FaComments /> }
  ]

  const periods = [
    { id: "24h", label: "Last 24 Hours" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" }
  ]

  if (!isAuthenticated || loading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
                <FaArrowLeft className="text-lg" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">📊 Analytics Dashboard</h1>
              <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Website analytics and visitor insights</p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            <Button
              onClick={fetchAnalyticsData}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
            >
              <FaSync />
              Refresh
            </Button>
            {periods.map((p) => (
              <Button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-2 font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none ${
                  period === p.id ? 'bg-purple-500 text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 transform rotate-1">
            <p className="text-red-800 font-black text-sm">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-black text-sm border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none transform ${
                  activeTab === tab.id 
                    ? 'bg-purple-500 text-white rotate-1' 
                    : 'bg-white text-black hover:bg-gray-100 -rotate-1'
                }`}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && analyticsData && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-blue-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 text-center transform rotate-1">
                <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-black">{formatNumber(analyticsData.overview.totalVisitors)}</h3>
                <p className="text-sm font-bold text-gray-700">Total Visitors</p>
              </Card>

              <Card className="bg-green-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 text-center transform -rotate-1">
                <FaUsers className="text-3xl text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-black">{formatNumber(analyticsData.overview.uniqueVisitors)}</h3>
                <p className="text-sm font-bold text-gray-700">Unique Visitors</p>
              </Card>

              <Card className="bg-purple-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 text-center transform rotate-1">
                <FaEye className="text-3xl text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-black">{formatNumber(analyticsData.overview.totalPageViews)}</h3>
                <p className="text-sm font-bold text-gray-700">Page Views</p>
              </Card>

              <Card className="bg-yellow-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 text-center transform -rotate-1">
                <FaComments className="text-3xl text-yellow-600 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-black">{formatNumber(analyticsData.overview.totalComments)}</h3>
                <p className="text-sm font-bold text-gray-700">Comments</p>
              </Card>

              <Card className="bg-red-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 text-center transform rotate-1">
                <FaClock className="text-3xl text-red-600 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-black">{formatDuration(Math.round(analyticsData.overview.avgSessionDuration))}</h3>
                <p className="text-sm font-bold text-gray-700">Avg. Session</p>
              </Card>

              <Card className="bg-orange-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 text-center transform -rotate-1">
                <FaChartLine className="text-3xl text-orange-600 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-black">{analyticsData.overview.bounceRate.toFixed(1)}%</h3>
                <p className="text-sm font-bold text-gray-700">Bounce Rate</p>
              </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Traffic Chart */}
              <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform rotate-1">
                <TrafficChart dailyStats={analyticsData.dailyStats} />
              </Card>

              {/* Top Pages Chart */}
              <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform -rotate-1">
                <TopPagesChart topPages={analyticsData.topPages} />
              </Card>

              {/* Device Chart */}
              <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform -rotate-1">
                <DeviceChart deviceStats={analyticsData.deviceStats} />
              </Card>

              {/* Browser Chart */}
              <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform rotate-1">
                <BrowserChart browserStats={analyticsData.browserStats} />
              </Card>
            </div>

            {/* Country Chart - Full Width */}
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 mb-8 transform rotate-1">
              <CountryChart topCountries={analyticsData.topCountries} />
            </Card>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Pages Table */}
              <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform rotate-1">
                <h3 className="text-xl font-black text-black mb-4 transform -rotate-1">📄 Top Pages Details</h3>
                <div className="space-y-3">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-300">
                      <div className="flex-1">
                        <p className="font-black text-black text-sm truncate">{page.title}</p>
                        <p className="text-xs text-gray-600 font-bold">{page.url}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-black">{formatNumber(page.views)}</p>
                        <p className="text-xs text-gray-600 font-bold">{formatNumber(page.uniqueViews)} unique</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Countries Table */}
              <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform -rotate-1">
                <h3 className="text-xl font-black text-black mb-4 transform rotate-1">🌍 Top Countries Details</h3>
                <div className="space-y-3">
                  {analyticsData.topCountries.slice(0, 6).map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCountryFlag(country.countryCode)}</span>
                        <span className="font-black text-black">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-black">{formatNumber(country.visitors)}</span>
                        <p className="text-xs text-gray-600 font-bold">
                          {((country.visitors / analyticsData.overview.uniqueVisitors) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Visitors Tab */}
        {activeTab === "visitors" && (
          <div className="space-y-6">
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-black">👥 Recent Visitors</h3>
                <Button
                  onClick={fetchVisitors}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                >
                  <FaSync />
                  Refresh
                </Button>
              </div>
              <div className="space-y-4">
                {visitors.map((visitor) => (
                  <div key={visitor._id} className="p-4 bg-gray-50 border-2 border-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-600">Location</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCountryFlag(visitor.location.countryCode || 'XX')}</span>
                          <div>
                            <p className="font-black text-black text-sm">{visitor.location.city}</p>
                            <p className="text-xs text-gray-500">{visitor.location.country}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-1">{visitor.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">Browser & OS</p>
                        <div className="flex items-center gap-2">
                          {getBrowserIcon(visitor.browser.name)}
                          <div>
                            <p className="font-black text-black text-sm">{visitor.browser.name}</p>
                            <p className="text-xs text-gray-500">{visitor.browser.version}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{visitor.os.name} {visitor.os.version}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">Device</p>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.device)}
                          <span className="font-black text-black text-sm capitalize">{visitor.device}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">Activity</p>
                        <p className="font-black text-black">{visitor.pageViews} pages</p>
                        <p className="text-xs text-gray-500">{formatDuration(visitor.totalTimeSpent)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">Visit Time</p>
                        <p className="font-black text-black text-sm">{new Date(visitor.createdAt).toLocaleString()}</p>
                        <div className="flex gap-1 mt-1">
                          {visitor.isReturning && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold border border-green-300">
                              Returning
                            </span>
                          )}
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold border border-blue-300">
                            {visitor.device}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="mt-6 text-center">
                <Button
                  onClick={() => {
                    // In a real app, implement pagination
                    fetchVisitors()
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
                >
                  Load More Visitors
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            {/* Comment Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-blue-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-4 text-center">
                <h3 className="text-2xl font-black text-black">{commentStats.total}</h3>
                <p className="text-sm font-bold text-gray-700">Total</p>
              </Card>
              <Card className="bg-yellow-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-4 text-center">
                <h3 className="text-2xl font-black text-black">{commentStats.pending}</h3>
                <p className="text-sm font-bold text-gray-700">Pending</p>
              </Card>
              <Card className="bg-green-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-4 text-center">
                <h3 className="text-2xl font-black text-black">{commentStats.approved}</h3>
                <p className="text-sm font-bold text-gray-700">Approved</p>
              </Card>
              <Card className="bg-red-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-4 text-center">
                <h3 className="text-2xl font-black text-black">{commentStats.spam}</h3>
                <p className="text-sm font-bold text-gray-700">Spam</p>
              </Card>
            </div>

            {/* Comment Filters */}
            <div className="flex gap-2">
              {["all", "pending", "approved", "spam"].map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setCommentFilter(filter)}
                  className={`px-4 py-2 font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none capitalize ${
                    commentFilter === filter ? 'bg-purple-500 text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Comments List */}
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6">
              <h3 className="text-xl font-black text-black mb-4">💬 Comments Management</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="p-4 bg-gray-50 border-2 border-gray-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-black text-black">{comment.user.name}</span>
                          {comment.user.email && (
                            <span className="text-xs text-gray-500 font-mono">{comment.user.email}</span>
                          )}
                          <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 font-bold mb-2">
                          On: <Link href={`/stories/${comment.storyId.slug || comment.storyId._id}`} className="text-blue-600 hover:underline">
                            {comment.storyId.title}
                          </Link>
                        </p>
                        <p className="text-black font-bold">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {comment.isApproved && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold border border-green-300">
                            Approved
                          </span>
                        )}
                        {comment.isSpam && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold border border-red-300">
                            Spam
                          </span>
                        )}
                        {!comment.isApproved && !comment.isSpam && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!comment.isApproved && !comment.isSpam && (
                        <Button
                          onClick={() => handleCommentAction(comment._id, "approve")}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                        >
                          <FaCheck />
                          Approve
                        </Button>
                      )}
                      
                      {!comment.isSpam && (
                        <Button
                          onClick={() => handleCommentAction(comment._id, "spam")}
                          className="flex items-center gap-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                        >
                          <FaExclamationTriangle />
                          Spam
                        </Button>
                      )}
                      
                      {comment.isApproved && (
                        <Button
                          onClick={() => handleCommentAction(comment._id, "reject")}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                        >
                          <FaTimes />
                          Reject
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                      >
                        <FaTrash />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}