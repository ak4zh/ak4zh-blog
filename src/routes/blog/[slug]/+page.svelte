<script>
  import { format, parseISO } from 'date-fns'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import { name, website } from '$lib/info.js'
  import ToC from '$lib/components/ToC.svelte'
  import PostPreview from '$lib/components/PostPreview.svelte'
  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte'

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

  let ogImage = $derived(
    `https://og-image.vercel.app/**${encodeURIComponent(
      post?.title || ''
    )}**?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-color-logo.svg`
  )

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
  <meta property="og:image" content={ogImage} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={website} />
  <meta property="twitter:url" content={url} />
  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:description" content={post.preview?.text} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<article class="relative w-full max-w-4xl mx-auto py-2">
  <header class="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight !mt-0 !mb-3">
      {post.title}
    </h1>
    <div class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
      {#if formattedDate}
        <time datetime={post.date}>{formattedDate}</time>
        <span>•</span>
      {/if}
      <span>{post.readingTime}</span>
    </div>
  </header>

  <div class="relative flex flex-col lg:flex-row gap-8">
    <div class="flex-grow prose prose-slate dark:prose-invert max-w-none">
      {#if Component}
        <Component />
      {/if}
    </div>

    {#if post}
      <aside class="hidden xl:block w-64 flex-shrink-0 not-prose">
        <div class="sticky top-24">
          <ToC allowedHeadings={['h2', 'h3', 'h4', 'h5', 'h6']} />
        </div>
      </aside>
    {/if}
  </div>
</article>

<div class="pt-8 flex justify-between border-t border-slate-200 dark:border-slate-800 mt-12">
  <ButtonLink href="/blog">
    {#snippet iconStart()}
      <ArrowLeftIcon class="h-4 w-4 mr-1" />
    {/snippet}
    Back to All Posts
  </ButtonLink>
</div>

{#if post.previous || post.next}
  <div class="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2">
    {#if post.previous}
      <div class="flex flex-col">
        <span class="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500 mb-2">Previous Post</span>
        <div class="flex-1 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <PostPreview post={post.previous} small />
        </div>
      </div>
    {:else}
      <div></div>
    {/if}

    {#if post.next}
      <div class="flex flex-col">
        <span class="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500 mb-2 text-right">Next Post</span>
        <div class="flex-1 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          <PostPreview post={post.next} small />
        </div>
      </div>
    {/if}
  </div>
{/if}
