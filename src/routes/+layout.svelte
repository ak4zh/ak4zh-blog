<script>
  import '../app.css';
  import '../prism.css';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { Sun, Moon } from '@lucide/svelte';
  import { name } from '#lib/info.js';

  let { children } = $props();
  let prefersLight = $state(false);
  let isMounted = $state(false);

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

  let currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-[#fbfbfa] dark:bg-[#161615] text-[#242420] dark:text-[#e6e5e0] transition-colors duration-200">
  <div class="max-w-2xl mx-auto px-6 py-10 flex flex-col min-h-screen">
    <!-- Minimal Header -->

    <header
      class="flex items-center justify-between pb-14 font-sans"
    >
      <a
        href="/"
        class="text-xl font-serif font-bold tracking-tight text-[#161615] dark:text-[#f5f5f0] hover:opacity-80 transition-opacity"
      >{name}</a>

      <div
        class="flex items-center space-x-6 text-sm font-medium"
      >
        <a
          href="/"
          class={`transition-colors ${currentPath === '/' ? 'text-[#161615] dark:text-[#f5f5f0] underline underline-offset-4 font-semibold' : 'text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0]'}`}
        >
          home
        </a>
        <a
          href="/blog"
          class={`transition-colors ${currentPath.startsWith('/blog') ? 'text-[#161615] dark:text-[#f5f5f0] underline underline-offset-4 font-semibold' : 'text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0]'}`}
        >
          blog
        </a>

        {#if isMounted}
          <button
            type="button"
            aria-label="Toggle theme"
            onclick={toggleTheme}
            class="text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] transition-colors p-1"
          >
            {#if prefersLight}
              <Moon class="w-4 h-4" />
            {:else}
              <Sun class="w-4 h-4" />
            {/if}
          </button>
        {/if}
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="flex-grow">
      {#if children}
        {@render children()}
      {/if}
    </main>

    <!-- Minimal Footer -->
    <footer class="pt-16 pb-8 border-t border-[#e6e5e0] dark:border-[#2a2a28] mt-20 text-xs font-sans text-[#706f6a] dark:text-[#94938d] flex justify-between items-center">
      <p>© {new Date().getFullYear()} {name}</p>
      <div class="flex items-center space-x-5">
        <a href="/rss.xml" target="_blank" class="hover:underline">rss</a>
        <a href="https://github.com/ak4zh" target="_blank" rel="noopener noreferrer" class="hover:underline">github</a>
      </div>
    </footer>
  </div>
</div>
