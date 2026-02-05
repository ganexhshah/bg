"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminSettingsSkeleton } from "@/components/ui/AdminSkeleton"
import { FaArrowLeft, FaSave, FaCog, FaGlobe, FaShieldAlt, FaDatabase, FaBell, FaPalette, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { settingsAPI } from "@/lib/api"

interface Settings {
  // Site Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  
  // Social Media
  facebookUrl: string
  instagramUrl: string
  telegramUrl: string
  
  // Content Settings
  storiesPerPage: number
  galleryImagesPerPage: number
  enableComments: boolean
  enableLikes: boolean
  enableSharing: boolean
  
  // Notification Settings
  emailNotifications: boolean
  commentNotifications: boolean
  likeNotifications: boolean
  
  // Security Settings
  requireLogin: boolean
  enableCaptcha: boolean
  sessionTimeout: number
  
  // Theme Settings
  primaryColor: string
  secondaryColor: string
  accentColor: string
  
  // SEO Settings
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

export default function AdminSettings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    // Site Settings
    siteName: "Sonika Karki - Professional Model",
    siteDescription: "Professional model and content creator sharing my journey and experiences",
    siteUrl: "https://sonikakarki.com",
    
    // Social Media
    facebookUrl: "https://facebook.com/sonikakarki",
    instagramUrl: "https://instagram.com/cloudy_manishaa",
    telegramUrl: "https://t.me/sonikakarki",
    
    // Content Settings
    storiesPerPage: 6,
    galleryImagesPerPage: 12,
    enableComments: true,
    enableLikes: true,
    enableSharing: true,
    
    // Notification Settings
    emailNotifications: true,
    commentNotifications: true,
    likeNotifications: false,
    
    // Security Settings
    requireLogin: false,
    enableCaptcha: false,
    sessionTimeout: 30,
    
    // Theme Settings
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    accentColor: "#10B981",
    
    // SEO Settings
    metaTitle: "Sonika Karki - Professional Model & Content Creator",
    metaDescription: "Professional model sharing stories, experiences, and behind-the-scenes content",
    metaKeywords: "model, content creator, photography, lifestyle, stories"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn !== "true" || !token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      fetchSettings()
    }
  }, [router])

  const fetchSettings = async () => {
    try {
      setIsFetching(true)
      setError("")
      
      const response = await settingsAPI.getAdminSettings()
      
      if (response.success && response.data.settings) {
        const fetchedSettings = response.data.settings
        
        // Map backend settings to frontend format
        setSettings({
          siteName: fetchedSettings.site?.name || "Sonika Karki - Professional Model",
          siteDescription: fetchedSettings.site?.description || "Professional model and content creator sharing my journey and experiences",
          siteUrl: fetchedSettings.site?.url || "https://sonikakarki.com",
          
          facebookUrl: fetchedSettings.socialMedia?.facebook || "https://facebook.com/sonikakarki",
          instagramUrl: fetchedSettings.socialMedia?.instagram?.url || "https://instagram.com/cloudy_manishaa",
          telegramUrl: fetchedSettings.socialMedia?.telegram || "https://t.me/sonikakarki",
          
          storiesPerPage: fetchedSettings.content?.storiesPerPage || 6,
          galleryImagesPerPage: fetchedSettings.content?.galleryImagesPerPage || 12,
          enableComments: fetchedSettings.content?.enableComments !== false,
          enableLikes: fetchedSettings.content?.enableLikes !== false,
          enableSharing: fetchedSettings.content?.enableSharing !== false,
          
          emailNotifications: fetchedSettings.notifications?.email !== false,
          commentNotifications: fetchedSettings.notifications?.comments !== false,
          likeNotifications: fetchedSettings.notifications?.likes === true,
          
          requireLogin: fetchedSettings.security?.requireLogin === true,
          enableCaptcha: fetchedSettings.security?.enableCaptcha === true,
          sessionTimeout: fetchedSettings.security?.sessionTimeout || 30,
          
          primaryColor: fetchedSettings.theme?.primaryColor || "#8B5CF6",
          secondaryColor: fetchedSettings.theme?.secondaryColor || "#EC4899",
          accentColor: fetchedSettings.theme?.accentColor || "#10B981",
          
          metaTitle: fetchedSettings.seo?.title || "Sonika Karki - Professional Model & Content Creator",
          metaDescription: fetchedSettings.seo?.description || "Professional model sharing stories, experiences, and behind-the-scenes content",
          metaKeywords: fetchedSettings.seo?.keywords || "model, content creator, photography, lifestyle, stories"
        })
      } else {
        throw new Error(response.message || "Failed to fetch settings")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setError("Failed to load settings. Using default values.")
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Prepare settings data for backend
      const settingsData = {
        site: {
          name: settings.siteName,
          description: settings.siteDescription,
          url: settings.siteUrl
        },
        socialMedia: {
          facebook: { url: settings.facebookUrl },
          instagram: { url: settings.instagramUrl },
          telegram: { url: settings.telegramUrl }
        },
        content: {
          storiesPerPage: settings.storiesPerPage,
          galleryImagesPerPage: settings.galleryImagesPerPage,
          enableComments: settings.enableComments,
          enableLikes: settings.enableLikes,
          enableSharing: settings.enableSharing
        },
        notifications: {
          email: settings.emailNotifications,
          comments: settings.commentNotifications,
          likes: settings.likeNotifications
        },
        security: {
          requireLogin: settings.requireLogin,
          enableCaptcha: settings.enableCaptcha,
          sessionTimeout: settings.sessionTimeout
        },
        theme: {
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          accentColor: settings.accentColor
        },
        seo: {
          title: settings.metaTitle,
          description: settings.metaDescription,
          keywords: settings.metaKeywords
        }
      }
      
      const response = await settingsAPI.updateSettings(settingsData)
      
      if (response.success) {
        alert("Settings saved successfully!")
      } else {
        throw new Error(response.message || "Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setError("Failed to save settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: <FaGlobe /> },
    { id: "content", label: "Content", icon: <FaDatabase /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "theme", label: "Theme", icon: <FaPalette /> }
  ]

  if (!isAuthenticated || isFetching) {
    return <AdminSettingsSkeleton />
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
              <FaArrowLeft className="text-lg" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">⚙️ Site Settings</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Configure your website settings</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 transform rotate-1">
            <p className="text-red-800 font-black text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 transform rotate-1">
              <h3 className="text-lg font-black text-black mb-4 transform -rotate-1">Settings Menu</h3>
              
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none transition-all ${
                      activeTab === tab.id 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8">
              
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-black mb-6">🌐 General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Site Name</label>
                      <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Site URL</label>
                      <input
                        type="url"
                        name="siteUrl"
                        value={settings.siteUrl}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-black mb-2">Site Description</label>
                    <textarea
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Facebook URL</label>
                      <input
                        type="url"
                        name="facebookUrl"
                        value={settings.facebookUrl}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Instagram URL</label>
                      <input
                        type="url"
                        name="instagramUrl"
                        value={settings.instagramUrl}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Telegram URL</label>
                      <input
                        type="url"
                        name="telegramUrl"
                        value={settings.telegramUrl}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Content Settings */}
              {activeTab === "content" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-black mb-6">📚 Content Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Stories Per Page</label>
                      <select
                        name="storiesPerPage"
                        value={settings.storiesPerPage}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={3}>3 Stories</option>
                        <option value={6}>6 Stories</option>
                        <option value={9}>9 Stories</option>
                        <option value={12}>12 Stories</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Gallery Images Per Page</label>
                      <select
                        name="galleryImagesPerPage"
                        value={settings.galleryImagesPerPage}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={6}>6 Images</option>
                        <option value={12}>12 Images</option>
                        <option value={18}>18 Images</option>
                        <option value={24}>24 Images</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-black">Feature Controls</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 p-4 border-2 border-black bg-gray-50">
                        <input
                          type="checkbox"
                          name="enableComments"
                          checked={settings.enableComments}
                          onChange={handleInputChange}
                          className="w-5 h-5 border-2 border-black"
                        />
                        <span className="font-black text-black">Enable Comments</span>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 border-2 border-black bg-gray-50">
                        <input
                          type="checkbox"
                          name="enableLikes"
                          checked={settings.enableLikes}
                          onChange={handleInputChange}
                          className="w-5 h-5 border-2 border-black"
                        />
                        <span className="font-black text-black">Enable Likes</span>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 border-2 border-black bg-gray-50">
                        <input
                          type="checkbox"
                          name="enableSharing"
                          checked={settings.enableSharing}
                          onChange={handleInputChange}
                          className="w-5 h-5 border-2 border-black"
                        />
                        <span className="font-black text-black">Enable Sharing</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-black mb-6">🔔 Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border-4 border-black bg-blue-50">
                      <div>
                        <span className="font-black text-black">Email Notifications</span>
                        <p className="text-sm text-gray-600 font-bold">Receive email updates for important events</p>
                      </div>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleInputChange}
                        className="w-6 h-6 border-2 border-black"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-4 border-4 border-black bg-green-50">
                      <div>
                        <span className="font-black text-black">Comment Notifications</span>
                        <p className="text-sm text-gray-600 font-bold">Get notified when someone comments on your stories</p>
                      </div>
                      <input
                        type="checkbox"
                        name="commentNotifications"
                        checked={settings.commentNotifications}
                        onChange={handleInputChange}
                        className="w-6 h-6 border-2 border-black"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-4 border-4 border-black bg-red-50">
                      <div>
                        <span className="font-black text-black">Like Notifications</span>
                        <p className="text-sm text-gray-600 font-bold">Get notified when someone likes your content</p>
                      </div>
                      <input
                        type="checkbox"
                        name="likeNotifications"
                        checked={settings.likeNotifications}
                        onChange={handleInputChange}
                        className="w-6 h-6 border-2 border-black"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-black mb-6">🔒 Security Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Session Timeout (minutes)</label>
                      <select
                        name="sessionTimeout"
                        value={settings.sessionTimeout}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border-4 border-black bg-yellow-50">
                      <div>
                        <span className="font-black text-black">Require Login for Stories</span>
                        <p className="text-sm text-gray-600 font-bold">Users must log in to view stories</p>
                      </div>
                      <input
                        type="checkbox"
                        name="requireLogin"
                        checked={settings.requireLogin}
                        onChange={handleInputChange}
                        className="w-6 h-6 border-2 border-black"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-4 border-4 border-black bg-purple-50">
                      <div>
                        <span className="font-black text-black">Enable CAPTCHA</span>
                        <p className="text-sm text-gray-600 font-bold">Add CAPTCHA to forms for spam protection</p>
                      </div>
                      <input
                        type="checkbox"
                        name="enableCaptcha"
                        checked={settings.enableCaptcha}
                        onChange={handleInputChange}
                        className="w-6 h-6 border-2 border-black"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Theme Settings */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-black mb-6">🎨 Theme Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          className="w-12 h-12 border-4 border-black"
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          className="flex-1 p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          className="w-12 h-12 border-4 border-black"
                        />
                        <input
                          type="text"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          className="flex-1 p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-black mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="accentColor"
                          value={settings.accentColor}
                          onChange={handleInputChange}
                          className="w-12 h-12 border-4 border-black"
                        />
                        <input
                          type="text"
                          name="accentColor"
                          value={settings.accentColor}
                          onChange={handleInputChange}
                          className="flex-1 p-3 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-4 border-black bg-gray-50">
                    <h3 className="text-lg font-black text-black mb-4">Color Preview</h3>
                    <div className="flex gap-4">
                      <div 
                        className="w-20 h-20 border-4 border-black"
                        style={{ backgroundColor: settings.primaryColor }}
                      ></div>
                      <div 
                        className="w-20 h-20 border-4 border-black"
                        style={{ backgroundColor: settings.secondaryColor }}
                      ></div>
                      <div 
                        className="w-20 h-20 border-4 border-black"
                        style={{ backgroundColor: settings.accentColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t-4 border-black">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-black text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center justify-center gap-3"
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {isLoading ? "Saving Settings..." : "Save All Settings"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}