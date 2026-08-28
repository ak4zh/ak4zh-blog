<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let { allowedHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = $props();
  let activeHeading = $state(null);
  let headings = $state([]);

  function updateHeadings() {
    if (typeof document === 'undefined') return
    const nodes = [
      ...document.querySelectorAll(`article :where(${allowedHeadings.join(', ')}):not(#__sections)`)
    ]
    if (nodes.length === 0) {
      headings = []
      return
    }

    const depths = nodes.map((node) => Number(node.nodeName[1]));
    const minDepth = Math.min(...depths);

    headings = nodes.map((node, idx) => ({ title: node.innerText, depth: depths[idx] - minDepth, node }));

    if (activeHeading === null && headings.length > 0) {
      activeHeading = headings[0]
    }
  }

  function setActiveHeading() {
    if (typeof window === 'undefined' || headings.length === 0) return;

    const scrollY = window.scrollY;
    const visibleIndex = headings.findIndex((heading) => heading.node.offsetTop + heading.node.clientHeight > scrollY) - 1;

    if (visibleIndex >= 0) {
      activeHeading = headings[visibleIndex]
    }

    const pageHeight = document.body.scrollHeight
    const scrollProgress = (scrollY + window.innerHeight) / pageHeight
    if (scrollProgress > 0.999 && headings.length > 0) {
      activeHeading = headings[headings.length - 1]
    }
  }

  onMount(() => {
    updateHeadings()
    setActiveHeading()
    const unsubscribe = page.subscribe(() => {
      setTimeout(() => {
        updateHeadings()
        setActiveHeading()
      }, 50)
    })
    return () => unsubscribe()
  })
</script>

<svelte:window onscroll={setActiveHeading}></svelte:window>

{#if headings.length > 0}
  <h6 id="__sections" class="uppercase text-slate-400 dark:text-slate-500 font-bold text-xs tracking-wider mb-2">
    On this page
  </h6>

  <ul class="mt-2 !pl-0 text-sm space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
    {#each headings as heading}
      <li
        class={`heading list-none !pl-0 transition-colors ${
          activeHeading?.node === heading.node
            ? 'text-slate-900 dark:text-slate-100 font-semibold border-l-2 border-indigo-500 -ml-[13px] pl-2.5'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        }`}
        style={`margin-left: ${heading.depth * 0.75}rem`}
      >
        <a class="!no-underline block py-0.5" href={`#${heading.node.id}`}>{heading.title}</a>
      </li>
    {/each}
  </ul>
{/if}
