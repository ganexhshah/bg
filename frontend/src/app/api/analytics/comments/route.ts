import { NextRequest, NextResponse } from 'next/server'

// Generate realistic comment data
function generateRealisticComments(status: string, page: number, limit: number) {
  const stories = [
    { _id: "story1", title: "My First Modeling Experience", slug: "my-first-modeling-experience" },
    { _id: "story2", title: "Behind Every Perfect Shot", slug: "behind-every-perfect-shot" },
    { _id: "story3", title: "Self-Care Sunday Routine", slug: "self-care-sunday-routine" },
    { _id: "story4", title: "Dealing with Social Media Pressure", slug: "dealing-with-social-media-pressure" },
    { _id: "story5", title: "Building Confidence Through Modeling", slug: "building-confidence-through-modeling" }
  ]

  const realComments = [
    "This is such an inspiring story! Thank you for sharing your journey with us.",
    "I love how authentic and vulnerable you are in your writing. Keep it up!",
    "Your perspective on the modeling industry is so refreshing and honest.",
    "This really resonated with me. I've had similar experiences in my career.",
    "Great insights! Your self-care routine sounds amazing, definitely trying some of these tips.",
    "As someone new to modeling, this advice is incredibly valuable. Thank you!",
    "Your storytelling is captivating. I felt like I was right there with you.",
    "The behind-the-scenes look is fascinating. Most people don't see this side.",
    "Your confidence journey is so relatable. Thank you for being so open.",
    "This post came at the perfect time for me. Exactly what I needed to hear.",
    "Love your writing style! Looking forward to reading more of your stories.",
    "The photography tips are gold. Definitely bookmarking this for later.",
    "Your honesty about the challenges is so important. Thank you for keeping it real.",
    "This is why I follow your content. Always so genuine and inspiring.",
    "The way you handle social media pressure is admirable. Great advice!"
  ]

  const spamComments = [
    "Check out this amazing deal! Click here for free stuff! www.suspicious-link.com",
    "Make money fast! Work from home! Contact us now for details!",
    "You won't believe this one weird trick! Doctors hate this!",
    "Free iPhone! Click here to claim your prize now!",
    "Lose weight fast with this miracle pill! Order now!",
    "Hot singles in your area! Click to meet them now!",
    "Congratulations! You've won $1000! Claim your prize here!"
  ]

  const names = [
    "Sarah Johnson", "Mike Chen", "Emma Wilson", "Alex Rodriguez", "Jessica Taylor",
    "David Kim", "Rachel Green", "Tom Anderson", "Lisa Brown", "Chris Martinez",
    "Amanda Davis", "Ryan Thompson", "Nicole White", "Kevin Lee", "Megan Clark",
    "Brandon Hall", "Stephanie Young", "Jason Miller", "Ashley Garcia", "Tyler Moore"
  ]

  const spamNames = [
    "Spam Bot", "Marketing Guru", "Deal Hunter", "Promo Master", "Link Spammer",
    "Fake Account", "Bot User", "Scam Alert", "Phishing Pro"
  ]

  const comments = []
  const now = Date.now()

  for (let i = 0; i < limit; i++) {
    const story = stories[Math.floor(Math.random() * stories.length)]
    const hoursAgo = Math.floor(Math.random() * 168) // Last week
    const isSpam = Math.random() < 0.15 // 15% spam
    const isApproved = !isSpam && Math.random() > 0.3 // 70% of non-spam approved
    
    let shouldInclude = false
    if (status === 'all') shouldInclude = true
    else if (status === 'pending') shouldInclude = !isApproved && !isSpam
    else if (status === 'approved') shouldInclude = isApproved
    else if (status === 'spam') shouldInclude = isSpam

    if (shouldInclude) {
      const commentText = isSpam 
        ? spamComments[Math.floor(Math.random() * spamComments.length)]
        : realComments[Math.floor(Math.random() * realComments.length)]
      
      const userName = isSpam
        ? spamNames[Math.floor(Math.random() * spamNames.length)]
        : names[Math.floor(Math.random() * names.length)]

      comments.push({
        _id: `comment_${(page - 1) * limit + i + 1}`,
        storyId: story,
        user: { 
          name: userName, 
          email: isSpam ? "spam@fake.com" : `${userName.toLowerCase().replace(' ', '.')}@example.com`
        },
        text: commentText,
        isApproved,
        isSpam,
        likes: isSpam ? 0 : Math.floor(Math.random() * 15),
        timestamp: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString()
      })
    }
  }

  return comments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'all'
    
    // Generate realistic comment data
    const comments = generateRealisticComments(status, page, limit)
    
    // Calculate realistic stats
    const totalComments = 150 + Math.floor(Math.random() * 50)
    const stats = {
      total: totalComments,
      pending: Math.floor(totalComments * 0.25), // 25% pending
      approved: Math.floor(totalComments * 0.60), // 60% approved
      spam: Math.floor(totalComments * 0.15) // 15% spam
    }

    return NextResponse.json({
      success: true,
      data: {
        comments,
        stats,
        pagination: {
          page,
          limit,
          total: status === 'all' ? stats.total : stats[status as keyof typeof stats] || 0,
          pages: Math.ceil((status === 'all' ? stats.total : stats[status as keyof typeof stats] || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch comments'
      },
      { status: 500 }
    )
  }
}