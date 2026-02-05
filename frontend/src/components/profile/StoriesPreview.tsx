"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FaBook, FaHeart, FaClock, FaComment, FaShare, FaSpinner } from "react-icons/fa"
import Link from "next/link"
import { storiesAPI } from "@/lib/api"

interface Story {
  _id: string
  slug?: string
  title: string
  preview: string
  readTime: string
  likeCount: number
  publishedAt: string
  isNew: boolean
}

interface StoriesPreviewProps {
  stories?: Story[]
  showAll?: boolean
}

export function StoriesPreview({ stories: propStories, showAll = false }: StoriesPreviewProps) {
  const [stories, setStories] = useState<Story[]>(propStories || [])
  const [loading, setLoading] = useState(!propStories)
  const [likedStories, setLikedStories] = useState<string[]>([])
  const [sharedStories, setSharedStories] = useState<string[]>([])

  useEffect(() => {
    if (!propStories) {
      fetchStories()
    }
  }, [propStories])

  const fetchStories = async () => {
    try {
      setLoading(true)
      
      const response = await storiesAPI.getPublishedStories({
        limit: showAll ? 50 : 3,
        sort: "publishedAt"
      })
      
      if (response.success) {
        let fetchedStories = response.data.stories || []
        
        // Add isNew flag for stories published in last 24 hours
        fetchedStories = fetchedStories.map((story: any) => ({
          ...story,
          isNew: new Date(story.publishedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
        }))
        
        setStories(fetchedStories)
      } else {
        throw new Error(response.message || "Failed to fetch stories")
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      
      // Fallback to mock data
      const mockStories: Story[] = [
        {
          _id: "1",
          title: "My First Modeling Experience",
          preview: "I still remember the nervousness I felt walking into my first photoshoot. The bright lights, the camera clicking, and everyone watching...",
          readTime: "3 min read",
          likeCount: 89,
          publishedAt: "2 hours ago",
          isNew: true
        },
        {
          _id: "2",
          title: "Behind Every Perfect Shot",
          preview: "People often ask me what goes on behind the scenes of a photoshoot. The truth is, it's not as glamorous as it looks...",
          readTime: "5 min read",
          likeCount: 67,
          publishedAt: "1 day ago",
          isNew: true
        },
        {
          _id: "3",
          title: "Self-Care Sunday Routine",
          preview: "Sundays are sacred to me. It's the one day I dedicate entirely to myself, my mental health, and preparing for the week ahead...",
          readTime: "4 min read",
          likeCount: 156,
          publishedAt: "3 days ago",
          isNew: false
        }
      ]
      
      setStories(showAll ? mockStories : mockStories.slice(0, 3))
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (storyId: string) => {
    try {
      const response = await storiesAPI.likeStory(storyId)
      
      if (response.success) {
        // Update the story in the list
        setStories(prev => prev.map(story => 
          story._id === storyId 
            ? { 
                ...story, 
                likeCount: response.data.likeCount
              }
            : story
        ))
        
        // Update liked stories state
        setLikedStories(prev => 
          response.data.action === 'liked'
            ? [...prev, storyId]
            : prev.filter(id => id !== storyId)
        )
      }
    } catch (error) {
      console.error("Error liking story:", error)
      
      // Optimistic update fallback
      setLikedStories(prev => 
        prev.includes(storyId) 
          ? prev.filter(id => id !== storyId)
          : [...prev, storyId]
      )
    }
  }

  const handleShare = (storyId: string) => {
    const story = stories.find(s => s._id === storyId)
    if (story) {
      const url = `${window.location.origin}/stories/${storyId}`
      const text = `Check out this story: ${story.title}`
      
      if (navigator.share) {
        navigator.share({
          title: story.title,
          text: text,
          url: url,
        })
      } else {
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      }
      
      setSharedStories(prev => [...prev, storyId])
    }
  }

  const displayStories = showAll ? stories : stories.slice(0, 3)

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-black transform -rotate-1 mb-2">
            📖 {showAll ? 'All Stories' : 'Latest Stories'}
          </h2>
          <p className="text-sm md:text-base font-bold text-gray-700">Personal thoughts and experiences</p>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-3xl text-purple-500 mr-3" />
          <p className="text-lg font-bold text-gray-600">Loading stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-black transform -rotate-1 mb-2">
          📖 {showAll ? 'All Stories' : 'Latest Stories'}
        </h2>
        <p className="text-sm md:text-base font-bold text-gray-700">Personal thoughts and experiences</p>
      </div>
      
      <div className="space-y-4">
        {displayStories.map((story, index) => (
          <div key={story._id} className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6 transition-all duration-200 transform ${
            index % 2 === 0 ? 'rotate-1' : '-rotate-1'
          } hover:rotate-0 relative group`}>
            {/* New Badge */}
            {story.isNew && (
              <div className="absolute -top-2 -right-2 bg-red-500 border-4 border-black shadow-[3px_3px_0px_0px_#000000] p-2 transform rotate-12 z-10">
                <span className="text-white font-black text-xs">NEW</span>
              </div>
            )}

            <div>
              <Link href={`/stories/${story.slug || story._id}`}>
                <h3 className="text-lg md:text-xl font-black text-black mb-2 cursor-pointer hover:text-purple-600 transition-colors">
                  {story.title}
                </h3>
              </Link>
              <p className="text-sm md:text-base text-gray-700 font-bold mb-3 leading-relaxed">
                {story.preview}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 font-bold">
                  <div className="flex items-center gap-1">
                    <FaBook className="text-purple-500" />
                    <span>{story.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaHeart className="text-red-500" />
                    <span>{story.likeCount + (likedStories.includes(story._id) ? 1 : 0)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-gray-500" />
                    <span>{story.publishedAt}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleLike(story._id)
                    }}
                    className={`flex items-center gap-1 px-2 py-1 font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-full transition-all duration-200 ${
                      likedStories.includes(story._id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <FaHeart className={likedStories.includes(story._id) ? 'animate-pulse' : ''} />
                    <span className="hidden sm:inline">{likedStories.includes(story._id) ? 'Liked' : 'Like'}</span>
                  </Button>
                  
                  <Link href={`/stories/${story.slug || story._id}#comments`}>
                    <Button className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-full">
                      <FaComment />
                      <span className="hidden sm:inline">Comment</span>
                    </Button>
                  </Link>
                  
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      handleShare(story._id)
                    }}
                    className={`flex items-center gap-1 px-2 py-1 font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-full transition-all duration-200 ${
                      sharedStories.includes(story._id)
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <FaShare />
                    <span className="hidden sm:inline">{sharedStories.includes(story._id) ? 'Shared' : 'Share'}</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t-2 border-gray-200">
                <Link href={`/stories/${story.slug || story._id}`}>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-full flex items-center justify-center gap-2 py-3">
                    <FaBook />
                    Read Full Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!showAll && (
        <div className="text-center">
          <Link href="/stories">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-full transform rotate-1 flex items-center justify-center gap-2 md:gap-3">
              <FaBook className="text-lg" />
              View All Stories
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}