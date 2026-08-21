<script>
  import clsx from 'clsx'
  import { page } from '$app/stores'

  let { href, class: className = '', children } = $props()

  let active = $derived.by(() => {
    const currentPath = $page.url.pathname
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  })

  let linkClass = $derived(
    active
      ? 'text-lg font-bold sm:text-2xl text-slate-900 dark:text-white border-b-2 border-primary-500'
      : 'text-base font-medium sm:text-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors'
  )
</script>

<a
  {href}
  data-sveltekit-preload-data="hover"
  class={clsx(
    className,
    linkClass,
    'transform transition-all inline-flex items-center py-1'
  )}
>
  {#if children}
    {@render children()}
  {/if}
</a>