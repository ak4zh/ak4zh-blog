import { getPosts } from '$lib/server/posts'

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const allPosts = getPosts()
  return {
    allPosts
  }
}
