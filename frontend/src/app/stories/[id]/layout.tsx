import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetch story data for metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stories/${params.id}`)
    
    if (!response.ok) {
      return {
        title: 'Story Not Found',
        description: 'The story you are looking for could not be found.'
      }
    }
    
    const data = await response.json()
    const story = data.data?.story
    
    if (!story) {
      return {
        title: 'Story Not Found',
        description: 'The story you are looking for could not be found.'
      }
    }
    
    const title = story.seo?.metaTitle || story.title
    const description = story.seo?.metaDescription || story.content?.substring(0, 160) || story.preview
    const keywords = story.seo?.keywords?.join(', ') || story.tags?.join(', ') || ''
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stories/${story.slug || story._id}`
    
    return {
      title,
      description,
      keywords,
      authors: [{ name: 'Sonika Karki' }],
      openGraph: {
        title,
        description,
        type: 'article',
        url,
        siteName: 'Sonika Karki Stories',
        publishedTime: story.publishedAt || story.createdAt,
        tags: story.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@sonikakarki',
      },
      alternates: {
        canonical: url,
      },
      other: {
        'article:author': 'Sonika Karki',
        'article:section': story.category || 'Stories',
        'article:tag': story.tags?.join(', ') || '',
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Story',
      description: 'Read amazing stories by Sonika Karki'
    }
  }
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}