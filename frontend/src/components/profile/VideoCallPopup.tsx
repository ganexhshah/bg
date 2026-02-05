"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaTimes, FaVideo, FaTelegram } from "react-icons/fa"

interface VideoCallService {
  title: string
  duration: string
  price: string
  color: string
  icon: React.ReactNode
}

interface VideoCallPopupProps {
  isOpen: boolean
  onClose: () => void
  onContactTelegram: () => void
}

export function VideoCallPopup({ isOpen, onClose, onContactTelegram }: VideoCallPopupProps) {
  if (!isOpen) return null

  const services: VideoCallService[] = [
    {
      title: "Demo Session",
      duration: "1 Minute",
      price: "Rs. 100",
      color: "bg-blue-600",
      icon: <FaVideo className="text-lg" />
    },
    {
      title: "Full VC (Without Sound)",
      duration: "20min",
      price: "Rs. 800",
      color: "bg-pink-600",
      icon: <FaVideo className="text-lg" />
    },
    {
      title: "Premium VC (With Sound & Face)",
      duration: "1 Hour",
      price: "Rs. 2,500",
      color: "bg-purple-600",
      icon: <FaVideo className="text-lg" />
    }
  ]

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="bg-slate-800 border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 w-full max-w-sm md:max-w-lg text-center relative animate-in fade-in-0 zoom-in-95 duration-300"
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
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 border-4 border-black shadow-[6px_6px_0px_0px_#000000] mx-auto flex items-center justify-center">
            <FaVideo className="text-2xl md:text-3xl text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-white mb-5">Video Call Services</h2>

        {/* Services List */}
        <div className="space-y-3 mb-5">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.color} border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-3 md:p-4 text-left transform ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } hover:rotate-0 transition-transform duration-200 cursor-pointer`}
            >
              <div className="flex items-center gap-3 mb-1">
                {service.icon}
                <h3 className="text-white font-black text-base md:text-lg">{service.title}</h3>
              </div>
              <p className="text-white font-bold text-sm md:text-base ml-7">{service.duration} - {service.price}</p>
            </div>
          ))}
        </div>

        {/* Contact Text */}
        <p className="text-gray-300 text-sm md:text-base mb-4">Contact me to book your session</p>

        {/* Message on Telegram Button */}
        <Button
          onClick={onContactTelegram}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-base md:text-lg py-3 md:py-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center gap-3"
        >
          <FaTelegram className="text-lg" />
          Message on Telegram
        </Button>
      </Card>
    </div>
  )
}