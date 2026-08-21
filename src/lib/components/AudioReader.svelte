<script>
  import { onMount, onDestroy } from 'svelte'
  import { Volume2, Play, Pause, Square } from '@lucide/svelte'

  let { targetSelector = '.prose', title = '' } = $props()

  let isSupported = $state(false)
  let isPlaying = $state(false)
  let isPaused = $state(false)
  let utterance = $state(null)
  let voices = $state([])
  let selectedVoice = $state(null)

  function loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const available = window.speechSynthesis.getVoices()
    if (!available || available.length === 0) return

    // Filter English voices
    const enVoices = available.filter((v) => v.lang.toLowerCase().startsWith('en'))
    voices = enVoices.length > 0 ? enVoices : available

    // Preferred natural male voices across platforms (Chrome, Edge, macOS/iOS, Windows, Linux)
    const preferredMaleKeywords = [
      'natural',
      'male',
      'guy',
      'ryan',
      'david',
      'daniel',
      'alex',
      'oliver',
      'google us english male',
      'google uk english male'
    ]

    // 1. Search for preferred natural male voice
    let matched = voices.find((v) => {
      const name = v.name.toLowerCase()
      return preferredMaleKeywords.some((keyword) => name.includes(keyword))
    })

    // 2. Fallback to any voice with 'male'
    if (!matched) {
      matched = voices.find((v) => v.name.toLowerCase().includes('male'))
    }

    // 3. Fallback to first available English voice
    if (!matched && voices.length > 0) {
      matched = voices[0]
    }

    selectedVoice = matched || null
  }

  onMount(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      isSupported = true
      loadVoices()

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  })

  onDestroy(() => {
    stop()
  })

  function extractText() {
    if (typeof document === 'undefined') return ''
    const el = document.querySelector(targetSelector)
    if (!el) return title || ''
    return (title ? title + '. ' : '') + el.innerText.trim()
  }

  function play() {
    if (!isSupported) return

    if (isPaused) {
      window.speechSynthesis.resume()
      isPlaying = true
      isPaused = false
      return
    }

    window.speechSynthesis.cancel()

    // Ensure voices are loaded
    if (!selectedVoice) {
      loadVoices()
    }

    const textToRead = extractText()
    if (!textToRead) return

    const newUtterance = new SpeechSynthesisUtterance(textToRead)
    if (selectedVoice) {
      newUtterance.voice = selectedVoice
    }

    // Natural, calm male voice parameters
    newUtterance.rate = 0.92 // Slightly unhurried, human reading speed
    newUtterance.pitch = 0.92 // Warm, natural male pitch

    newUtterance.onend = () => {
      isPlaying = false
      isPaused = false
    }

    newUtterance.onerror = () => {
      isPlaying = false
      isPaused = false
    }

    utterance = newUtterance
    window.speechSynthesis.speak(newUtterance)
    isPlaying = true
    isPaused = false
  }

  function pause() {
    if (!isSupported) return
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause()
      isPlaying = false
      isPaused = true
    }
  }

  function stop() {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    isPlaying = false
    isPaused = false
  }
</script>

{#if isSupported}
  <div class="inline-flex items-center gap-2 font-sans text-xs">
    {#if !isPlaying && !isPaused}
      <button
        type="button"
        onclick={play}
        aria-label="Listen to article"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f0efeb] dark:bg-[#20201e] border border-[#e0dfd8] dark:border-[#2e2e2a] text-[#161615] dark:text-[#f5f5f0] hover:bg-[#e6e5e0] dark:hover:bg-[#2a2a28] transition-colors focus:outline-none"
      >
        <Volume2 class="w-3.5 h-3.5 text-[#706f6a] dark:text-[#94938d]" />
        <span>Listen to article</span>
      </button>
    {:else}
      <div
        class="inline-flex items-center gap-1 bg-[#f0efeb] dark:bg-[#20201e] p-1 rounded-md border border-[#e0dfd8] dark:border-[#2e2e2a]"
      >
        {#if isPlaying}
          <button
            type="button"
            onclick={pause}
            aria-label="Pause reading"
            class="inline-flex items-center gap-1 px-2 py-1 rounded text-[#161615] dark:text-[#f5f5f0] hover:bg-[#e6e5e0] dark:hover:bg-[#2a2a28] transition-colors focus:outline-none"
          >
            <Pause class="w-3.5 h-3.5 text-[#706f6a] dark:text-[#94938d]" />
            <span>Pause</span>
          </button>
        {:else if isPaused}
          <button
            type="button"
            onclick={play}
            aria-label="Resume reading"
            class="inline-flex items-center gap-1 px-2 py-1 rounded text-[#161615] dark:text-[#f5f5f0] hover:bg-[#e6e5e0] dark:hover:bg-[#2a2a28] transition-colors focus:outline-none"
          >
            <Play class="w-3.5 h-3.5 text-[#706f6a] dark:text-[#94938d]" />
            <span>Resume</span>
          </button>
        {/if}

        <button
          type="button"
          onclick={stop}
          aria-label="Stop reading"
          class="p-1 rounded text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] hover:bg-[#e6e5e0] dark:hover:bg-[#2a2a28] transition-colors focus:outline-none"
        >
          <Square class="w-3.5 h-3.5" />
        </button>
      </div>
    {/if}
  </div>
{/if}
