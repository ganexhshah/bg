import { NextRequest, NextResponse } from 'next/server'

// Generate realistic mock data based on current date
function generateRealisticData(period: string) {
  const now = new Date()
  let days = 7
  
  switch (period) {
    case '24h':
      days = 1
      break
    case '7d':
      days = 7
      break
    case '30d':
      days = 30
      break
    case '90d':
      days = 90
      break
  }

  // Generate daily stats
  const dailyStats = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate realistic numbers with some randomness
    const baseViews = 200 + Math.floor(Math.random() * 300)
    const baseVisitors = Math.floor(baseViews * 0.6) + Math.floor(Math.random() * 50)
    
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      pageViews: baseViews + Math.floor(Math.random() * 100),
      uniqueVisitors: baseVisitors + Math.floor(Math.random() * 30)
    })
  }

  // Calculate totals
  const totalPageViews = dailyStats.reduce((sum, day) => sum + day.pageViews, 0)
  const totalUniqueVisitors = dailyStats.reduce((sum, day) => sum + day.uniqueVisitors, 0)
  const totalVisitors = Math.floor(totalUniqueVisitors * 1.2) // Some returning visitors
  
  return {
    overview: {
      totalVisitors,
      uniqueVisitors: totalUniqueVisitors,
      totalPageViews,
      totalComments: Math.floor(totalPageViews * 0.03), // 3% comment rate
      avgSessionDuration: 180 + Math.floor(Math.random() * 120), // 3-5 minutes
      bounceRate: 25 + Math.floor(Math.random() * 20) // 25-45%
    },
    topPages: [
      { url: "/", title: "Home", views: Math.floor(totalPageViews * 0.35), uniqueViews: Math.floor(totalUniqueVisitors * 0.4) },
      { url: "/stories", title: "Stories", views: Math.floor(totalPageViews * 0.25), uniqueViews: Math.floor(totalUniqueVisitors * 0.3) },
      { url: "/proof", title: "Proof", views: Math.floor(totalPageViews * 0.15), uniqueViews: Math.floor(totalUniqueVisitors * 0.18) },
      { url: "/stories/my-first-modeling-experience", title: "My First Modeling Experience", views: Math.floor(totalPageViews * 0.12), uniqueViews: Math.floor(totalUniqueVisitors * 0.15) },
      { url: "/stories/behind-every-perfect-shot", title: "Behind Every Perfect Shot", views: Math.floor(totalPageViews * 0.08), uniqueViews: Math.floor(totalUniqueVisitors * 0.1) },
      { url: "/stories/self-care-sunday-routine", title: "Self-Care Sunday Routine", views: Math.floor(totalPageViews * 0.05), uniqueViews: Math.floor(totalUniqueVisitors * 0.07) }
    ],
    topCountries: [
      { country: "United States", countryCode: "US", visitors: Math.floor(totalUniqueVisitors * 0.35) },
      { country: "United Kingdom", countryCode: "GB", visitors: Math.floor(totalUniqueVisitors * 0.18) },
      { country: "Canada", countryCode: "CA", visitors: Math.floor(totalUniqueVisitors * 0.12) },
      { country: "Australia", countryCode: "AU", visitors: Math.floor(totalUniqueVisitors * 0.08) },
      { country: "Germany", countryCode: "DE", visitors: Math.floor(totalUniqueVisitors * 0.07) },
      { country: "France", countryCode: "FR", visitors: Math.floor(totalUniqueVisitors * 0.06) },
      { country: "Netherlands", countryCode: "NL", visitors: Math.floor(totalUniqueVisitors * 0.05) },
      { country: "India", countryCode: "IN", visitors: Math.floor(totalUniqueVisitors * 0.04) },
      { country: "Japan", countryCode: "JP", visitors: Math.floor(totalUniqueVisitors * 0.03) },
      { country: "Brazil", countryCode: "BR", visitors: Math.floor(totalUniqueVisitors * 0.02) }
    ],
    browserStats: [
      { browser: "Chrome", users: Math.floor(totalUniqueVisitors * 0.65) },
      { browser: "Safari", users: Math.floor(totalUniqueVisitors * 0.18) },
      { browser: "Firefox", users: Math.floor(totalUniqueVisitors * 0.10) },
      { browser: "Edge", users: Math.floor(totalUniqueVisitors * 0.05) },
      { browser: "Opera", users: Math.floor(totalUniqueVisitors * 0.02) }
    ],
    deviceStats: [
      { device: "desktop", users: Math.floor(totalUniqueVisitors * 0.55) },
      { device: "mobile", users: Math.floor(totalUniqueVisitors * 0.38) },
      { device: "tablet", users: Math.floor(totalUniqueVisitors * 0.07) }
    ],
    dailyStats,
    period
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    
    // Generate realistic data based on period
    const data = generateRealisticData(period)

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Analytics dashboard error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch analytics data'
      },
      { status: 500 }
    )
  }
}