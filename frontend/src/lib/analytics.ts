// Client-side analytics tracking
interface AnalyticsData {
  sessionId: string
  url: string
  title: string
  referrer?: string
  timeSpent?: number
  location?: {
    country?: string
    countryCode?: string
    region?: string
    city?: string
    timezone?: string
  }
}

class Analytics {
  private sessionId: string
  private startTime: number
  private lastPageTime: number
  private isTracking: boolean = false
  private location: any = null

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.startTime = Date.now()
    this.lastPageTime = Date.now()
    this.initializeTracking()
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  private async initializeTracking() {
    if (typeof window === 'undefined') return

    // Get user location (optional)
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        this.location = await response.json()
      }
    } catch (error) {
      console.warn('Failed to get location data:', error)
    }

    // Track initial page view
    this.trackPageView()

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackTimeSpent()
      } else {
        this.lastPageTime = Date.now()
      }
    })

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.trackTimeSpent()
    })

    // Track page changes for SPA
    this.setupSPATracking()

    this.isTracking = true
  }

  private setupSPATracking() {
    // Override pushState and replaceState for SPA navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      this.trackTimeSpent()
      originalPushState.apply(history, args)
      setTimeout(() => this.trackPageView(), 100)
    }

    history.replaceState = (...args) => {
      this.trackTimeSpent()
      originalReplaceState.apply(history, args)
      setTimeout(() => this.trackPageView(), 100)
    }

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
      this.trackTimeSpent()
      setTimeout(() => this.trackPageView(), 100)
    })
  }

  private async trackPageView() {
    if (typeof window === 'undefined') return

    const data: AnalyticsData = {
      sessionId: this.sessionId,
      url: window.location.pathname + window.location.search,
      title: document.title,
      referrer: document.referrer,
      location: this.location
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }

    this.lastPageTime = Date.now()
  }

  private async trackTimeSpent() {
    if (!this.isTracking || typeof window === 'undefined') return

    const timeSpent = Math.round((Date.now() - this.lastPageTime) / 1000)
    
    if (timeSpent < 1) return // Ignore very short visits

    const data: AnalyticsData = {
      sessionId: this.sessionId,
      url: window.location.pathname + window.location.search,
      title: document.title,
      timeSpent
    }

    try {
      // Use sendBeacon for reliability during page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify(data))
      } else {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          keepalive: true
        })
      }
    } catch (error) {
      console.warn('Time tracking failed:', error)
    }
  }

  // Public methods for manual tracking
  public trackEvent(eventName: string, eventData?: any) {
    if (typeof window === 'undefined') return

    const data = {
      sessionId: this.sessionId,
      event: eventName,
      data: eventData,
      url: window.location.pathname + window.location.search,
      timestamp: Date.now()
    }

    try {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.warn('Event tracking failed:', error)
    }
  }

  public getSessionId(): string {
    return this.sessionId
  }

  public getSessionDuration(): number {
    return Math.round((Date.now() - this.startTime) / 1000)
  }
}

// Create singleton instance
let analytics: Analytics | null = null

export const initAnalytics = () => {
  if (typeof window !== 'undefined' && !analytics) {
    analytics = new Analytics()
  }
  return analytics
}

export const trackEvent = (eventName: string, eventData?: any) => {
  if (analytics) {
    analytics.trackEvent(eventName, eventData)
  }
}

export const getAnalytics = () => analytics

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initAnalytics()
}