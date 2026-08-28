<script>
  import { format, parseISO } from 'date-fns'
  import { name, website } from '#lib/info.js'
  import ReadingProgress from '#lib/components/ReadingProgress.svelte'
  import AudioReader from '#lib/components/AudioReader.svelte'

  let { data } = $props()
  let post = $derived(data.post)
  let Component = $derived(data.component)

  let formattedDate = $derived.by(() => {
    if (!post?.date) return ''
    try {
      return format(parseISO(post.date), 'MMMM d, yyyy')
    } catch {
      return post.date
    }
  })

  let url = $derived(`${website}/blog/${post?.slug}`)
</script>

<svelte:head>
  <title>{post.title} — {name}</title>
  <meta name="description" content={post.preview?.text} />
  <meta name="author" content={name} />

  <!-- Open Graph -->
  <meta property="og:url" content={url} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.preview?.text} />
</svelte:head>

<ReadingProgress />

<article class="space-y-8 font-serif">
  <div>
    <a href="/blog" class="text-xs font-sans font-medium text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] transition-colors">
      ← All articles
    </a>
  </div>

  <header class="space-y-4 border-b border-[#e6e5e0] dark:border-[#2a2a28] pb-6">
    <h1 class="text-3xl sm:text-4xl font-serif font-bold text-[#161615] dark:text-[#f5f5f0] tracking-tight leading-tight">
      {post.title}
    </h1>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
      <div class="text-xs font-sans text-[#8e8d87] dark:text-[#7d7c76] flex items-center gap-2">
        {#if formattedDate}
          <time datetime={post.date}>{formattedDate}</time>
          <span>•</span>
        {/if}
        <span>{post.readingTime}</span>
      </div>

      <!-- Text to Speech Audio Reader Button -->
      <AudioReader title={post.title} targetSelector=".prose" />
    </div>
  </header>

  <!-- Content -->
  <div class="prose prose-neutral dark:prose-invert max-w-none">
    {#if Component}
      <Component />
    {/if}
  </div>

  <!-- Next / Previous Links -->
  {#if post.previous || post.next}
    <div class="pt-8 border-t border-[#e6e5e0] dark:border-[#2a2a28] mt-16 space-y-4 font-sans text-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#if post.previous}
          <div>
            <span class="text-neutral-400 dark:text-neutral-500 uppercase font-semibold text-[10px] tracking-wider block mb-1">Previous</span>
            <a href={`/blog/${post.previous.slug}`} class="font-serif text-sm font-medium hover:underline text-[#161615] dark:text-[#f5f5f0]">
              ← {post.previous.title}
            </a>
          </div>
        {:else}
          <div></div>
        {/if}

        {#if post.next}
          <div class="text-left sm:text-right">
            <span class="text-neutral-400 dark:text-neutral-500 uppercase font-semibold text-[10px] tracking-wider block mb-1">Next</span>
            <a href={`/blog/${post.next.slug}`} class="font-serif text-sm font-medium hover:underline text-[#161615] dark:text-[#f5f5f0]">
              {post.next.title} →
            </a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</article>
