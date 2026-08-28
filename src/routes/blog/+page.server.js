import { getPosts } from '#lib/server/posts.js'

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const allPosts = getPosts()
  return {
    allPosts
  }
}
