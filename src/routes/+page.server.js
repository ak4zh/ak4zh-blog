import { getPosts } from '$lib/server/posts'

/** @type {import('./$types').PageServerLoad} */
export function load() {
  return {
    recentPosts: getPosts({ limit: 10 })
  }
}
