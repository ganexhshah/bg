import { Skeleton } from "./skeleton"

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Dashboard Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-16 h-16" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminGallerySkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Upload Area Skeleton */}
        <div className="bg-blue-100 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-8 mb-8 transform rotate-1">
          <div className="text-center">
            <Skeleton className="w-16 h-16 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto mb-4" />
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4">
              <Skeleton className="aspect-square w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Skeleton */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-blue-100 border-4 border-black shadow-[4px_4px_0px_0px_#000000] p-6 text-center">
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-12 h-12" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-4 transform rotate-1">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8">
              <Skeleton className="h-6 w-48 mb-6" />
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t-4 border-black">
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminStoriesSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-24" />
            ))}
          </div>
        </div>

        {/* Stories List Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-yellow-300 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-20 right-8 md:top-32 md:right-16 w-10 h-10 md:w-16 md:h-16 bg-red-400 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-16 h-16 md:w-24 md:h-24 bg-blue-300 border-4 border-black transform rotate-45"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-12 h-12" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-8">
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
                
                {/* Profile Image Upload Skeleton */}
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-24 h-24" />
                    <div>
                      <Skeleton className="h-10 w-40 mb-2" />
                      <Skeleton className="h-3 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            {/* Preview Skeleton */}
            <div className="bg-lime-300 border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 mb-6 transform rotate-1">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="bg-white border-2 border-black p-4 transform -rotate-1">
                <div className="text-center">
                  <Skeleton className="w-20 h-20 mx-auto mb-3" />
                  <Skeleton className="h-5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-40 mx-auto mb-2" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform -rotate-1">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="p-3 bg-gray-100 border-2 border-gray-300">
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}