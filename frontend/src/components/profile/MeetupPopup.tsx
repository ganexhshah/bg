"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaTimes, FaCalendarTimes } from "react-icons/fa"

interface MeetupPopupProps {
  isOpen: boolean
  onClose: () => void
  onTryVideoCall: () => void
}

export function MeetupPopup({ isOpen, onClose, onTryVideoCall }: MeetupPopupProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="bg-slate-800 border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 w-full max-w-sm md:max-w-md text-center relative animate-in fade-in-0 zoom-in-95 duration-300"
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

        {/* Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500 border-4 border-black shadow-[6px_6px_0px_0px_#000000] mx-auto flex items-center justify-center">
            <FaCalendarTimes className="text-2xl md:text-3xl text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Meetup Not Available</h2>

        {/* Description */}
        <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed px-2">
          Sorry, all meetup slots are currently full. Please check back later or try our video call service.
        </p>

        {/* Try Video Call Button */}
        <Button
          onClick={onTryVideoCall}
          className="w-full mb-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-base md:text-lg py-3 md:py-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]"
        >
          Try Video Call Instead
        </Button>

        {/* Close Button */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white font-bold text-sm border-none shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none"
        >
          Close
        </Button>
      </Card>
    </div>
  )
}