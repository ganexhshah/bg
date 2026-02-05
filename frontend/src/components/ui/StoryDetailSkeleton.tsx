import { Skeleton } from "./skeleton"

export function StoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Skeleton className="w-12 h-12" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Story Content Skeleton */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] mb-6 p-6 md:p-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Story Info Skeleton */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6 mb-6">
              <Skeleton className="h-6 w-48 mb-3" />
              
              {/* Stats Skeleton */}
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-18" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3 mb-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>

              {/* Tags Skeleton */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-18" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 md:p-6 transform rotate-1">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-3">
                    <div className="flex gap-3">
                      <Skeleton className="w-16 h-12" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}