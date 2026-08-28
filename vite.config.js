import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      extensions: ['.svelte', ...mdsvexConfig.extensions],
      preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
      adapter: adapter()
    })
  ],
  server: { fs: { allow: ['./'] } }
})
