import { error } from '@sveltejs/kit'
import { getPosts } from '#lib/server/posts.js'

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  const posts = getPosts()
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    error(404, 'Post not found')
  }

  return {
    post
  }
}
