import { Button } from "@/components/ui/button"
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons"
import { ReactNode } from "react"

interface SocialLink {
  platform: string
  url: string
  icon: ReactNode
  bgColor: string
}

interface SocialLinksProps {
  links: SocialLink[]
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="flex space-x-4 md:space-x-6 justify-center">
      {links.map((link) => (
        <Button
          key={link.platform}
          variant="outline"
          size="icon"
          className={`w-12 h-12 md:w-16 md:h-16 rounded-none ${link.bgColor} border-4 border-black text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_#000000] md:shadow-[6px_6px_0px_0px_#000000] transition-all duration-200 font-black`}
          asChild
        >
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <span className="text-lg md:text-xl">{link.icon}</span>
          </a>
        </Button>
      ))}
    </div>
  )
}