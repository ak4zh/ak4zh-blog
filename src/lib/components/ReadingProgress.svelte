<script>
  import { onMount } from 'svelte'

  let progress = $state(0)

  function updateProgress() {
    if (typeof window === 'undefined') return
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    if (totalHeight <= 0) {
      progress = 0
      return
    }
    const currentScroll = window.scrollY
    progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100))
  }

  onMount(() => {
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  })
</script>

<div class="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent" aria-hidden="true">
  <div
    class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
    style="width: {progress}%;"
  ></div>
</div>
