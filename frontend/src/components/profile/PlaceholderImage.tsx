interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
}

export function PlaceholderImage({ width, height, text = "Profile" }: PlaceholderImageProps) {
  return (
    <div 
      className="bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white font-bold rounded-full"
      style={{ width, height }}
    >
      {text}
    </div>
  )
}