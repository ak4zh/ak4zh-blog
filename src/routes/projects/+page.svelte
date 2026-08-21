<script>
  import Project from '$lib/components/Project.svelte'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import { name } from '$lib/info.js'
</script>

<svelte:head>
  <title>{name} | Projects</title>
  <meta name="description" content="Selected open source projects and web applications built by {name}." />
</svelte:head>

<div class="w-full max-w-4xl mx-auto py-2">
  <div class="border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white !my-0">Projects</h1>
    <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Stuff I've built, experimented with, and launched.</p>
  </div>

  <div class="space-y-10">
    <Project title="bummer" img="/bummer.png" web="https://bummer.vercel.app">
      <p>
        One way to make your career regrets “less fearsome” is by talking to people about them. Bummer lets you create a résumé of your failures and share it in the open.
      </p>
    </Project>

    <Project title="Stooge" img="/stooge.png" web="https://stooge-ak4zh.vercel.app">
      <p>
        We all love comics. Comics are an amazing tool for storytelling, but I cannot even draw a perfect circle. So I created Stooge, a comic creator app to help educators and storytellers make comics without needing to draw.
      </p>
    </Project>

    <Project title="ConfluxBot" img="/confluxbot.svg" web="https://confluxbot.com">
      <p>
        ConfluxBot merges all your social media accounts into one place. In the ConfluxBot dashboard, you can connect multiple accounts like Telegram, Discord, Reddit, and personal blogs to create synced, automated cross-platform posts.
      </p>
    </Project>

    <Project
      title="Statera"
      web="http://statera.in"
      img="/statera.png"
      github="https://github.com/ak4zh/statera"
    >
      <p>
        An open source web app for accounting built while experimenting with SvelteKit.
      </p>
    </Project>

    <Project title="Cuddy" img="/cuddy.png" web="https://cuddy.me">
      <p>
        A free web app to make beautiful landing pages in minutes.
      </p>
    </Project>

    <Project
      title="MijnBedrijfsWagenLease"
      img="/mijnbedrijfswagenlease.png"
      web="https://mijnbedrijfswagenlease.nl"
    >
      <p>
        A platform to search for vehicles available for lease, built for a Netherlands-based business.
      </p>
    </Project>

    <Project title="WAFAcademy" img="/wafacademy.png" web="https://wafa.academy/catalogue/">
      <p>
        An e-commerce website built for a German company cataloguing products and courses.
      </p>
    </Project>

    <div class="flex justify-center sm:justify-end pt-4 pb-8">
      <ButtonLink href="https://github.com/ak4zh" rel="external" target="_blank">
        Check out the rest on GitHub
      </ButtonLink>
    </div>
  </div>
</div>
