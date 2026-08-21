<script>
  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import PostPreview from '$lib/components/PostPreview.svelte'
  import { name } from '$lib/info.js'

  let { data } = $props()
  let posts = $derived(data.posts || [])
  let page = $derived(data.page || 1)
  let totalPages = $derived(data.totalPages || 1)

  let isFirstPage = $derived(page === 1)
  let hasNextPage = $derived(page < totalPages)
</script>

<svelte:head>
  <title>{name} | Blog</title>
  <meta name="description" content="Articles, essays, and technical writeups by {name}" />
</svelte:head>

<div class="flex flex-col flex-grow w-full max-w-4xl mx-auto py-2">
  <div class="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white !my-0">Blog Posts</h1>
    <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Thoughts, essays, and reflections.</p>
  </div>

  <div class="flex-grow divide-y divide-slate-200 dark:divide-slate-800">
    {#each posts as post (post.slug)}
      <div class="py-8 first:pt-0">
        <PostPreview {post} />
      </div>
    {/each}
  </div>

  {#if totalPages > 1}
    <div class="flex items-center justify-between pt-8 mt-6 border-t border-slate-200 dark:border-slate-800">
      {#if !isFirstPage}
        <ButtonLink raised={false} href={`/blog?page=${page - 1}`}>
          {#snippet iconStart()}
            <ArrowLeftIcon class="h-4 w-4 mr-1" />
          {/snippet}
          Previous
        </ButtonLink>
      {:else}
        <div></div>
      {/if}

      <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Page {page} of {totalPages}
      </span>

      {#if hasNextPage}
        <ButtonLink raised={false} href={`/blog?page=${page + 1}`}>
          Next
        </ButtonLink>
      {:else}
        <div></div>
      {/if}
    </div>
  {/if}
</div>
