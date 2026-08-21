import { getPosts } from '$lib/get-posts'
import { name, website } from '$lib/info'

export function GET() {
  const posts = getPosts()
  const websiteDescription = `${name}'s blog`
  const postsUrl = `${website}/blog`

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${name}</title>
    <link>${website}</link>
    <description>${websiteDescription}</description>
    <atom:link href="${website}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <guid>${postsUrl}/${post.slug}</guid>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.preview?.text || '')}</description>
      <link>${postsUrl}/${post.slug}</link>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : ''}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml'
    }
  })
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
