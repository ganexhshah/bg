interface GalleryProps {
  title: string
  description: string
}

export function Gallery({ title, description }: GalleryProps) {
  return (
    <div className="text-center space-y-4 md:space-y-6 px-4">
      <div className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] md:shadow-[8px_8px_0px_0px_#000000] p-4 md:p-6 transform -rotate-2">
        <h2 className="text-2xl md:text-4xl font-black text-black transform rotate-1">{title}</h2>
      </div>
      <p className="text-black font-bold text-sm md:text-lg max-w-md mx-auto bg-white border-4 border-black p-3 md:p-4 shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] transform rotate-1">
        {description}
      </p>
    </div>
  )
}