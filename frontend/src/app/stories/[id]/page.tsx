"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoryDetailSkeleton } from "@/components/ui/StoryDetailSkeleton"
import { FaArrowLeft, FaBook, FaHeart, FaShare, FaComment, FaEye, FaClock, FaPaperPlane, FaTwitter, FaFacebook, FaWhatsapp, FaCopy } from "react-icons/fa"
import Link from "next/link"
import { useParams } from "next/navigation"
import { storiesAPI } from "@/lib/api"

interface Story {
  _id: string
  slug?: string
  title: string
  content: string
  category: string
  readTime?: string
  views: number
  likes: string[]
  comments: Comment[]
  publishedAt: string
  createdAt: string
  tags: string[]
  status: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

interface Comment {
  _id: string
  user: {
    name: string
    email?: string
  }
  text: string
  timestamp: string
  isApproved: boolean
}

export default function ViewStoryPage() {
  const params = useParams()
  const [story, setStory] = useState<Story | null>(null)
  const [relatedStories, setRelatedStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newCommentName, setNewCommentName] = useState("")
  const shareMenuRef = useRef<HTMLDivElement>(null)

  // Fetch story data
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setIsLoading(true)
        setError("")
        
        const response = await storiesAPI.getStoryById(params.id as string)
        
        if (response.success) {
          setStory(response.data.story)
          
          // Fetch related stories
          const relatedResponse = await storiesAPI.getPublishedStories({
            category: response.data.story.category,
            limit: 3
          })
          
          if (relatedResponse.success) {
            // Filter out current story from related stories
            const filtered = relatedResponse.data.stories.filter(
              (s: Story) => s._id !== response.data.story._id
            ).slice(0, 3)
            setRelatedStories(filtered)
          }
        } else {
          setError("Story not found")
        }
      } catch (error) {
        console.error("Error fetching story:", error)
        setError("Failed to load story")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchStory()
    }
  }, [params.id])

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Auto-open comments if hash is present
  useEffect(() => {
    if (window.location.hash === '#comments') {
      setShowComments(true)
      setTimeout(() => {
        const commentsSection = document.getElementById('comments-section')
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [])

  // Update document title and meta tags when story loads
  useEffect(() => {
    if (story) {
      // Update document title
      document.title = story.seo?.metaTitle || story.title
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', story.seo?.metaDescription || story.content.substring(0, 160))
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = story.seo?.metaDescription || story.content.substring(0, 160)
        document.head.appendChild(meta)
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      const keywords = story.seo?.keywords?.join(', ') || story.tags.join(', ')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'keywords'
        meta.content = keywords
        document.head.appendChild(meta)
      }
    }
  }, [story])

  // Calculate read time based on content length
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "1 day ago"
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`
    
    return date.toLocaleDateString()
  }

  const handleLike = async () => {
    if (!story) return
    
    try {
      console.log('Attempting to like story:', story._id)
      const response = await storiesAPI.likeStory(story._id)
      console.log('Like response:', response)
      
      if (response.success) {
        const { action, likeCount } = response.data
        setIsLiked(action === 'liked')
        // Update story likes count
        setStory(prev => prev ? {
          ...prev,
          likes: Array(likeCount).fill('user') // Create array with correct length
        } : null)
      }
    } catch (error) {
      console.error("Error liking story:", error)
      alert(`Failed to ${isLiked ? 'unlike' : 'like'} story: ${error.message}`)
    }
  }

  const handleAddComment = async () => {
    if (!story || !newComment.trim() || !newCommentName.trim()) return
    
    // Validate comment length (minimum 5 characters as per backend validation)
    if (newComment.trim().length < 5) {
      alert("Comment must be at least 5 characters long")
      return
    }
    
    try {
      const response = await storiesAPI.addComment(story._id, {
        name: newCommentName,
        text: newComment
      })
      
      if (response.success) {
        // Update story with new comment
        const addedComment = response.data?.comment || response.data
        if (addedComment) {
          setStory(prev => prev ? {
            ...prev,
            comments: [addedComment, ...prev.comments]
          } : null)
          setNewComment("")
          setNewCommentName("")
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Failed to add comment. Please try again.")
    }
  }

  const handleShare = (platform: string) => {
    if (!story) return
    
    const url = window.location.href
    const text = `Check out this story: ${story.title}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
    }
    setShowShareMenu(false)
  }

  if (isLoading) {
    return <StoryDetailSkeleton />
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-red-500 mb-4">Story Not Found</h1>
          <p className="text-gray-600 font-bold mb-4">{error || "The story you're looking for doesn't exist."}</p>
          <Link href="/stories">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none">
              Back to Stories
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Neobrutalism background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link href="/stories">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
            >
              <FaArrowLeft className="text-lg" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-black transform -rotate-1">{story.title}</h1>
            <p className="text-sm md:text-base font-bold text-gray-700 mt-1">{story.publishedAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Story Content */}
          <div className="lg:col-span-2">
            {/* Story Content */}
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] mb-6 p-6 md:p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-base md:text-lg leading-relaxed text-gray-800 font-medium whitespace-pre-line">
                  {story.content}
                </div>
              </div>
            </Card>

            {/* Story Info */}
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6 mb-6">
              <h2 className="text-xl md:text-2xl font-black text-black mb-3">{story.title}</h2>
              
              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm md:text-base font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaBook className="text-purple-500" />
                    <span>{story.readTime || calculateReadTime(story.content)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-blue-500" />
                    <span>{story.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-red-500" />
                    <span>{story.likes.length} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{formatDate(story.publishedAt || story.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 relative">
                <Button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 font-black text-sm md:text-base border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none transition-all duration-200 ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <FaHeart className={isLiked ? 'animate-pulse' : ''} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm md:text-base border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
                >
                  <FaComment />
                  Comments ({story.comments.length})
                </Button>
                <div className="relative" ref={shareMenuRef}>
                  <Button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-black text-sm md:text-base border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none"
                  >
                    <FaShare />
                    Share
                  </Button>
                  
                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 z-50 min-w-48">
                      <h4 className="font-black text-sm mb-3">Share this story</h4>
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleShare('twitter')}
                          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white font-bold text-sm border-2 border-black rounded-none"
                        >
                          <FaTwitter />
                          Twitter
                        </Button>
                        <Button
                          onClick={() => handleShare('facebook')}
                          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm border-2 border-black rounded-none"
                        >
                          <FaFacebook />
                          Facebook
                        </Button>
                        <Button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm border-2 border-black rounded-none"
                        >
                          <FaWhatsapp />
                          WhatsApp
                        </Button>
                        <Button
                          onClick={() => handleShare('copy')}
                          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm border-2 border-black rounded-none"
                        >
                          <FaCopy />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {story.tags && story.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500 text-white text-xs md:text-sm font-bold border-2 border-black transform rotate-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            {showComments && (
              <Card id="comments-section" className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-black mb-4">Comments ({story.comments.length})</h3>
                
                {/* Add Comment */}
                <div className="mb-6 p-4 bg-gray-50 border-2 border-black">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-500 border-2 border-black flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-sm">Y</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        placeholder="Your name"
                        className="w-full p-2 mb-2 border-2 border-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment... (minimum 5 characters)"
                        className="w-full p-3 border-2 border-black font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs font-bold ${newComment.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                          {newComment.length}/5 characters minimum
                        </span>
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || !newCommentName.trim() || newComment.trim().length < 5}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                        >
                          <FaPaperPlane />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {story.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 p-4 bg-gray-50 border-2 border-black">
                      <div className="w-10 h-10 bg-blue-500 border-2 border-black flex items-center justify-center shrink-0">
                        <span className="text-white font-black text-sm">{comment.user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-sm md:text-base text-black">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm md:text-base text-gray-700 font-bold mb-2">{comment.text}</p>
                        <div className="flex items-center gap-3">
                          <Button className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 font-bold text-xs border border-gray-300 hover:border-red-300 rounded-none">
                            <FaHeart className="text-xs" />
                            <span>0</span>
                          </Button>
                          <Button className="px-2 py-1 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-500 font-bold text-xs border border-gray-300 hover:border-blue-300 rounded-none">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {story.comments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-bold">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Stories */}
            <Card className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6 transform rotate-1">
              <h3 className="text-lg md:text-xl font-black text-black mb-4 transform -rotate-1">More Stories</h3>
              <div className="space-y-4">
                {relatedStories.map((relatedStory, index) => (
                  <Link key={relatedStory._id} href={`/stories/${relatedStory.slug || relatedStory._id}`}>
                    <div className={`bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-3 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all duration-200 transform ${
                      index % 2 === 0 ? 'rotate-1' : '-rotate-1'
                    } hover:rotate-0`}>
                      <div className="flex gap-3">
                        <div className="w-16 h-12 bg-purple-200 border-2 border-black shrink-0 flex items-center justify-center">
                          <FaBook className="text-purple-600 text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm text-black truncate">{relatedStory.title}</h4>
                          <p className="text-xs text-gray-600 font-bold">{relatedStory.readTime || calculateReadTime(relatedStory.content)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}