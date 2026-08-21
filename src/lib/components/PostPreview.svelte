<script>
  import { format, parseISO } from 'date-fns'
  import ButtonLink from './ButtonLink.svelte'

  let { post, small = false, actions = null } = $props()

  let formattedDate = $derived.by(() => {
    if (!post?.date) return ''
    try {
      return format(parseISO(post.date), 'MMMM d, yyyy')
    } catch {
      return post.date
    }
  })
</script>

<div class="flex flex-col h-full justify-between group">
  <div>
    {#if !small}
      <h2 class="!mt-0 !mb-2 text-2xl font-bold group-hover:text-primary-600 transition-colors">
        <a href={`/blog/${post.slug}`} data-sveltekit-preload-data="hover">{post.title}</a>
      </h2>
    {:else}
      <h3 class="!mt-0 !mb-2 text-lg font-semibold group-hover:text-primary-600 transition-colors">
        <a href={`/blog/${post.slug}`} data-sveltekit-preload-data="hover">{post.title}</a>
      </h3>
    {/if}
    <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
      <time datetime={post.date}>{formattedDate}</time>
      <span>•</span>
      <span>{post.readingTime}</span>
    </div>

    {#if post.preview?.html}
      <div class="prose-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
        {@html post.preview.html}
      </div>
    {/if}
  </div>

  {#if actions}
    {@render actions()}
  {:else}
    <div class="flex justify-end w-full pt-2">
      <ButtonLink href={`/blog/${post.slug}`} size={small ? 'small' : 'medium'}>Read More</ButtonLink>
    </div>
  {/if}
</div>
