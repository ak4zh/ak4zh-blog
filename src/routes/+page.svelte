<script>
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import PostPreview from '$lib/components/PostPreview.svelte'
  import { name } from '$lib/info.js'

  let { data } = $props()
  let recentPosts = $derived(data.recentPosts || [])
</script>

<svelte:head>
  <title>{name} — Full Stack Developer & Writer</title>
  <meta name="description" content="Personal blog and portfolio of ak4zh - full stack developer, builder, and lifelong learner." />
</svelte:head>

<div class="w-full max-w-4xl mx-auto py-4">
  <div class="text-center py-10 max-w-2xl mx-auto">
    <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white !mb-4">
      Hi, I'm <span class="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">{name}</span>
    </h1>
    <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium !mt-2">
      A self-taught full stack developer.
    </p>
    <p class="text-slate-500 dark:text-slate-400 font-light italic !mt-2">
      "Learning by doing is the only way I know how to learn."
    </p>
  </div>

  <section class="mt-8">
    <div class="flex items-center justify-between !mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white !my-0">
        Recent Posts
      </h2>
      <ButtonLink href="/blog" size="small" raised={false} class="hover:underline">
        View All Posts
      </ButtonLink>
    </div>

    <div class="grid gap-6 grid-cols-1 md:grid-cols-2">
      {#each recentPosts as post (post.slug)}
        <div class="p-5 border border-slate-200 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
          <PostPreview {post} small />
        </div>
      {/each}
    </div>
  </section>
</div>
