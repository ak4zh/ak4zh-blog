<script>
  import '../app.css'
  import '../prism.css'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { Sun, Moon, Rss } from '@lucide/svelte'
  import GithubIcon from '$lib/components/GithubIcon.svelte'
  import NavLink from '$lib/components/NavLink.svelte'
  import { name } from '$lib/info.js'

  let { children } = $props()

  let prefersLight = $state(false)
  let isMounted = $state(false)

  onMount(() => {
    isMounted = true
    const stored = localStorage.getItem('prefersLight')
    if (stored !== null) {
      prefersLight = JSON.parse(stored)
    } else {
      prefersLight = !window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyTheme()
  })

  function toggleTheme() {
    prefersLight = !prefersLight
    if (browser) {
      localStorage.setItem('prefersLight', JSON.stringify(prefersLight))
      applyTheme()
    }
  }

  function applyTheme() {
    if (!browser) return
    if (prefersLight) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }
</script>

<div class="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-slate-200 dark:selection:bg-slate-800">
  <div class="max-w-4xl mx-auto flex flex-col flex-grow w-full px-4 sm:px-6">
    <header class="flex h-20 justify-between items-center border-b border-slate-200/80 dark:border-slate-800/80">
      <nav class="flex items-center space-x-6 sm:space-x-8">
        <NavLink href="/">{name}</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/projects">Projects</NavLink>
      </nav>

      <div class="flex items-center space-x-3">
        <a
          href="/rss.xml"
          target="_blank"
          aria-label="RSS Feed"
          class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <Rss class="w-5 h-5" />
        </a>
        <a
          href="https://github.com/ak4zh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <GithubIcon class="w-5 h-5" />
        </a>

        {#if isMounted}
          <button
            type="button"
            aria-label="Toggle Dark Mode"
            onclick={toggleTheme}
            class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {#if prefersLight}
              <Moon class="w-5 h-5" />
            {:else}
              <Sun class="w-5 h-5" />
            {/if}
          </button>
        {/if}
      </div>
    </header>

    <main class="mt-6 flex flex-col w-full flex-grow py-4 prose prose-slate prose-sm sm:prose sm:prose-slate sm:prose-lg max-w-none dark:prose-invert">
      {#if children}
        {@render children()}
      {/if}
    </main>

    <footer class="py-8 mt-12 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
      <p>© {new Date().getFullYear()} {name}. Built with SvelteKit 2 & Svelte 5.</p>
      <div class="flex items-center space-x-4">
        <a href="/rss.xml" class="hover:underline">RSS</a>
        <a href="https://github.com/ak4zh" class="hover:underline">GitHub</a>
      </div>
    </footer>
  </div>
</div>
