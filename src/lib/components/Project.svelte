<script>
  import { ExternalLink } from '@lucide/svelte'

  let {
    title,
    img = undefined,
    video = undefined,
    iOS = undefined,
    android = undefined,
    web = undefined,
    github = undefined,
    download = undefined,
    children
  } = $props()

  let links = $derived(
    [
      web && { url: web, label: 'Website' },
      iOS && { url: iOS, label: 'iOS' },
      android && { url: android, label: 'Android' },
      github && { url: github, label: 'GitHub' },
      download && { url: download, label: 'Download' }
    ].filter(Boolean)
  )
</script>

<div
  class="flex flex-col md:flex-row items-start gap-6 pb-8 border-b border-slate-300 dark:border-slate-800 group"
>
  {#if img || video}
    <div class="order-2 md:order-1 w-full md:w-1/3 flex-shrink-0">
      {#if img}
        <img
          alt={`${title} Screenshot`}
          src={img}
          class="!mb-0 !mt-0 max-h-80 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 object-cover w-full"
        />
      {/if}

      {#if video}
        <iframe
          class="w-full h-60 rounded-lg shadow-sm"
          src={video}
          {title}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      {/if}
    </div>
  {/if}
  <div class="order-1 md:order-2 w-full flex-grow">
    <h2 id={title} class="!mt-0 !mb-1 text-2xl font-bold">
      <a href={`#${title}`} class="hover:text-primary-600 transition-colors">{title}</a>
    </h2>
    <div class="flex flex-wrap gap-2 !mt-2 !mb-3">
      {#each links as link}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium !no-underline bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors gap-1"
        >
          <span>{link.label}</span>
          <ExternalLink class="w-3 h-3" />
        </a>
      {/each}
    </div>
    <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>
</div>
