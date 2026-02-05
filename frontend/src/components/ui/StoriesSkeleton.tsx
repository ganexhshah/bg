import { Skeleton } from "./skeleton"

export function StoriesSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Skeleton className="w-12 h-12" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        {/* Stories List Skeleton */}
        <div className="space-y-6 md:space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 md:p-8">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              
              {/* Meta info skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Buttons skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}