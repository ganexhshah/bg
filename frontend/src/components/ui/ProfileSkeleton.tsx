import { Skeleton } from "./skeleton"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-3 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>
      <div className="absolute bottom-20 right-5 md:bottom-40 md:right-10 w-8 h-8 md:w-12 md:h-12 bg-green-400 border-4 border-black transform -rotate-12"></div>
      
      <div className="max-w-4xl w-full space-y-8 md:space-y-16 relative z-10">
        <div className="max-w-2xl mx-auto space-y-5 md:space-y-12">
          {/* Profile Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-black" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          
          {/* Social Links Skeleton */}
          <div className="flex justify-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
          
          {/* Action Buttons Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          
          {/* Stories Preview Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
          
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>

        {/* Instagram Gallery Skeleton */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}