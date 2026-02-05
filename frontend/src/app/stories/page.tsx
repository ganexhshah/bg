"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoriesSkeleton } from "@/components/ui/StoriesSkeleton"
import { FaArrowLeft, FaBook, FaHeart, FaEye, FaClock, FaSpinner } from "react-icons/fa"
import Link from "next/link"

interface Story {
  _id: string
  slug?: string
  title: string
  preview: string
  content: string
  category: string
  readTime: string
  views: number
  likeCount: number
  publishedAt: string
  isNew: boolean
  isLiked?: boolean
}

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categories = [
    { id: "all", label: "All Stories", emoji: "📚" },
    { id: "personal", label: "Personal", emoji: "💭" },
    { id: "work", label: "Work Life", emoji: "📸" },
    { id: "lifestyle", label: "Lifestyle", emoji: "✨" },
    { id: "popular", label: "Popular", emoji: "🔥" },
    { id: "recent", label: "Recent", emoji: "🆕" }
  ]

  useEffect(() => {
    fetchStories()
  }, [selectedCategory])

  const fetchStories = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Try to fetch from API
      const response = await fetch(`/api/stories?category=${selectedCategory === "all" ? "" : selectedCategory}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          let fetchedStories = data.data.stories || []
          
          // Filter for popular or recent
          if (selectedCategory === "popular") {
            fetchedStories = fetchedStories.filter((story: Story) => story.likeCount > 50).sort((a: Story, b: Story) => b.likeCount - a.likeCount)
          } else if (selectedCategory === "recent") {
            fetchedStories = fetchedStories.filter((story: Story) => story.isNew)
          }
          
          setStories(fetchedStories)
        } else {
          throw new Error(data.message || "Failed to fetch stories")
        }
      } else {
        throw new Error("Failed to fetch stories")
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      setError("Failed to load stories. Showing demo content.")
      
      // Fallback to mock data
      const mockStories: Story[] = [
        {
          _id: "1",
          title: "My First Modeling Experience",
          preview: "I still remember the nervousness I felt walking into my first photoshoot. The bright lights, the camera clicking, and everyone watching...",
          content: "Full story content here...",
          category: "personal",
          readTime: "3 min read",
          views: 1250,
          likeCount: 89,
          publishedAt: "2 hours ago",
          isNew: true
        },
        {
          _id: "2", 
          title: "Behind Every Perfect Shot",
          preview: "People often ask me what goes on behind the scenes of a photoshoot. The truth is, it's not as glamorous as it looks...",
          content: "Full story content here...",
          category: "work",
          readTime: "5 min read",
          views: 890,
          likeCount: 67,
          publishedAt: "1 day ago",
          isNew: true
        },
        {
          _id: "3",
          title: "Self-Care Sunday Routine", 
          preview: "Sundays are sacred to me. It's the one day I dedicate entirely to myself, my mental health, and preparing for the week ahead...",
          content: "Full story content here...",
          category: "lifestyle",
          readTime: "4 min read",
          views: 2100,
          likeCount: 156,
          publishedAt: "3 days ago",
          isNew: false
        }
      ]
      
      // Apply filters to mock data
      let filteredMockStories = mockStories
      if (selectedCategory === "popular") {
        filteredMockStories = mockStories.filter(story => story.likeCount > 50).sort((a, b) => b.likeCount - a.likeCount)
      } else if (selectedCategory === "recent") {
        filteredMockStories = mockStories.filter(story => story.isNew)
      } else if (selectedCategory !== "all") {
        filteredMockStories = mockStories.filter(story => story.category === selectedCategory)
      }
      
      setStories(filteredMockStories)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Update the story in the list
          setStories(prev => prev.map(story => 
            story._id === storyId 
              ? { 
                  ...story, 
                  likeCount: data.data.likeCount,
                  isLiked: data.data.action === 'liked'
                }
              : story
          ))
        }
      }
    } catch (error) {
      console.error("Error liking story:", error)
      // Optimistic update fallback
      setStories(prev => prev.map(story => 
        story._id === storyId 
          ? { 
              ...story, 
              likeCount: story.isLiked ? story.likeCount - 1 : story.likeCount + 1,
              isLiked: !story.isLiked
            }
          : story
      ))
    }
  }

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return stories.length
    if (categoryId === "popular") return stories.filter(s => s.likeCount > 50).length
    if (categoryId === "recent") return stories.filter(s => s.isNew).length
    return stories.filter(s => s.category === categoryId).length
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-4xl mx-auto relative z-10">
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
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">My Stories 📖</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Personal thoughts and experiences</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-100 border-4 border-yellow-500 transform rotate-1">
            <p className="text-yellow-800 font-black text-sm">{error}</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={loading}
                className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none transform ${
                  selectedCategory === category.id 
                    ? 'bg-purple-500 text-white rotate-1' 
                    : 'bg-white text-black hover:bg-gray-100 -rotate-1'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <StoriesSkeleton />}

        {/* Stories List */}
        {!loading && (
          <div className="space-y-6 md:space-y-8">
            {stories.map((story, index) => (
              <div key={story._id} className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 md:p-8 transition-all duration-200 transform ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } hover:rotate-0 relative`}>
                {/* New Badge */}
                {story.isNew && (
                  <div className="absolute -top-2 -right-2 bg-red-500 border-4 border-black shadow-[3px_3px_0px_0px_#000000] p-2 transform rotate-12 z-10">
                    <span className="text-white font-black text-xs">NEW</span>
                  </div>
                )}

                {/* Story Content */}
                <div>
                  <Link href={`/stories/${story.slug || story._id}`}>
                    <h2 className="text-xl md:text-2xl font-black text-black mb-3 cursor-pointer hover:text-purple-600 transition-colors">{story.title}</h2>
                  </Link>
                  
                  <p className="text-sm md:text-base text-gray-700 font-bold mb-4 leading-relaxed">
                    {story.preview}
                  </p>
                  
                  {/* Story Meta */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 font-bold mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FaBook className="text-purple-500" />
                        <span>{story.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye className="text-blue-500" />
                        <span>{story.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-red-500" />
                        <span>{story.likeCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-gray-500" />
                      <span>{story.publishedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href={`/stories/${story.slug || story._id}`}>
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black text-sm md:text-base px-4 py-2 md:px-6 md:py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center gap-2">
                        <FaBook className="text-sm" />
                        Read Story
                      </Button>
                    </Link>
                    
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLike(story._id)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 font-black text-sm border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none transition-all duration-200 ${
                        story.isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <FaHeart className={story.isLiked ? 'animate-pulse' : ''} />
                      {story.isLiked ? 'Liked' : 'Like'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stories.length === 0 && (
          <div className="text-center py-12">
            <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-600 mb-2">No Stories Found</h3>
            <p className="text-gray-500 font-bold">
              {selectedCategory === "all" ? "No stories available yet." : `No stories in "${selectedCategory}" category.`}
            </p>
          </div>
        )}

        {/* Write Story Button */}
        <div className="mt-12 text-center">
          <Button className="bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-black text-lg px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] rounded-none transform rotate-1">
            ✍️ Write New Story
          </Button>
        </div>
      </div>
    </div>
  )
}