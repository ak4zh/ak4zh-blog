import { format } from 'date-fns'
import { parse } from 'node-html-parser'
import { render } from 'svelte/server'

/**
 * Gets all posts with added metadata.
 * Strictly runs on the server side.
 */
export function getPosts({ page = 1, limit } = {}) {
  if (limit) {
    return posts.slice((page - 1) * limit, page * limit)
  }

  return posts
}

const posts = Object.entries(import.meta.glob('/blog/**/*.md', { eager: true }))
  .map(([filepath, post]) => {
    const slug = filepath
      .replace(/(\/index)?\.md$/, '')
      .split('/')
      .pop()

    const isIndexFile = filepath.endsWith('/index.md')
    const metadata = post.metadata || {}

    return {
      ...metadata,
      slug,
      isIndexFile,
      date: metadata.date
        ? format(addTimezoneOffset(new Date(metadata.date)), 'yyyy-MM-dd')
        : undefined,
      component: post.default,
      customPreview: metadata.preview
    }
  })
  .map((post) => {
    let previewHtml = ''
    let previewText = ''
    let calculatedReadingTime = '1 min read'

    if (post.component) {
      try {
        const rendered = render(post.component)
        const renderedHtml = rendered.html
        const parsedHtml = parse(renderedHtml)
        const preview = post.customPreview ? post.customPreview : parsedHtml.querySelector('p')
        previewHtml = preview ? preview.toString() : ''
        previewText = preview ? preview.structuredText || '' : ''
        calculatedReadingTime = calculateReadingTime(parsedHtml.structuredText || '')
      } catch (err) {
        console.error(`Error rendering post ${post.slug} preview:`, err)
      }
    }

    return {
      title: post.title || post.slug,
      date: post.date,
      slug: post.slug,
      isIndexFile: post.isIndexFile,
      customPreview: post.customPreview,
      preview: {
        html: previewHtml,
        text: previewText
      },
      readingTime: calculatedReadingTime
    }
  })
  .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
  .map((post, index, allPosts) => ({
    ...post,
    next: allPosts[index - 1]
      ? {
          title: allPosts[index - 1].title,
          slug: allPosts[index - 1].slug,
          date: allPosts[index - 1].date,
          readingTime: allPosts[index - 1].readingTime
        }
      : null,
    previous: allPosts[index + 1]
      ? {
          title: allPosts[index + 1].title,
          slug: allPosts[index + 1].slug,
          date: allPosts[index + 1].date,
          readingTime: allPosts[index + 1].readingTime
        }
      : null
  }))

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000
  return new Date(new Date(date).getTime() + offsetInMilliseconds)
}

function calculateReadingTime(text) {
  if (!text) return '1 min read'
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200) || 1
  return `${minutes} min read`
}
