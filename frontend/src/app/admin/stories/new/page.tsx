"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaArrowLeft, FaSave, FaEye, FaBook, FaLink, FaCopy, FaExternalLinkAlt } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { storiesAPI } from "@/lib/api"

export default function NewStoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "personal",
    content: "",
    preview: "",
    status: "draft",
    tags: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [publishedStory, setPublishedStory] = useState<any>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  // Generate preview slug from title
  const generatePreviewSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    const token = localStorage.getItem("adminToken")
    
    if (loggedIn !== "true" || !token) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate preview from content
    if (name === "content" && value.length > 0) {
      const preview = value.substring(0, 150) + (value.length > 150 ? "..." : "")
      setFormData(prev => ({
        ...prev,
        preview: preview
      }))
    }
  }

  const handleSave = async (status: "draft" | "published") => {
    try {
      setIsLoading(true)
      setError("")
      
      const storyData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        preview: formData.preview,
        status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      }

      const response = await storiesAPI.createStory(storyData)
      
      if (response.success) {
        if (status === "published") {
          setPublishedStory(response.data.story)
        } else {
          router.push("/admin/stories")
        }
      } else {
        throw new Error(response.message || "Failed to save story")
      }
    } catch (error) {
      console.error("Error saving story:", error)
      setError("Failed to save story. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyStoryLink = () => {
    if (publishedStory) {
      const storyUrl = `${window.location.origin}/stories/${publishedStory.slug || publishedStory._id}`
      navigator.clipboard.writeText(storyUrl)
      alert("Story link copied to clipboard!")
    }
  }

  const openStoryInNewTab = () => {
    if (publishedStory) {
      const storyUrl = `${window.location.origin}/stories/${publishedStory.slug || publishedStory._id}`
      window.open(storyUrl, '_blank')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading...</p>
        </div>
      </div>
    )
  }

  // Show success screen after publishing
  if (publishedStory) {
    const storyUrl = `${window.location.origin}/stories/${publishedStory.slug || publishedStory._id}`
    
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
        {/* Neobrutalism background elements */}
        <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
        <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
        <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-500 border-4 border-black mx-auto mb-6 flex items-center justify-center transform rotate-12">
                <FaEye className="text-4xl text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-black mb-4 transform -rotate-1">🎉 Story Published!</h1>
              <p className="text-lg md:text-xl font-bold text-gray-700">Your story is now live and ready to be shared</p>
            </div>

            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-black text-black mb-4">{publishedStory.title}</h2>
              <p className="text-gray-600 font-bold mb-6">{publishedStory.preview}</p>
              
              {/* Story Link */}
              <div className="bg-gray-50 border-4 border-black p-4 mb-6">
                <label className="block text-sm font-black text-black mb-2">📎 Story Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={storyUrl}
                    readOnly
                    className="flex-1 p-3 border-2 border-gray-300 font-mono text-sm bg-white"
                  />
                  <Button
                    onClick={copyStoryLink}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-black px-4 py-3 border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
                  >
                    <FaCopy />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={openStoryInNewTab}
                  className="bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center gap-2"
                >
                  <FaExternalLinkAlt />
                  View Story
                </Button>
                
                <Link href="/admin/stories">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center gap-2">
                    <FaBook />
                    Manage Stories
                  </Button>
                </Link>
                
                <Link href="/admin/stories/new">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
                    ✍️ Write Another
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Share Options */}
            <Card className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform rotate-1">
              <h3 className="text-xl font-black text-black mb-4 transform -rotate-1">📢 Share Your Story</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my new story: ${publishedStory.title}`)}&url=${encodeURIComponent(storyUrl)}`)}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-black px-4 py-2 border-2 border-black rounded-none"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 border-2 border-black rounded-none"
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my new story: ${publishedStory.title} ${storyUrl}`)}`)}
                  className="bg-green-500 hover:bg-green-600 text-white font-black px-4 py-2 border-2 border-black rounded-none"
                >
                  WhatsApp
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading...</p>
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/stories">
            <Button className="bg-white hover:bg-gray-100 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none">
              <FaArrowLeft className="text-lg" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">✍️ Create New Story</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Write your personal story</p>
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Story Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your story title..."
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work Life</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Story Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Write your story here... Share your thoughts, experiences, and insights."
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-black text-black mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full p-4 border-4 border-black font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="modeling, confidence, experience, growth"
                  />
                </div>

                {/* URL Preview */}
                {formData.title && (
                  <div>
                    <label className="block text-sm font-black text-black mb-2">🔗 Story URL Preview</label>
                    <div className="p-4 bg-blue-50 border-4 border-blue-300">
                      <p className="text-sm font-bold text-gray-600 mb-1">Your story will be available at:</p>
                      <p className="text-blue-600 font-mono text-sm break-all">
                        {window.location.origin}/stories/{generatePreviewSlug(formData.title)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        ✨ SEO-friendly URL automatically generated from your title
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Preview */}
            <Card className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 mb-6 transform rotate-1">
              <h3 className="text-lg font-black text-black mb-4 transform -rotate-1">📖 Preview</h3>
              
              {formData.title ? (
                <div className="bg-white border-2 border-black p-4 transform -rotate-1">
                  <h4 className="font-black text-black mb-2">{formData.title}</h4>
                  <p className="text-sm text-gray-700 font-bold mb-2">
                    {formData.preview || "Start writing to see preview..."}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 border border-blue-300 text-blue-700 font-black uppercase">
                      {formData.category}
                    </span>
                    <span>• Draft</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 border-2 border-gray-300 p-4 text-center transform -rotate-1">
                  <FaBook className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-bold text-sm">Enter title to see preview</p>
                </div>
              )}
            </Card>

            {/* Actions */}
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform -rotate-1">
              <h3 className="text-lg font-black text-black mb-4">💾 Actions</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleSave("draft")}
                  disabled={isLoading || !formData.title || !formData.content}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {isLoading ? "Saving..." : "Save Draft"}
                </Button>
                
                <Button
                  onClick={() => handleSave("published")}
                  disabled={isLoading || !formData.title || !formData.content}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2"
                >
                  <FaEye />
                  {isLoading ? "Publishing..." : "Publish Story"}
                </Button>
              </div>

              <div className="mt-4 p-3 bg-gray-100 border-2 border-gray-300">
                <p className="text-xs font-bold text-gray-600">
                  💡 Tip: Save as draft first to review, then publish when ready!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}