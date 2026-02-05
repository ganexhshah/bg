"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaArrowLeft, FaSave, FaEye, FaBook, FaTrash } from "react-icons/fa"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function EditStoryPage() {
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
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    if (loggedIn !== "true") {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      loadStory()
    }
  }, [router])

  const loadStory = () => {
    // Mock data - in real app, fetch from API
    const mockStories: Record<string, any> = {
      "1": {
        title: "My First Modeling Experience",
        category: "personal",
        content: `I still remember the nervousness I felt walking into my first photoshoot. The bright lights, the camera clicking, and everyone watching me. But as soon as I stepped in front of the camera, something magical happened. I felt confident, powerful, and truly myself.

The photographer was incredibly patient with me. "Just be natural," he kept saying. But what does natural even mean when you're standing in front of a camera with five people staring at you? I had practiced poses in the mirror at home, but everything felt different in that moment.

As the session progressed, I started to relax. The music helped - they played some of my favorite songs. With each click of the camera, I felt more comfortable. By the end of the shoot, I was actually enjoying myself. I realized that modeling wasn't just about looking pretty; it was about expressing emotions, telling stories through poses and expressions.

That first experience taught me that confidence isn't something you're born with - it's something you build. Every photoshoot since then has been a learning experience, helping me grow not just as a model, but as a person.

Looking back now, I'm grateful for that nervous energy I felt on my first day. It reminded me that growth happens outside our comfort zone.`,
        status: "published",
        tags: "modeling, first experience, confidence, growth"
      }
    }

    const story = mockStories[params.id as string]
    if (story) {
      setFormData({
        ...story,
        preview: story.content.substring(0, 150) + "..."
      })
    }
  }

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
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const storyData = {
      ...formData,
      status,
      id: params.id,
      publishedAt: status === "published" ? "now" : "Draft",
      isNew: status === "published"
    }

    console.log("Updating story:", storyData)
    
    setIsLoading(false)
    router.push("/admin/stories")
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Deleting story:", params.id)
      
      setIsLoading(false)
      router.push("/admin/stories")
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
            <h1 className="text-3xl md:text-5xl font-black text-black transform -rotate-1">✏️ Edit Story</h1>
            <p className="text-base md:text-lg font-bold text-gray-700 mt-2">Update your story content</p>
          </div>
        </div>

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
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Preview */}
            <Card className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 mb-6 transform rotate-1">
              <h3 className="text-lg font-black text-black mb-4 transform -rotate-1">📖 Preview</h3>
              
              <div className="bg-white border-2 border-black p-4 transform -rotate-1">
                <h4 className="font-black text-black mb-2">{formData.title}</h4>
                <p className="text-sm text-gray-700 font-bold mb-2">
                  {formData.preview}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="px-2 py-1 bg-blue-100 border border-blue-300 text-blue-700 font-black uppercase">
                    {formData.category}
                  </span>
                  <span>• {formData.status}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 mb-6 transform -rotate-1">
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
                  {isLoading ? "Publishing..." : "Update & Publish"}
                </Button>

                <Link href={`/stories/${params.id}`}>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2">
                    <FaBook />
                    Preview Story
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-100 border-4 border-red-500 shadow-[6px_6px_0px_0px_#cc0000] p-6 transform rotate-1">
              <h3 className="text-lg font-black text-red-700 mb-4 transform -rotate-1">⚠️ Danger Zone</h3>
              
              <Button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black text-sm py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2"
              >
                <FaTrash />
                {isLoading ? "Deleting..." : "Delete Story"}
              </Button>

              <div className="mt-3 p-3 bg-red-200 border-2 border-red-400">
                <p className="text-xs font-bold text-red-700">
                  ⚠️ This action cannot be undone!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}