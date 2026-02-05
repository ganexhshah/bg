"use client"

import { useState, useEffect } from "react"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { SocialLinks } from "@/components/profile/SocialLinks"
import { ActionButtons } from "@/components/profile/ActionButtons"
import { Gallery } from "@/components/profile/Gallery"
import { InstagramGallery } from "@/components/profile/InstagramGallery"

import { MeetupPopup } from "@/components/profile/MeetupPopup"
import { VideoCallPopup } from "@/components/profile/VideoCallPopup"
import { StoriesPreview } from "@/components/profile/StoriesPreview"
import { FaEye, FaHandshake, FaVideo, FaPlay, FaBook, FaHeart, FaClock, FaSpinner } from "react-icons/fa"
import { SiFacebook, SiInstagram, SiTelegram } from "@icons-pack/react-simple-icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProfileSkeleton } from "@/components/ui/ProfileSkeleton"
import { profileAPI, galleryAPI } from "@/lib/api"

interface ProfileData {
  name: string
  title: string
  profileImage: string | { url?: string; alt?: string }
  description: string
  socialMedia: {
    facebook?: {
      url?: string
    }
    instagram?: {
      username?: string
      url?: string
      followersCount?: number
    }
    telegram?: {
      url?: string
      channelName?: string
    }
  }
}

interface InstagramPost {
  _id: string
  imageUrl: string
  alt: string
}

export default function Home() {
  const [isMeetupPopupOpen, setIsMeetupPopupOpen] = useState(false)
  const [isVideoCallPopupOpen, setIsVideoCallPopupOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch profile data
      const profileResponse = await profileAPI.getPublicProfile()
      if (profileResponse.success && profileResponse.data.profile) {
        setProfileData(profileResponse.data.profile)
      }
      
      // Fetch Instagram posts
      const galleryResponse = await galleryAPI.getInstagramPosts(6)
      if (galleryResponse.success && galleryResponse.data.images) {
        setInstagramPosts(galleryResponse.data.images)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      
      // Fallback to default data
      setProfileData({
        name: "Sonika Karki",
        title: "VC Girl & Professional Model",
        profileImage: "/profile/photo_2025-04-22_12-57-51.jpg",
        description: "Professional model and content creator sharing my journey and experiences.",
        socialMedia: {
          facebook: { url: "https://facebook.com/sonikakarki" },
          instagram: { 
            username: "@cloudy_manishaa",
            url: "https://instagram.com/cloudy_manishaa",
            followersCount: 0
          },
          telegram: { 
            url: "https://t.me/sonikakarki",
            channelName: "Join our channel!"
          }
        }
      })
      
      setInstagramPosts([
        { _id: "1", imageUrl: "/placeholder1.jpg", alt: "Post 1" },
        { _id: "2", imageUrl: "/placeholder2.jpg", alt: "Post 2" },
        { _id: "3", imageUrl: "/placeholder3.jpg", alt: "Post 3" },
        { _id: "4", imageUrl: "/placeholder4.jpg", alt: "Post 4" },
        { _id: "5", imageUrl: "/placeholder5.jpg", alt: "Post 5" },
        { _id: "6", imageUrl: "/placeholder6.jpg", alt: "Post 6" },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Use profile data or fallback values
  const profile = profileData || {
    name: "Sonika Karki",
    title: "VC Girl & Professional Model",
    profileImage: "/profile/photo_2025-04-22_12-57-51.jpg",
    description: "Professional model and content creator sharing my journey and experiences.",
    socialMedia: {
      facebook: { url: "https://facebook.com/sonikakarki" },
      instagram: { 
        username: "@cloudy_manishaa",
        url: "https://instagram.com/cloudy_manishaa",
        followersCount: 0
      },
      telegram: { 
        url: "https://t.me/sonikakarki",
        channelName: "Join our channel!"
      }
    }
  }

  const socialLinks = [
    { 
      platform: "Facebook", 
      url: profile.socialMedia?.facebook?.url || "#", 
      icon: <SiFacebook className="text-2xl" />,
      bgColor: "bg-blue-500"
    },
    { 
      platform: "Instagram", 
      url: profile.socialMedia?.instagram?.url || "#", 
      icon: <SiInstagram className="text-2xl" />,
      bgColor: "bg-pink-500"
    }
  ]

  const actionButtons = [
    {
      label: "View Proof",
      icon: <FaEye className="text-xl" />,
      onClick: () => window.location.href = '/proof',
      className: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    },
    {
      label: "My Stories",
      icon: <FaBook className="text-lg" />,
      onClick: () => window.location.href = '/stories',
      className: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
    },
    {
      label: "Meetup",
      icon: <FaHandshake className="text-lg" />,
      onClick: () => setIsMeetupPopupOpen(true),
      className: "bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600"
    },
    {
      label: "Video Call",
      icon: <FaVideo className="text-lg" />,
      onClick: () => setIsVideoCallPopupOpen(true),
      className: "bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600"
    },
    {
      label: "Telegram",
      icon: <SiTelegram className="text-lg" />,
      onClick: () => window.open(profile.socialMedia?.telegram?.url || "#", "_blank"),
      className: "bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600"
    }
  ]

  const handleTryVideoCall = () => {
    setIsMeetupPopupOpen(false)
    setIsVideoCallPopupOpen(true)
  }

  const handleContactTelegram = () => {
    setIsVideoCallPopupOpen(false)
    window.open(profile.socialMedia?.telegram?.url || "#", "_blank")
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-3 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>
      <div className="absolute bottom-20 right-5 md:bottom-40 md:right-10 w-8 h-8 md:w-12 md:h-12 bg-green-400 border-4 border-black transform -rotate-12"></div>
      
      <div className="max-w-4xl w-full space-y-8 md:space-y-16 relative z-10">
        <div className="max-w-2xl mx-auto space-y-5 md:space-y-12">
          <ProfileHeader
            name={profile.name}
            title={profile.title}
            profileImage={profile.profileImage}
          />
          
          <SocialLinks links={socialLinks} />
          
          <ActionButtons buttons={actionButtons} />
          
          {/* Recent Stories Preview - will fetch from API */}
          <StoriesPreview />
          
          <Gallery
            title="Gallery"
            description="Click on my profile picture above to view my gallery"
          />
        </div>

        {/* Instagram Gallery Section */}
        <InstagramGallery
          username="@cloudy_manishaa"
          followText="Follow me on Instagram"
          posts={instagramPosts.map(post => ({ ...post, id: post._id }))}
          profileImage={profile.profileImage}
        />
      </div>
      


      {/* Popups */}
      <MeetupPopup
        isOpen={isMeetupPopupOpen}
        onClose={() => setIsMeetupPopupOpen(false)}
        onTryVideoCall={handleTryVideoCall}
      />

      <VideoCallPopup
        isOpen={isVideoCallPopupOpen}
        onClose={() => setIsVideoCallPopupOpen(false)}
        onContactTelegram={handleContactTelegram}
      />

      {/* Admin Access Link */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link href="/admin">
          <Button className="bg-black hover:bg-gray-800 text-white font-black text-xs px-3 py-2 border-2 border-white shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#ffffff] rounded-none opacity-70 hover:opacity-100 transition-opacity">
            🔐 Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}