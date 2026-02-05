"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaTimes } from "react-icons/fa"
import { SiTelegram } from "@icons-pack/react-simple-icons"

interface TelegramNotificationProps {
  channelName: string
  description: string
  onJoin: () => void
  onClose: () => void
}

export function TelegramNotification({ 
  channelName, 
  description, 
  onJoin, 
  onClose 
}: TelegramNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  return (
    <Card className="fixed bottom-6 right-6 p-6 bg-cyan-300 shadow-[8px_8px_0px_0px_#000000] max-w-sm border-4 border-black transform rotate-2">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-black rounded-none flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
          <SiTelegram className="text-cyan-300 text-lg" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-black text-lg text-black transform -rotate-1">{channelName}</h3>
          <p className="text-sm text-black font-bold mt-2">{description}</p>
          
          <div className="flex space-x-3 mt-4">
            <Button 
              size="sm" 
              onClick={onJoin}
              className="bg-black hover:bg-gray-800 text-cyan-300 font-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 rounded-none"
            >
              Join Now
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-black hover:text-gray-700 p-2 font-black hover:bg-red-300 border-2 border-black rounded-none"
        >
          <FaTimes />
        </Button>
      </div>
    </Card>
  )
}