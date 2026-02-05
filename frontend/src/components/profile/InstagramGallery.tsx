"use client"

import { Button } from "@/components/ui/button"
import { SiInstagram } from "@icons-pack/react-simple-icons"
import Image from "next/image"

interface InstagramPost {
  id?: string
  _id?: string
  imageUrl: string
  alt: string
}

interface InstagramGalleryProps {
  username: string
  followText: string
  posts: InstagramPost[]
  profileImage?: string | { url?: string; alt?: string }
}

export function InstagramGallery({ username, followText, posts, profileImage }: InstagramGalleryProps) {
  // Extract the image URL from profileImage (could be string or object)
  const imageUrl = typeof profileImage === 'string' 
    ? profileImage 
    : profileImage?.url || ''

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800 border-4 border-black shadow-[8px_8px_0px_0px_#000000] md:shadow-[12px_12px_0px_0px_#000000] p-4 md:p-8 transform -rotate-1">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-4xl font-black text-pink-400 mb-4 md:mb-6 transform rotate-1">My Instagram</h2>
        
        <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
            {imageUrl && imageUrl.trim() !== "" ? (
              <Image
                src={imageUrl}
                alt="Profile"
                width={48}
                height={48}
                className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-full border-2 border-black"
              />
            ) : (
              <div className="w-8 h-8 md:w-12 md:h-12 bg-slate-800 rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-white font-black text-sm md:text-lg">SK</span>
              </div>
            )}
          </div>
          
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-black text-white">{username}</h3>
            <p className="text-sm md:text-base text-gray-300 font-bold">{followText}</p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-6 md:mb-8">
        {posts.map((post, index) => {
          const postId = post.id || post._id || index.toString()
          return (
            <div 
              key={postId}
              className={`aspect-square bg-gray-300 border-4 border-black shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] overflow-hidden transform ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } hover:rotate-0 transition-transform duration-200 cursor-pointer`}
            >
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.alt}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
                        <span class="text-black font-black text-xs">IMG ${index + 1}</span>
                      </div>
                    `
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
                  <span className="text-black font-black text-xs">IMG {index + 1}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* View All Posts Button */}
      <div className="text-center">
        <Button className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-black font-black text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] md:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_#000000] md:hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-200 rounded-none transform rotate-1 flex items-center justify-center gap-2 md:gap-3">
          <SiInstagram className="text-lg md:text-xl" />
          View All Posts
        </Button>
      </div>
    </div>
  )
}