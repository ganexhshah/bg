// Cache utility for storing and retrieving data with expiration
interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes default

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = ttl || this.defaultTTL
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry
    }
    this.cache.set(key, item)
    
    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to store cache in localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    // First check memory cache
    let item = this.cache.get(key)
    
    // If not in memory, try localStorage
    if (!item) {
      try {
        const stored = localStorage.getItem(`cache_${key}`)
        if (stored) {
          item = JSON.parse(stored)
          if (item) {
            this.cache.set(key, item) // Restore to memory cache
          }
        }
      } catch (error) {
        console.warn('Failed to retrieve cache from localStorage:', error)
      }
    }

    if (!item) return null

    // Check if expired
    if (Date.now() > item.expiry) {
      this.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
    try {
      localStorage.removeItem(`cache_${key}`)
    } catch (error) {
      console.warn('Failed to remove cache from localStorage:', error)
    }
  }

  clear(): void {
    this.cache.clear()
    // Clear all cache items from localStorage
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear cache from localStorage:', error)
    }
  }

  // Get cache statistics
  getStats() {
    return {
      memorySize: this.cache.size,
      items: Array.from(this.cache.keys())
    }
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.delete(key))
  }
}

// Create singleton instance
export const cache = new CacheManager()

// Cache keys constants
export const CACHE_KEYS = {
  PROFILE: 'profile',
  STORIES: 'stories',
  GALLERY: 'gallery',
  SETTINGS: 'settings',
  ADMIN_PROFILE: 'admin_profile',
  ADMIN_STORIES: 'admin_stories',
  ADMIN_GALLERY: 'admin_gallery',
  ADMIN_SETTINGS: 'admin_settings',
  STORY_DETAIL: (id: string) => `story_${id}`,
  STORIES_BY_CATEGORY: (category: string) => `stories_${category}`,
  INSTAGRAM_POSTS: 'instagram_posts'
} as const

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes  
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
} as const

// Auto cleanup every 10 minutes
setInterval(() => {
  cache.cleanup()
}, 10 * 60 * 1000)