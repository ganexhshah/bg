import { NextRequest, NextResponse } from 'next/server'

// Generate realistic visitor data
function generateRealisticVisitors(page: number, limit: number) {
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera']
  const os = ['Windows', 'macOS', 'Linux', 'iOS', 'Android']
  const devices = ['desktop', 'mobile', 'tablet']
  const countries = [
    { name: 'United States', code: 'US', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
    { name: 'United Kingdom', code: 'GB', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'] },
    { name: 'Canada', code: 'CA', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'] },
    { name: 'Australia', code: 'AU', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] },
    { name: 'Germany', code: 'DE', cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'] },
    { name: 'France', code: 'FR', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'] },
    { name: 'Netherlands', code: 'NL', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'] },
    { name: 'India', code: 'IN', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'] }
  ]

  const visitors = []
  const now = Date.now()

  for (let i = 0; i < limit; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)]
    const browser = browsers[Math.floor(Math.random() * browsers.length)]
    const operatingSystem = os[Math.floor(Math.random() * os.length)]
    const device = devices[Math.floor(Math.random() * devices.length)]
    const city = country.cities[Math.floor(Math.random() * country.cities.length)]
    
    // Generate realistic IP addresses
    const ipParts = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ]
    
    // Generate realistic session data
    const pageViews = 1 + Math.floor(Math.random() * 15)
    const timeSpent = pageViews * (30 + Math.floor(Math.random() * 180)) // 30-210 seconds per page
    const hoursAgo = Math.floor(Math.random() * 72) // Last 3 days
    
    visitors.push({
      _id: `visitor_${(page - 1) * limit + i + 1}`,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: ipParts.join('.'),
      browser: { 
        name: browser, 
        version: `${Math.floor(Math.random() * 20) + 80}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 1000)}` 
      },
      os: { 
        name: operatingSystem, 
        version: operatingSystem === 'Windows' ? '10' : operatingSystem === 'macOS' ? '12.0' : '11.0' 
      },
      device,
      location: { 
        country: country.name, 
        countryCode: country.code, 
        city,
        region: city
      },
      pageViews,
      totalTimeSpent: timeSpent,
      isReturning: Math.random() > 0.7, // 30% returning visitors
      createdAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString()
    })
  }

  return visitors.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Generate realistic visitor data
    const visitors = generateRealisticVisitors(page, limit)
    const totalVisitors = 1500 + Math.floor(Math.random() * 500) // Simulate total count

    return NextResponse.json({
      success: true,
      data: {
        visitors,
        pagination: {
          page,
          limit,
          total: totalVisitors,
          pages: Math.ceil(totalVisitors / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get visitors error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch visitors'
      },
      { status: 500 }
    )
  }
}