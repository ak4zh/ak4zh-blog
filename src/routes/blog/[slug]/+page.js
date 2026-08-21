import { error } from '@sveltejs/kit'

const markdownFiles = import.meta.glob('/blog/**/*.md')

/** @type {import('./$types').PageLoad} */
export async function load({ data, params }) {
  const slug = params.slug
  const fileKey = Object.keys(markdownFiles).find(
    (key) => key.endsWith(`/${slug}.md`) || key.endsWith(`/${slug}/index.md`)
  )

  if (!fileKey) {
    error(404, 'Post markdown file not found')
  }

  const module = await markdownFiles[fileKey]()

  return {
    ...data,
    component: module.default
  }
}
