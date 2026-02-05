"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminGallerySkeleton } from "@/components/ui/AdminSkeleton"
import { FaArrowLeft, FaPlus, FaTrash, FaUpload, FaImage, FaEye, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { galleryAPI } from "@/lib/api"

interface GalleryImage {
  _id: string
  imageUrl: string
  alt: string
  category: string
  isInstagramPost: boolean
  isActive: boolean
  uploadedAt: string
  createdAt: string
}

export default function GalleryManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn !== "true" || !token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      fetchImages()
    }
  }, [router])

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await galleryAPI.getAdminGallery()
      
      if (response.success) {
        const fetchedImages = response.data.images || []
        setImages(fetchedImages)
      } else {
        throw new Error(response.message || "Failed to fetch images")
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      setError("Failed to load images. Showing demo content.")
      
      // Fallback to mock data
      const mockImages: GalleryImage[] = [
        { 
          _id: "1", 
          imageUrl: "/profile/photo_2025-04-22_12-57-51.jpg", 
          alt: "Profile Photo", 
          category: "profile",
          isInstagramPost: false,
          isActive: true,
          uploadedAt: "2 days ago",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        { 
          _id: "2", 
          imageUrl: "/placeholder1.jpg", 
          alt: "Gallery Image 1", 
          category: "gallery",
          isInstagramPost: true,
          isActive: true,
          uploadedAt: "1 week ago",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        { 
          _id: "3", 
          imageUrl: "/placeholder2.jpg", 
          alt: "Gallery Image 2", 
          category: "gallery",
          isInstagramPost: true,
          isActive: true,
          uploadedAt: "1 week ago",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        { 
          _id: "4", 
          imageUrl: "/placeholder3.jpg", 
          alt: "Gallery Image 3", 
          category: "gallery",
          isInstagramPost: true,
          isActive: true,
          uploadedAt: "2 weeks ago",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        { 
          _id: "5", 
          imageUrl: "/placeholder4.jpg", 
          alt: "Gallery Image 4", 
          category: "gallery",
          isInstagramPost: true,
          isActive: true,
          uploadedAt: "2 weeks ago",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        { 
          _id: "6", 
          imageUrl: "/placeholder5.jpg", 
          alt: "Gallery Image 5", 
          category: "gallery",
          isInstagramPost: true,
          isActive: true,
          uploadedAt: "3 weeks ago",
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      setImages(mockImages)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setIsUploading(true)
      
      try {
        // Upload files one by one
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          
          const imageData = {
            alt: file.name,
            category: "gallery",
            isInstagramPost: true,
            isActive: true
          }
          
          const response = await galleryAPI.uploadImage(file, imageData)
          
          if (response.success) {
            const newImage: GalleryImage = {
              _id: response.data.image._id,
              imageUrl: response.data.image.imageUrl,
              alt: response.data.image.alt,
              category: response.data.image.category,
              isInstagramPost: response.data.image.isInstagramPost,
              isActive: response.data.image.isActive,
              uploadedAt: "now",
              createdAt: response.data.image.createdAt
            }
            
            setImages(prev => [newImage, ...prev])
          } else {
            throw new Error(response.message || "Upload failed")
          }
        }
      } catch (error) {
        console.error("Error uploading images:", error)
        setError("Some images failed to upload. Please try again.")
        
        // Fallback to local preview for failed uploads
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const reader = new FileReader()
          
          reader.onload = (e) => {
            const result = e.target?.result as string
            const newImage: GalleryImage = {
              _id: Date.now().toString() + i,
              imageUrl: result,
              alt: file.name,
              category: "gallery",
              isInstagramPost: true,
              isActive: true,
              uploadedAt: "now",
              createdAt: new Date().toISOString()
            }
            
            setImages(prev => [newImage, ...prev])
          }
          
          reader.readAsDataURL(file)
        }
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await galleryAPI.deleteImage(id)
        setImages(images.filter(img => img._id !== id))
      } catch (error) {
        console.error("Error deleting image:", error)
        alert("Failed to delete image. Please try again.")
      }
    }
  }

  if (!isAuthenticated || loading) {
    return <AdminGallerySkeleton />
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
                <FaArrowLeft className="text-lg" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">🖼️ Gallery Management</h1>
              <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Manage Instagram gallery images</p>
            </div>
          </div>
          
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload">
              <Button
                disabled={isUploading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-black text-base md:text-lg px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center gap-2 cursor-pointer"
              >
                {isUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                {isUploading ? "Uploading..." : "Upload Images"}
              </Button>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 transform rotate-1">
            <p className="text-red-800 font-black text-sm">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <Card className="bg-linear-to-r from-blue-100 to-purple-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-8 mb-8 transform rotate-1">
          <div className="text-center">
            <FaImage className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-black mb-2">Upload New Images</h3>
            <p className="text-gray-700 font-bold mb-4">
              Drag and drop images here or click the upload button above
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 font-bold">
              <span>📏 Recommended: 1080x1080px</span>
              <span>📁 Formats: JPG, PNG, WebP</span>
              <span>📊 Max: 5MB per image</span>
            </div>
          </div>
        </Card>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <Card
              key={image._id}
              className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 transition-all duration-200 transform ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } hover:rotate-0 relative group`}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 border-2 border-black mb-3 overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={image.alt}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Info */}
              <div className="mb-3">
                <p className="font-black text-sm text-black truncate">{image.alt}</p>
                <p className="text-xs text-gray-600 font-bold">{image.uploadedAt}</p>
                {image.isInstagramPost && (
                  <span className="inline-block px-2 py-1 bg-pink-500 text-white text-xs font-bold border-2 border-black mt-1">
                    Instagram
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none">
                  <FaEye />
                </Button>
                <Button
                  onClick={() => handleDeleteImage(image._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black text-xs py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                >
                  <FaTrash />
                </Button>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-black text-sm mb-2">Quick Actions</p>
                  <div className="flex gap-2">
                    <Button className="bg-white text-black font-black text-xs px-3 py-1 border-2 border-black">
                      View
                    </Button>
                    <Button 
                      onClick={() => handleDeleteImage(image._id)}
                      className="bg-red-500 text-white font-black text-xs px-3 py-1 border-2 border-black"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {images.length === 0 && (
          <Card className="bg-gray-50 border-4 border-gray-300 shadow-[6px_6px_0px_0px_#666666] p-12 text-center transform rotate-1">
            <FaImage className="text-8xl text-gray-400 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-gray-600 mb-4">No Images Yet</h3>
            <p className="text-gray-500 font-bold mb-6 text-lg">
              Upload your first images to get started with your gallery!
            </p>
            <label htmlFor="gallery-upload">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-black text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none cursor-pointer">
                <FaUpload className="mr-3" />
                Upload Your First Images
              </Button>
            </label>
          </Card>
        )}

        {/* Gallery Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-6 text-center transform rotate-1">
            <h4 className="text-2xl font-black text-black">{images.length}</h4>
            <p className="text-sm font-bold text-gray-700">Total Images</p>
          </Card>
          
          <Card className="bg-green-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-6 text-center transform -rotate-1">
            <h4 className="text-2xl font-black text-black">
              {images.filter(img => img.uploadedAt.includes("now") || img.uploadedAt.includes("day")).length}
            </h4>
            <p className="text-sm font-bold text-gray-700">Recent Uploads</p>
          </Card>
          
          <Card className="bg-purple-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-6 text-center transform rotate-1">
            <h4 className="text-2xl font-black text-black">~{Math.round(images.length * 2.5)}MB</h4>
            <p className="text-sm font-bold text-gray-700">Storage Used</p>
          </Card>
        </div>
      </div>
    </div>
  )
}