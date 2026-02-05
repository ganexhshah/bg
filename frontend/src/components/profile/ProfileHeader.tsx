import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileHeaderProps {
  name: string
  title: string
  profileImage: string | { url?: string; alt?: string }
}

export function ProfileHeader({ name, title, profileImage }: ProfileHeaderProps) {
  // Extract the image URL from profileImage (could be string or object)
  const imageUrl = typeof profileImage === 'string' 
    ? profileImage 
    : profileImage?.url || ''

  return (
    <div className="flex flex-col items-center space-y-4 md:space-y-6">
      <div className="relative">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-black shadow-[6px_6px_0px_0px_#000000] md:shadow-[8px_8px_0px_0px_#000000]">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="bg-pink-400 text-black text-2xl md:text-3xl font-black border-4 border-black">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="text-center px-4">
        <h1 className="text-3xl md:text-5xl font-black text-black mb-2 md:mb-3 transform -rotate-1">{name}</h1>
        <p className="text-base md:text-xl font-bold text-black bg-yellow-300 px-3 py-2 md:px-4 md:py-2 border-4 border-black shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] transform rotate-1">
          {title}
        </p>
      </div>
    </div>
  )
}