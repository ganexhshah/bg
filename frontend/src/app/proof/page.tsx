"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaArrowLeft, FaVideo, FaImage, FaShieldAlt, FaCheckCircle } from "react-icons/fa"
import { VideoModal } from "@/components/proof/VideoModal"
import Link from "next/link"
import Image from "next/image"

export default function ProofPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string
    description: string
    type: "verification" | "demo" | "identity"
  } | null>(null)

  const proofItems = [
    {
      id: 1,
      type: "video",
      title: "Live Video Verification",
      description: "Real-time video proof of authenticity",
      thumbnail: "/profile/photo_2025-04-22_12-57-51.jpg",
      category: "video",
      verified: true,
      videoType: "verification" as const
    },
    {
      id: 2,
      type: "image",
      title: "Photo Verification",
      description: "Verified photos with timestamp",
      thumbnail: "/profile/photo_2025-04-22_12-57-51.jpg",
      category: "photo",
      verified: true,
      videoType: "verification" as const
    },
    {
      id: 3,
      type: "document",
      title: "Identity Verification",
      description: "Government ID verification",
      thumbnail: "/profile/photo_2025-04-22_12-57-51.jpg",
      category: "document",
      verified: true,
      videoType: "identity" as const
    },
    {
      id: 4,
      type: "video",
      title: "Service Demo",
      description: "Sample video call demonstration",
      thumbnail: "/profile/photo_2025-04-22_12-57-51.jpg",
      category: "video",
      verified: true,
      videoType: "demo" as const
    }
  ]

  const categories = [
    { id: "all", label: "All Proof", icon: <FaShieldAlt /> },
    { id: "video", label: "Videos", icon: <FaVideo /> },
    { id: "photo", label: "Photos", icon: <FaImage /> },
    { id: "document", label: "Documents", icon: <FaCheckCircle /> }
  ]

  const filteredItems = selectedCategory === "all" 
    ? proofItems 
    : proofItems.filter(item => item.category === selectedCategory)

  const handleViewItem = (item: typeof proofItems[0]) => {
    if (item.type === "video" || item.type === "document") {
      setSelectedVideo({
        title: item.title,
        description: item.description,
        type: item.videoType
      })
      setIsVideoModalOpen(true)
    } else {
      // Handle photo viewing (could open image modal)
      console.log("View photo:", item.title)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>
      <div className="absolute bottom-20 right-5 md:bottom-40 md:right-10 w-8 h-8 md:w-12 md:h-12 bg-green-400 border-4 border-black transform -rotate-12"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
            >
              <FaArrowLeft className="text-lg" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">Verification Proof</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Authentic verification documents and media</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none transform ${
                  selectedCategory === category.id 
                    ? 'bg-purple-500 text-white rotate-1' 
                    : 'bg-white text-black hover:bg-gray-100 -rotate-1'
                }`}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Proof Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-200 transform ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } hover:rotate-0`}
            >
              {/* Thumbnail */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-200 border-4 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Verified Badge */}
                {item.verified && (
                  <div className="absolute -top-2 -right-2 bg-green-500 border-4 border-black shadow-[3px_3px_0px_0px_#000000] p-2 transform rotate-12">
                    <FaCheckCircle className="text-white text-lg" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg md:text-xl font-black text-black mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-700 font-bold mb-4">{item.description}</p>
                
                <Button 
                  onClick={() => handleViewItem(item)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-sm md:text-base py-2 md:py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
                >
                  View {item.type === "video" ? "Video" : item.type === "image" ? "Photo" : "Document"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Badge */}
        <Card className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8 text-center transform rotate-1">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
              <FaShieldAlt className="text-2xl md:text-3xl text-green-600" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-black text-black">100% Verified</h2>
              <p className="text-base md:text-lg font-bold text-black">All content is authentic and verified</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-black font-bold max-w-2xl mx-auto">
            Every piece of content has been verified through multiple authentication methods including live video verification, 
            government ID checks, and real-time photo verification to ensure complete authenticity.
          </p>
        </Card>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false)
            setSelectedVideo(null)
          }}
          videoTitle={selectedVideo.title}
          videoDescription={selectedVideo.description}
          videoType={selectedVideo.type}
        />
      )}
    </div>
  )
}