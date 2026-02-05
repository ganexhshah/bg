"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaTrash, FaSync, FaDatabase, FaClock } from "react-icons/fa"
import { cache } from "@/lib/cache"

export function CacheManager() {
  const [stats, setStats] = useState(cache.getStats())
  const [isClearing, setIsClearing] = useState(false)

  const refreshStats = () => {
    setStats(cache.getStats())
  }

  const clearCache = async () => {
    setIsClearing(true)
    cache.clear()
    setTimeout(() => {
      refreshStats()
      setIsClearing(false)
    }, 500)
  }

  const cleanupExpired = () => {
    cache.cleanup()
    refreshStats()
  }

  return (
    <Card className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] p-6 transform rotate-1">
      <h3 className="text-lg font-black text-black mb-4 transform -rotate-1">🗄️ Cache Management</h3>
      
      <div className="space-y-4">
        {/* Cache Stats */}
        <div className="bg-blue-50 border-2 border-blue-300 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaDatabase className="text-blue-600" />
            <span className="font-black text-black">Cache Statistics</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-bold">Memory Items:</span>
              <span className="ml-2 font-black text-black">{stats.memorySize}</span>
            </div>
            <div>
              <span className="text-gray-600 font-bold">Total Keys:</span>
              <span className="ml-2 font-black text-black">{stats.items.length}</span>
            </div>
          </div>
        </div>

        {/* Cache Items */}
        {stats.items.length > 0 && (
          <div className="bg-gray-50 border-2 border-gray-300 p-4 max-h-32 overflow-y-auto">
            <div className="text-sm font-bold text-gray-700 mb-2">Cached Items:</div>
            <div className="space-y-1">
              {stats.items.map((key, index) => (
                <div key={index} className="text-xs font-mono text-gray-600 bg-white px-2 py-1 border border-gray-200">
                  {key}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={refreshStats}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
          >
            <FaSync />
            Refresh
          </Button>
          
          <Button
            onClick={cleanupExpired}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
          >
            <FaClock />
            Cleanup
          </Button>
          
          <Button
            onClick={clearCache}
            disabled={isClearing}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_#000000] rounded-none"
          >
            <FaTrash />
            {isClearing ? "Clearing..." : "Clear All"}
          </Button>
        </div>

        <div className="text-xs text-gray-600 font-bold">
          💡 Cache improves performance by storing frequently accessed data. Clear if experiencing stale data issues.
        </div>
      </div>
    </Card>
  )
}