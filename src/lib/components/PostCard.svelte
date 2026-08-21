<script>
  import { format, parseISO } from 'date-fns'
  import { Calendar, Clock, ArrowRight } from '@lucide/svelte'

  let { post, compact = false } = $props()

  let formattedDate = $derived.by(() => {
    if (!post?.date) return ''
    try {
      return format(parseISO(post.date), 'MMM d, yyyy')
    } catch {
      return post.date
    }
  })
</script>

<article
  class="group relative flex flex-col h-full p-6 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 glass-card"
>
  <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
    {#if formattedDate}
      <span class="flex items-center gap-1 font-medium">
        <Calendar class="w-3.5 h-3.5 text-indigo-500" />
        <time datetime={post.date}>{formattedDate}</time>
      </span>
      <span>•</span>
    {/if}
    <span class="flex items-center gap-1 font-medium">
      <Clock class="w-3.5 h-3.5 text-indigo-500" />
      <span>{post.readingTime}</span>
    </span>
  </div>

  <h3 class={compact ? 'text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2' : 'text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2'}>
    <a href={`/blog/${post.slug}`} data-sveltekit-preload-data="hover" class="focus:outline-none">
      <span class="absolute inset-0" aria-hidden="true"></span>
      {post.title}
    </a>
  </h3>

  {#if post.preview?.html && !compact}
    <div class="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 flex-grow prose-sm">
      {@html post.preview.html}
    </div>
  {/if}

  <div class="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800/60">
    <span>Read article</span>
    <ArrowRight class="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
  </div>
</article>
