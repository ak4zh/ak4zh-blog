import { getPosts as getPostsServer } from '#lib/server/posts.js'

export function getPosts(options) {
  return getPostsServer(options)
}
