import { getPosts as getPostsServer } from '$lib/server/posts'

export function getPosts(options) {
  return getPostsServer(options)
}
