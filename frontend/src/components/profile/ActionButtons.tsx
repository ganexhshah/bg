import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface ActionButton {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  className?: string
}

interface ActionButtonsProps {
  buttons: ActionButton[]
}

export function ActionButtons({ buttons }: ActionButtonsProps) {
  return (
    <div className="flex flex-col space-y-3 md:space-y-4 w-full max-w-2xl">
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          variant={button.variant || "default"}
          className={`w-full px-6 py-4 md:py-5 text-white font-black text-base md:text-lg rounded-full border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] transition-all duration-200 flex items-center justify-center gap-3 ${button.className}`}
        >
          {button.icon}
          <span>{button.label}</span>
        </Button>
      ))}
    </div>
  )
}