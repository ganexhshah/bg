import { Skeleton } from "./skeleton"

export function ProofSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>
      <div className="absolute bottom-20 right-5 md:bottom-40 md:right-10 w-8 h-8 md:w-12 md:h-12 bg-green-400 border-4 border-black transform -rotate-12"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Skeleton className="w-12 h-12" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        {/* Proof Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6">
              {/* Thumbnail Skeleton */}
              <div className="relative mb-4">
                <Skeleton className="aspect-video w-full border-4 border-black" />
              </div>

              {/* Content Skeleton */}
              <div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge Skeleton */}
        <div className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8 text-center transform rotate-1">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Skeleton className="w-16 h-16 md:w-20 md:h-20" />
            <div className="text-left">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-xl mx-auto" />
        </div>
      </div>
    </div>
  )
}