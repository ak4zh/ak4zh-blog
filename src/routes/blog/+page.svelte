<script>
  import { name } from '$lib/info.js'
  import { format, parseISO } from 'date-fns'

  let { data } = $props()
  let allPosts = $derived(data.allPosts || [])

  let searchQuery = $state('')
  let sortBy = $state('newest')
  let currentPage = $state(1)
  const limit = 10

  // Filter & Sort across entire dataset
  let filteredAndSortedPosts = $derived.by(() => {
    let result = [...allPosts]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.preview?.text && p.preview.text.toLowerCase().includes(query)) ||
          (p.slug && p.slug.toLowerCase().includes(query))
      )
    }

    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else if (sortBy === 'readTime') {
      result.sort((a, b) => {
        const minA = parseInt(a.readingTime) || 0
        const minB = parseInt(b.readingTime) || 0
        return minA - minB
      })
    } else {
      // Default: newest
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return result
  })

  // Reset page when filter or sort changes
  $effect(() => {
    // Read searchQuery and sortBy to create reactive dependency
    searchQuery
    sortBy
    currentPage = 1
  })

  let totalPages = $derived(Math.max(1, Math.ceil(filteredAndSortedPosts.length / limit)))

  let paginatedPosts = $derived.by(() => {
    const start = (currentPage - 1) * limit
    return filteredAndSortedPosts.slice(start, start + limit)
  })

  function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy')
    } catch {
      return dateStr
    }
  }

  function goToPage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
</script>

<svelte:head>
  <title>{name} | Articles</title>
  <meta name="description" content="All articles written by {name}." />
</svelte:head>

<div class="space-y-8 font-serif">
  <div class="space-y-4 border-b border-[#e6e5e0] dark:border-[#2a2a28] pb-6">
    <h1 class="text-3xl sm:text-4xl font-serif font-bold text-[#161615] dark:text-[#f5f5f0] tracking-tight">
      Articles
    </h1>

    <!-- Filter and Sort Controls -->
    <div class="pt-2 flex flex-wrap items-center justify-between gap-3 font-sans">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Filter articles..."
        aria-label="Filter articles"
        class="w-full sm:w-64 px-3.5 py-1.5 rounded-md bg-[#f0efeb] dark:bg-[#20201e] border border-[#e0dfd8] dark:border-[#2e2e2a] text-sm text-[#161615] dark:text-[#f5f5f0] placeholder-[#8e8d87] focus:outline-none"
      />

      <div class="flex items-center space-x-2 text-xs text-[#706f6a] dark:text-[#94938d]">
        <label for="sort-select" class="font-medium">Sort by:</label>
        <select
          id="sort-select"
          bind:value={sortBy}
          class="px-2.5 py-1.5 rounded-md bg-[#f0efeb] dark:bg-[#20201e] border border-[#e0dfd8] dark:border-[#2e2e2a] text-xs text-[#161615] dark:text-[#f5f5f0] focus:outline-none cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title (A–Z)</option>
          <option value="readTime">Read time (Shortest)</option>
        </select>
      </div>
    </div>

    {#if searchQuery.trim()}
      <div class="text-xs font-sans text-[#706f6a] dark:text-[#94938d]">
        Found {filteredAndSortedPosts.length} article{filteredAndSortedPosts.length === 1 ? '' : 's'} matching "{searchQuery}"
      </div>
    {/if}
  </div>

  <!-- Articles List -->
  {#if paginatedPosts.length > 0}
    <div class="divide-y divide-[#eeeede] dark:divide-[#242422]">
      {#each paginatedPosts as post (post.slug)}
        <article class="py-6 first:pt-0 space-y-2 group">
          <div class="flex items-center gap-2 text-xs font-sans text-[#8e8d87] dark:text-[#7d7c76]">
            {#if post.date}
              <time datetime={post.date}>{formatDate(post.date)}</time>
              <span>•</span>
            {/if}
            <span>{post.readingTime}</span>
          </div>

          <h2 class="text-xl font-serif font-bold text-[#161615] dark:text-[#f5f5f0] group-hover:underline underline-offset-4 leading-snug">
            <a href={`/blog/${post.slug}`} data-sveltekit-preload-data="hover">
              {post.title}
            </a>
          </h2>

          {#if post.preview?.html}
            <div class="text-sm font-serif text-[#575650] dark:text-[#b5b4ad] line-clamp-2 leading-relaxed">
              {@html post.preview.html}
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {:else}
    <p class="text-[#8e8d87] py-8 text-sm font-sans">No articles matching "{searchQuery}".</p>
  {/if}

  <!-- Pagination (Works across overall dataset, search & sort) -->
  {#if totalPages > 1}
    <div class="flex items-center justify-between pt-6 border-t border-[#e6e5e0] dark:border-[#2a2a28] text-xs font-sans">
      {#if currentPage > 1}
        <button
          type="button"
          onclick={() => goToPage(currentPage - 1)}
          class="hover:underline text-[#161615] dark:text-[#f5f5f0] font-medium"
        >
          ← Previous
        </button>
      {:else}
        <div></div>
      {/if}

      <span class="text-[#8e8d87]">Page {currentPage} of {totalPages}</span>

      {#if currentPage < totalPages}
        <button
          type="button"
          onclick={() => goToPage(currentPage + 1)}
          class="hover:underline text-[#161615] dark:text-[#f5f5f0] font-medium"
        >
          Next →
        </button>
      {:else}
        <div></div>
      {/if}
    </div>
  {/if}
</div>
