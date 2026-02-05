"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaTimes, FaPlay, FaVideo, FaCheckCircle } from "react-icons/fa"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoTitle: string
  videoDescription: string
  videoType: "verification" | "demo" | "identity"
}

export function VideoModal({ isOpen, onClose, videoTitle, videoDescription, videoType }: VideoModalProps) {
  if (!isOpen) return null

  const getVideoIcon = () => {
    switch (videoType) {
      case "verification":
        return <FaCheckCircle className="text-2xl md:text-3xl text-green-400" />
      case "demo":
        return <FaVideo className="text-2xl md:text-3xl text-blue-400" />
      case "identity":
        return <FaCheckCircle className="text-2xl md:text-3xl text-purple-400" />
      default:
        return <FaVideo className="text-2xl md:text-3xl text-blue-400" />
    }
  }

  const getVideoColor = () => {
    switch (videoType) {
      case "verification":
        return "bg-green-500"
      case "demo":
        return "bg-blue-500"
      case "identity":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="bg-slate-800 border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-4 md:p-6 w-full max-w-2xl md:max-w-4xl text-center relative animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white border-none shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none w-8 h-8"
        >
          <FaTimes className="text-lg" />
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className={`w-16 h-16 md:w-20 md:h-20 ${getVideoColor()} border-4 border-black shadow-[6px_6px_0px_0px_#000000] mx-auto flex items-center justify-center mb-4`}>
            {getVideoIcon()}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{videoTitle}</h2>
          <p className="text-sm md:text-base text-gray-300 font-bold">{videoDescription}</p>
        </div>

        {/* Video Player Area */}
        <div className="relative mb-6">
          <div className="aspect-video bg-black border-4 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden relative">
            {/* Video Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000000] transition-all duration-200">
                  <FaPlay className="text-2xl md:text-3xl text-black ml-1" />
                </div>
                <p className="text-white font-black text-lg md:text-xl">Click to Play Video</p>
                <p className="text-gray-400 font-bold text-sm md:text-base mt-2">Verification Video • HD Quality</p>
              </div>
            </div>
            
            {/* Verified Badge */}
            <div className="absolute top-4 right-4 bg-green-500 border-4 border-black shadow-[3px_3px_0px_0px_#000000] p-2 transform rotate-12">
              <FaCheckCircle className="text-white text-lg" />
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-600 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-3 md:p-4 transform rotate-1">
            <h3 className="text-white font-black text-sm md:text-base mb-1">Duration</h3>
            <p className="text-white font-bold text-xs md:text-sm">2:30 mins</p>
          </div>
          <div className="bg-green-600 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-3 md:p-4 transform -rotate-1">
            <h3 className="text-white font-black text-sm md:text-base mb-1">Quality</h3>
            <p className="text-white font-bold text-xs md:text-sm">1080p HD</p>
          </div>
          <div className="bg-purple-600 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-3 md:p-4 transform rotate-1">
            <h3 className="text-white font-black text-sm md:text-base mb-1">Verified</h3>
            <p className="text-white font-bold text-xs md:text-sm">✓ Authentic</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black text-base md:text-lg py-3 md:py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none flex items-center justify-center gap-2"
          >
            <FaPlay className="text-lg" />
            Play Video
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-100 text-black font-black text-base md:text-lg py-3 md:py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] rounded-none"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}