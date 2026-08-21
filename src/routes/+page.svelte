<script>
  import { name } from '$lib/info.js'
  import { format, parseISO } from 'date-fns'

  let { data } = $props()
  let recentPosts = $derived(data.recentPosts || [])

  function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy')
    } catch {
      return dateStr
    }
  }
</script>

<svelte:head>
  <title>{name} — Blog & Writings</title>
  <meta name="description" content="Personal blog and writings of ak4zh." />
</svelte:head>

<div class="space-y-12">
  <!-- Minimal Bio -->
  <section class="space-y-4">
    <h1 class="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#161615] dark:text-[#f5f5f0]">
      Hey, I'm {name}.
    </h1>
    <p class="text-lg text-[#40403b] dark:text-[#c4c3bc] leading-relaxed font-serif">
      A self-taught full stack developer. I learn by building software and write about ideas, lessons, digital tools, and personal growth.
    </p>
  </section>

  <!-- Recent Writing -->
  <section class="space-y-6">
    <div class="flex items-baseline justify-between border-b border-[#e6e5e0] dark:border-[#2a2a28] pb-3">
      <h2 class="text-xl font-serif font-bold text-[#161615] dark:text-[#f5f5f0]">Recent Posts</h2>
      <a href="/blog" class="text-xs font-sans font-medium text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] underline underline-offset-4">
        All posts →
      </a>
    </div>

    <div class="space-y-6">
      {#each recentPosts.slice(0, 8) as post (post.slug)}
        <article class="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <h3 class="text-lg font-serif font-semibold text-[#161615] dark:text-[#e6e5e0] group-hover:underline underline-offset-4 leading-snug">
            <a href={`/blog/${post.slug}`} data-sveltekit-preload-data="hover">
              {post.title}
            </a>
          </h3>

          <div class="flex items-center gap-2 text-xs font-sans text-[#8e8d87] dark:text-[#7d7c76] whitespace-nowrap shrink-0">
            {#if post.date}
              <time datetime={post.date}>{formatDate(post.date)}</time>
              <span>•</span>
            {/if}
            <span>{post.readingTime}</span>
          </div>
        </article>
      {/each}
    </div>
  </section>
</div>
