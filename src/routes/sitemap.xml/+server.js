import { getPosts } from '$lib/get-posts'
import { website } from '$lib/info'

export function GET() {
  const postsUrl = `${website}/blog`

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <url>
    <loc>${website}</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${website}/blog</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${website}/projects</loc>
    <priority>0.8</priority>
  </url>

  ${getPosts()
    .map(
      (post) => `
  <url>
    <loc>${postsUrl}/${post.slug}</loc>
    <lastmod>${
      post.updated
        ? new Date(post.updated).toISOString()
        : post.date
        ? new Date(post.date).toISOString()
        : new Date().toISOString()
    }</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=600',
      'Content-Type': 'application/xml'
    }
  })
}
