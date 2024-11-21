<script>
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import PostPreview from '$lib/components/PostPreview.svelte'
  import { name } from '$lib/info.js'

  export let recentPosts
</script>

<svelte:head>
  <title>{name}</title>
</svelte:head>

<div class="container px-6 py-16 mx-auto text-center">
  <div class="max-w-lg mx-auto">
    <div class="mt-8 space-y-2">
      <p class="mt-6 text-gray-500 dark:text-gray-300">
        <span class="mx-2">A self-taught full stack developer</span>
      </p>

      <p class="mt-6 text-gray-700 dark:text-gray-200 font-light">
        <span class="mx-2">Learning by doing is the only way I know how to learn.</span>
      </p>
    </div>
  </div>

  <!-- recent posts -->
  <h2 class="flex items-baseline gap-4 !mb-2">
    Recent Posts
    <ButtonLink href="/blog" size="small" raised={false} class="opacity-60">View All</ButtonLink>
  </h2>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
    {#each recentPosts as post}
      <div class="flex p-4 border border-slate-300 dark:border-slate-700 rounded-lg">
        <PostPreview {post} small />
      </div>
    {/each}
  </div>
</div>
