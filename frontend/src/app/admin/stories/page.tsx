"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminStoriesSkeleton } from "@/components/ui/AdminSkeleton"
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaBook, FaHeart, FaClock, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { storiesAPI } from "@/lib/api"

interface Story {
  _id: string
  slug?: string
  title: string
  category: string
  status: string
  likeCount: number
  views: number
  publishedAt: string
  createdAt: string
  isNew?: boolean
}

export default function StoriesManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn !== "true" || !token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      fetchStories()
    }
  }, [router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStories()
    }
  }, [selectedCategory, isAuthenticated])

  const fetchStories = async () => {
    try {
      setLoading(true)
      setError("")
      
      const params: any = {}
      if (selectedCategory !== "all") {
        if (selectedCategory === "draft") {
          params.status = "draft"
        } else {
          params.category = selectedCategory
        }
      }
      
      const response = await storiesAPI.getAdminStories(params)
      
      if (response.success) {
        let fetchedStories = response.data.stories || []
        
        // Add isNew flag for stories created in last 24 hours
        fetchedStories = fetchedStories.map((story: Story) => ({
          ...story,
          isNew: new Date(story.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
        }))
        
        setStories(fetchedStories)
      } else {
        throw new Error(response.message || "Failed to fetch stories")
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      setError("Failed to load stories. Please try again.")
      
      // Fallback to mock data
      const mockStories: Story[] = [
        {
          _id: "1",
          title: "My First Modeling Experience",
          category: "personal",
          status: "published",
          likeCount: 89,
          views: 1250,
          publishedAt: "2 hours ago",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isNew: true
        },
        {
          _id: "2",
          title: "Behind Every Perfect Shot",
          category: "work",
          status: "published",
          likeCount: 67,
          views: 890,
          publishedAt: "1 day ago",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isNew: true
        },
        {
          _id: "3",
          title: "Self-Care Sunday Routine",
          category: "lifestyle",
          status: "published",
          likeCount: 156,
          views: 2100,
          publishedAt: "3 days ago",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isNew: false
        },
        {
          _id: "4",
          title: "Dealing with Social Media Pressure",
          category: "personal",
          status: "draft",
          likeCount: 0,
          views: 0,
          publishedAt: "Draft",
          createdAt: new Date().toISOString(),
          isNew: false
        }
      ]
      
      // Apply filters to mock data
      let filteredMockStories = mockStories
      if (selectedCategory === "draft") {
        filteredMockStories = mockStories.filter(story => story.status === "draft")
      } else if (selectedCategory !== "all") {
        filteredMockStories = mockStories.filter(story => story.category === selectedCategory)
      }
      
      setStories(filteredMockStories)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: "all", label: "All Stories", count: stories.length },
    { id: "personal", label: "Personal", count: stories.filter(s => s.category === "personal").length },
    { id: "work", label: "Work Life", count: stories.filter(s => s.category === "work").length },
    { id: "lifestyle", label: "Lifestyle", count: stories.filter(s => s.category === "lifestyle").length },
    { id: "draft", label: "Drafts", count: stories.filter(s => s.status === "draft").length }
  ]

  const filteredStories = selectedCategory === "all" 
    ? stories 
    : selectedCategory === "draft"
    ? stories.filter(story => story.status === "draft")
    : stories.filter(story => story.category === selectedCategory)

  const handleDeleteStory = async (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await storiesAPI.deleteStory(id)
        setStories(stories.filter(story => story._id !== id))
      } catch (error) {
        console.error("Error deleting story:", error)
        alert("Failed to delete story. Please try again.")
      }
    }
  }

  const getStatusColor = (status: string) => {
    return status === "published" ? "bg-green-500" : "bg-yellow-500"
  }

  if (!isAuthenticated) {
    return <AdminStoriesSkeleton />
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
              <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">📚 Stories Management</h1>
              <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Create and manage your stories</p>
            </div>
          </div>
          
          <Link href="/admin/stories/new">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black text-base md:text-lg px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center gap-2">
              <FaPlus />
              New Story
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 transform rotate-1">
            <p className="text-red-800 font-black text-sm">{error}</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={loading}
                className={`px-4 py-3 font-black text-sm md:text-base border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none transform ${
                  selectedCategory === category.id 
                    ? 'bg-purple-500 text-white rotate-1' 
                    : 'bg-white text-black hover:bg-gray-100 -rotate-1'
                }`}
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <AdminStoriesSkeleton />}

        {/* Stories List */}
        {!loading && (
          <div className="space-y-6">
            {filteredStories.map((story, index) => (
              <Card
                key={story._id}
                className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transition-all duration-200 transform ${
                  index % 2 === 0 ? 'rotate-1' : '-rotate-1'
                } hover:rotate-0 relative`}
              >
                {/* Status Badge */}
                <div className={`absolute -top-2 -right-2 ${getStatusColor(story.status)} border-4 border-black shadow-[3px_3px_0px_0px_#000000] p-2 transform rotate-12`}>
                  <span className="text-white font-black text-xs uppercase">{story.status}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-black mb-2">{story.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-bold mb-4">
                      <span className="px-2 py-1 bg-blue-100 border-2 border-blue-300 text-blue-700 font-black text-xs uppercase">
                        {story.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaEye className="text-blue-500" />
                        <span>{story.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-red-500" />
                        <span>{story.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-500" />
                        <span>{story.publishedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/stories/${story.slug || story._id}`}>
                      <Button className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none">
                        <FaEye />
                        View
                      </Button>
                    </Link>
                    
                    <Link href={`/admin/stories/edit/${story._id}`}>
                      <Button className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none">
                        <FaEdit />
                        Edit
                      </Button>
                    </Link>
                    
                    <Button
                      onClick={() => handleDeleteStory(story._id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                    >
                      <FaTrash />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredStories.length === 0 && (
          <Card className="bg-gray-50 border-4 border-gray-300 shadow-[6px_6px_0px_0px_#666666] p-8 text-center transform rotate-1">
            <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-600 mb-2">No Stories Found</h3>
            <p className="text-gray-500 font-bold mb-4">
              {selectedCategory === "all" ? "Create your first story!" : `No stories in "${selectedCategory}" category.`}
            </p>
            <Link href="/admin/stories/new">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
                <FaPlus className="mr-2" />
                Create New Story
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}