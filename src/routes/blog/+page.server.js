import { getPosts } from '$lib/server/posts'

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
  const pageParam = url.searchParams.get('page')
  const page = pageParam ? parseInt(pageParam, 10) : 1
  const limit = 10
  const allPosts = getPosts()
  const totalPages = Math.ceil(allPosts.length / limit)
  const posts = getPosts({ page, limit })

  return {
    posts,
    page,
    totalPages,
    totalPosts: allPosts.length
  }
}
