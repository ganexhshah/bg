"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminProfileSkeleton } from "@/components/ui/AdminSkeleton"
import { FaArrowLeft, FaSave, FaUpload, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { profileAPI } from "@/lib/api"

interface ProfileData {
  name: string
  title: string
  profileImage: string
  instagramUsername: string
  telegramChannel: string
  description: string
  socialMedia?: {
    instagram?: string | { username?: string; url?: string; followersCount?: number }
    telegram?: string | { url?: string; channelName?: string }
    facebook?: string | { url?: string }
  }
}

export default function ProfileManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    title: "",
    profileImage: "/profile/photo_2025-04-22_12-57-51.jpg",
    instagramUsername: "",
    telegramChannel: "",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [imagePreview, setImagePreview] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn !== "true" || !token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      fetchProfile()
    }
  }, [router])

  const fetchProfile = async () => {
    try {
      setIsFetching(true)
      setError("")
      
      const response = await profileAPI.getAdminProfile()
      
      if (response.success && response.data.profile) {
        const profile = response.data.profile
        setProfileData({
          name: profile.name || "Sonika Karki",
          title: profile.title || "VC Girl & Professional Model",
          profileImage: profile.profileImage?.url || profile.profileImage || "/profile/photo_2025-04-22_12-57-51.jpg",
          instagramUsername: profile.socialMedia?.instagram?.username || "@cloudy_manishaa",
          telegramChannel: profile.socialMedia?.telegram?.channelName || "Join our channel!",
          description: profile.bio || profile.description || "Professional model and content creator sharing my journey and experiences.",
          socialMedia: profile.socialMedia
        })
      } else {
        throw new Error(response.message || "Failed to fetch profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile. Using default values.")
      
      // Use default values
      setProfileData({
        name: "Sonika Karki",
        title: "VC Girl & Professional Model",
        profileImage: "/profile/photo_2025-04-22_12-57-51.jpg",
        instagramUsername: "@cloudy_manishaa",
        telegramChannel: "Join our channel!",
        description: "Professional model and content creator sharing my journey and experiences."
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsLoading(true)
        setError("")
        
        // Upload image to backend
        const response = await profileAPI.uploadProfileImage(file, "Profile Picture")
        
        if (response.success) {
          const imageUrl = response.data.imageUrl || response.data.profileImage?.url
          setProfileData(prev => ({
            ...prev,
            profileImage: imageUrl
          }))
          setImagePreview(imageUrl)
          alert("Profile image uploaded successfully!")
        } else {
          throw new Error(response.message || "Upload failed")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        setError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
        
        // Fallback to local preview
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImagePreview(result)
          setProfileData(prev => ({
            ...prev,
            profileImage: result
          }))
        }
        reader.readAsDataURL(file)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      const updateData = {
        name: profileData.name,
        title: profileData.title,
        bio: profileData.description,
        socialMedia: {
          instagram: { 
            username: profileData.instagramUsername,
            url: `https://instagram.com/${profileData.instagramUsername.replace('@', '')}`
          },
          telegram: { 
            channelName: profileData.telegramChannel,
            url: typeof profileData.socialMedia?.telegram === 'string' 
              ? profileData.socialMedia.telegram 
              : profileData.socialMedia?.telegram?.url || ""
          },
          facebook: { 
            url: typeof profileData.socialMedia?.facebook === 'string' 
              ? profileData.socialMedia.facebook 
              : profileData.socialMedia?.facebook?.url || "" 
          }
        }
      }

      console.log('Sending update data:', updateData);
      
      const response = await profileAPI.updateProfile(updateData)
      
      if (response.success) {
        alert("Profile updated successfully!")
      } else {
        throw new Error(response.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      setError("Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || isFetching) {
    return <AdminProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
              <FaArrowLeft className="text-lg" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">👤 Profile Management</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Update your profile information</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 transform rotate-1">
            <p className="text-red-800 font-black text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8">
              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={profileData.title}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Professional Model, Content Creator"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Bio Description</label>
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Write a brief description about yourself..."
                  />
                </div>

                {/* Instagram Username */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Instagram Username</label>
                  <input
                    type="text"
                    name="instagramUsername"
                    value={profileData.instagramUsername}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="@your_username"
                  />
                </div>

                {/* Telegram Channel */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Telegram Channel Text</label>
                  <input
                    type="text"
                    name="telegramChannel"
                    value={profileData.telegramChannel}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Join our channel!"
                  />
                </div>

                {/* Profile Image Upload */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-24 h-24 border-4 border-black bg-gray-100 overflow-hidden cursor-pointer hover:border-purple-500 transition-colors relative"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                    >
                      {(imagePreview || profileData.profileImage) ? (
                        <Image
                          src={imagePreview || profileData.profileImage}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center">
                          <span className="text-black font-black text-lg">SK</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <FaUpload className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-upload"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('profile-upload')?.click()}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-black text-sm px-4 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center gap-2 cursor-pointer transition-all"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                        {isLoading ? "Uploading..." : "Upload New Image"}
                      </button>
                      <p className="text-xs text-gray-600 font-bold mt-2">
                        Recommended: 400x400px, JPG or PNG
                      </p>
                      <p className="text-xs text-blue-600 font-bold mt-1">
                        Click the image or button to upload
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Preview */}
            <Card className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 mb-6 transform rotate-1">
              <h3 className="text-lg font-black text-black mb-4 transform -rotate-1">👀 Live Preview</h3>
              
              <div className="bg-white border-2 border-black p-4 transform -rotate-1">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 border-4 border-black bg-gray-100 overflow-hidden">
                    {(imagePreview || profileData.profileImage) ? (
                      <Image
                        src={imagePreview || profileData.profileImage}
                        alt="Profile Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center">
                        <span className="text-black font-black text-sm">SK</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-black text-black text-lg">{profileData.name}</h4>
                  <p className="text-sm text-gray-700 font-bold mb-2">{profileData.title}</p>
                  <p className="text-xs text-gray-600 font-bold">{profileData.instagramUsername}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform -rotate-1">
              <h3 className="text-lg font-black text-black mb-4">💾 Save Changes</h3>
              
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-base py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2"
              >
                <FaSave />
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>

              <div className="mt-4 p-3 bg-gray-100 border-2 border-gray-300">
                <p className="text-xs font-bold text-gray-600">
                  💡 Changes will be reflected across the entire website immediately.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}