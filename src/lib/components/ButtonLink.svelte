<script>
  import ArrowRightIcon from './ArrowRightIcon.svelte'

  let {
    href,
    raised = true,
    size = 'medium',
    class: className = '',
    target = undefined,
    rel = undefined,
    iconStart = null,
    iconEnd = null,
    children
  } = $props()
</script>

<div class="not-prose inline-block">
  <a
    {href}
    {target}
    {rel}
    data-sveltekit-preload-data="hover"
    class={'inline-flex items-center text-slate-800 dark:text-slate-200 rounded-md no-underline font-medium transition-all duration-200 ' +
      className}
    class:small={size === 'small'}
    class:medium={size === 'medium'}
    class:large={size === 'large'}
    class:raised
  >
    <div class="flex items-center space-x-1.5">
      {#if iconStart}
        {@render iconStart()}
      {/if}
      <span>
        {#if children}
          {@render children()}
        {/if}
      </span>
      {#if iconEnd}
        {@render iconEnd()}
      {:else}
        <ArrowRightIcon class="h-4 w-4" />
      {/if}
    </div>
  </a>
</div>

<style lang="postcss">
  .small {
    @apply text-xs px-2.5 py-1;
  }

  .medium {
    @apply text-sm px-3.5 py-1.5;
  }

  .large {
    @apply text-base px-5 py-2.5;
  }

  .raised {
    @apply bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm border border-slate-300/50 dark:border-slate-700/50;
  }
</style>
