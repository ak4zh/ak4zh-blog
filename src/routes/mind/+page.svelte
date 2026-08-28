<script>
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import {
    Search,
    BookOpen,
    ExternalLink,
    Film,
    Globe,
    FileText,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Lock,
    Unlock,
    KeyRound,
    X,
    FolderGit2,
    CheckCircle2,
    Wrench,
    Heart,
    Brain,
    Scale,
    Landmark,
    TrendingUp,
    Atom,
    Flame,
    Gamepad2,
    Plus,
    Trash2,
    Edit3,
    UserCheck,
    LogOut,
    Database,
    Shield
  } from '@lucide/svelte';

  // Server Props
  let { data: serverData } = $props();

  // Derived Reactive State from Server Data
  let categoriesData = $derived(serverData.categories || []);
  let isAdmin = $derived(serverData.isAdmin || false);
  let isUnlocked = $derived(serverData.isNsfwUnlocked || false);

  // UI Filters
  let searchQuery = $state('');
  let selectedCategory = $state('All');
  let selectedType = $state('All');
  let expandedNotes = $state({});

  // Modals State
  let showPasscodeModal = $state(false);
  let showAdminLoginModal = $state(false);
  let showSettingsModal = $state(false);
  let showItemModal = $state(false);

  // Forms Input State
  let passcodeInput = $state('');
  let passcodeError = $state('');

  let adminPasswordInput = $state('');
  let adminLoginError = $state('');

  let newPasscode = $state('');
  let confirmPasscode = $state('');
  let settingsMessage = $state('');

  // Item Form State (for Admin Add/Edit)
  let editingItem = $state(null);
  let itemForm = $state({
    id: '',
    group_id: '',
    name: '',
    href: '',
    description: '',
    icon: '',
    type: 'link',
    status: 'want',
    author: '',
    creator: '',
    year: '',
    media_type: '',
    nsfw: false,
    notesText: ''
  });

  // Category Icon Mapping
  function getCategoryIcon(name) {
    switch (name) {
      case 'Tools & Piracy':
        return Wrench;
      case 'Human Biology & Medicine':
        return Heart;
      case 'Mind & Behaviour':
        return Brain;
      case 'Philosophy & Ethics':
        return Scale;
      case 'Politics & Society':
        return Landmark;
      case 'Economics & Game Theory':
        return TrendingUp;
      case 'Physics & Cosmology':
        return Atom;
      case 'Sex, Intimacy & Relationships':
        return Flame;
      case 'Topics to Explore':
        return Sparkles;
      case 'Board & Card Games':
        return Gamepad2;
      default:
        return FolderGit2;
    }
  }

  // Handle Guest NSFW Unlock via API
  async function handleUnlockSubmit(e) {
    e.preventDefault();
    passcodeError = '';
    try {
      const res = await fetch('/api/auth/unlock-nsfw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showPasscodeModal = false;
        passcodeInput = '';
        await invalidateAll();
      } else {
        passcodeError = result.message || 'Incorrect passcode';
      }
    } catch (err) {
      passcodeError = 'Network error while unlocking';
    }
  }

  // Handle Admin Login via API
  async function handleAdminLoginSubmit(e) {
    e.preventDefault();
    adminLoginError = '';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPasswordInput })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showAdminLoginModal = false;
        adminPasswordInput = '';
        await invalidateAll();
      } else {
        adminLoginError = result.message || 'Invalid admin password';
      }
    } catch (err) {
      adminLoginError = 'Network error during login';
    }
  }

  // Handle Logout
  async function handleAdminLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' });
    await invalidateAll();
  }

  async function handleLockContent() {
    await fetch('/api/auth/unlock-nsfw', { method: 'DELETE' });
    await invalidateAll();
  }

  // Handle Passcode Update (Admin Only)
  async function handleSaveNewPasscode(e) {
    e.preventDefault();
    if (!newPasscode || newPasscode.length < 3) {
      settingsMessage = 'Passcode must be at least 3 characters.';
      return;
    }
    if (newPasscode !== confirmPasscode) {
      settingsMessage = 'Passcodes do not match.';
      return;
    }

    try {
      const res = await fetch('/api/mind/passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'nsfw', value: newPasscode })
      });
      if (res.ok) {
        settingsMessage = 'Guest passcode updated successfully!';
        newPasscode = '';
        confirmPasscode = '';
        setTimeout(() => {
          showSettingsModal = false;
          settingsMessage = '';
        }, 1200);
      } else {
        settingsMessage = 'Failed to update passcode in database.';
      }
    } catch (err) {
      settingsMessage = 'Network error updating passcode.';
    }
  }

  // Admin Item CRUD
  function openAddItemModal(groupId) {
    editingItem = null;
    itemForm = {
      id: '',
      group_id: groupId,
      name: '',
      href: '',
      description: '',
      icon: '',
      type: 'link',
      status: 'want',
      author: '',
      creator: '',
      year: '',
      media_type: '',
      nsfw: false,
      notesText: ''
    };
    showItemModal = true;
  }

  function openEditItemModal(item, groupId) {
    editingItem = item;
    itemForm = {
      ...item,
      group_id: groupId,
      notesText: (item.notes || []).join('\n')
    };
    showItemModal = true;
  }

  async function handleSaveItem(e) {
    e.preventDefault();
    const notes = itemForm.notesText
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);

    const payload = {
      ...itemForm,
      notes
    };

    try {
      const res = await fetch('/api/mind/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showItemModal = false;
        await invalidateAll();
      } else {
        alert('Failed to save item. Make sure you are logged in as Admin.');
      }
    } catch (err) {
      alert('Error saving item');
    }
  }

  async function handleDeleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch('/api/mind/item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId })
      });
      if (res.ok) {
        await invalidateAll();
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      alert('Error deleting item');
    }
  }

  function toggleNote(key) {
    expandedNotes = { ...expandedNotes, [key]: !expandedNotes[key] };
  }

  // Categories List
  let categoryNames = $derived(['All', ...categoriesData.map((c) => c.name)]);

  // Total Statistics
  let stats = $derived.by(() => {
    let total = 0;
    let books = 0;
    let links = 0;
    let media = 0;
    let protectedCount = 0;

    categoriesData.forEach((cat) => {
      const isCatProtected = cat.nsfw;
      cat.groups.forEach((g) => {
        g.items.forEach((item) => {
          total++;
          if (isCatProtected || item.nsfw) protectedCount++;
          if (item.type === 'book') books++;
          else if (item.type === 'media') media++;
          else links++;
        });
      });
    });

    return { total, books, links, media, protectedCount };
  });

  // Filtered Sections
  let filteredSections = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();

    return categoriesData
      .filter((cat) => selectedCategory === 'All' || cat.name === selectedCategory)
      .map((cat) => {
        const isCatProtected = cat.nsfw && !isUnlocked;

        const groups = cat.groups
          .map((group) => {
            const items = group.items.filter((item) => {
              if (item.nsfw && !isUnlocked) return false;
              if (selectedType !== 'All' && item.type !== selectedType) return false;

              if (!query) return true;
              const nameMatch = item.name?.toLowerCase().includes(query);
              const descMatch = item.description?.toLowerCase().includes(query);
              const authorMatch = item.author?.toLowerCase().includes(query) || item.creator?.toLowerCase().includes(query);
              const notesMatch = item.notes?.some((n) => n.toLowerCase().includes(query));

              return nameMatch || descMatch || authorMatch || notesMatch;
            });

            return { ...group, items };
          })
          .filter((group) => group.items.length > 0 || isCatProtected);

        return { ...cat, isCatProtected, groups };
      })
      .filter((cat) => cat.groups.length > 0 || cat.isCatProtected);
  });

  function getStatusBadge(status) {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'reading':
        return { label: 'Reading', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'read':
        return { label: 'Read', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
      case 'want':
        return { label: 'Want', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'watched':
        return { label: 'Watched', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      default:
        return { label: status, bg: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20' };
    }
  }

  function getTypeBadge(type) {
    switch (type) {
      case 'book':
        return { label: 'Book', icon: BookOpen, border: 'border-l-amber-500' };
      case 'media':
        return { label: 'Media', icon: Film, border: 'border-l-purple-500' };
      default:
        return { label: 'Resource', icon: Globe, border: 'border-l-blue-500' };
    }
  }
</script>

<svelte:head>
  <title>Mind — Knowledge Map & Learning Dashboard</title>
  <meta name="description" content="A public dashboard of my learning map, books, courses, documentaries, and tools." />
</svelte:head>

<div class="space-y-10 font-sans">
  <!-- Header & Toolbar -->
  <div class="space-y-6 border-b border-[#e6e5e0] dark:border-[#2a2a28] pb-8">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Personal Knowledge Dashboard</span>
        {#if serverData.isD1}
          <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 normal-case tracking-normal font-sans text-[10px] flex items-center gap-1">
            <Database class="w-3 h-3" /> Cloudflare D1
          </span>
        {/if}
      </div>

      <!-- Auth Controls -->
      <div class="flex items-center space-x-2">
        {#if isAdmin}
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1">
              <UserCheck class="w-3.5 h-3.5" /> Admin Mode
            </span>
            <button
              type="button"
              onclick={() => (showSettingsModal = true)}
              class="p-1.5 rounded-lg bg-[#f0f0ed] dark:bg-[#222220] text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0] border border-[#e6e5e0] dark:border-[#2a2a28] transition-colors"
              title="Passcode Settings"
            >
              <KeyRound class="w-4 h-4" />
            </button>
            <button
              type="button"
              onclick={handleAdminLogout}
              class="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              title="Admin Logout"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        {:else}
          <button
            type="button"
            onclick={() => (showAdminLoginModal = true)}
            class="px-2.5 py-1 rounded-lg text-xs text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] border border-[#e6e5e0] dark:border-[#2a2a28] bg-[#f6f6f4] dark:bg-[#1a1a18] transition-colors"
          >
            Admin Login
          </button>
        {/if}

        <!-- Guest NSFW Unlock Toggle -->
        {#if isUnlocked}
          <button
            type="button"
            onclick={handleLockContent}
            class="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors border border-amber-500/20"
            title="Lock protected topics"
          >
            <Unlock class="w-3.5 h-3.5" />
            <span>Unlocked</span>
          </button>
        {:else}
          <button
            type="button"
            onclick={() => (showPasscodeModal = true)}
            class="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#f0f0ed] dark:bg-[#222220] text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] border border-[#e6e5e0] dark:border-[#2a2a28] transition-colors"
          >
            <Lock class="w-3.5 h-3.5" />
            <span>Protected Content ({stats.protectedCount})</span>
          </button>
        {/if}
      </div>
    </div>

    <div>
      <h1 class="text-3xl font-serif font-bold text-[#161615] dark:text-[#f5f5f0]">
        Mind
      </h1>
      <p class="text-sm text-[#706f6a] dark:text-[#94938d] max-w-2xl mt-1 leading-relaxed">
        A curated, public dashboard of my learning resources, books, courses, documentaries, and tools.
      </p>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
      <div class="p-3 bg-[#f5f5f3] dark:bg-[#1a1a18] rounded-xl border border-[#e6e5e0] dark:border-[#2a2a28] flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Globe class="w-4 h-4" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#161615] dark:text-[#f5f5f0]">{stats.links}</div>
          <div class="text-[11px] text-[#706f6a] dark:text-[#94938d]">Links & Tools</div>
        </div>
      </div>

      <div class="p-3 bg-[#f5f5f3] dark:bg-[#1a1a18] rounded-xl border border-[#e6e5e0] dark:border-[#2a2a28] flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <BookOpen class="w-4 h-4" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#161615] dark:text-[#f5f5f0]">{stats.books}</div>
          <div class="text-[11px] text-[#706f6a] dark:text-[#94938d]">Books</div>
        </div>
      </div>

      <div class="p-3 bg-[#f5f5f3] dark:bg-[#1a1a18] rounded-xl border border-[#e6e5e0] dark:border-[#2a2a28] flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Film class="w-4 h-4" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#161615] dark:text-[#f5f5f0]">{stats.media}</div>
          <div class="text-[11px] text-[#706f6a] dark:text-[#94938d]">Media & Shows</div>
        </div>
      </div>

      <div class="p-3 bg-[#f5f5f3] dark:bg-[#1a1a18] rounded-xl border border-[#e6e5e0] dark:border-[#2a2a28] flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#161615] dark:text-[#f5f5f0]">{stats.total}</div>
          <div class="text-[11px] text-[#706f6a] dark:text-[#94938d]">Total Curated</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Category Cards Overview -->
  <div class="space-y-3">
    <div class="text-xs font-mono font-semibold uppercase tracking-wider text-[#706f6a] dark:text-[#94938d]">
      Browse Topics
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
      {#each categoriesData as cat}
        {@const CatIcon = getCategoryIcon(cat.name)}
        {@const isProtected = cat.nsfw && !isUnlocked}

        <button
          type="button"
          onclick={() => {
            if (isProtected) {
              showPasscodeModal = true;
            } else {
              selectedCategory = selectedCategory === cat.name ? 'All' : cat.name;
            }
          }}
          class={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
            selectedCategory === cat.name
              ? 'bg-[#161615] dark:bg-[#f5f5f0] text-[#fbfbfa] dark:text-[#161615] border-[#161615] dark:border-[#f5f5f0] shadow-sm'
              : isProtected
              ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-[#706f6a] dark:text-[#94938d] hover:border-amber-500/40'
              : 'bg-[#f6f6f4] dark:bg-[#1a1a18] border-[#e6e5e0] dark:border-[#2a2a28] text-[#161615] dark:text-[#f5f5f0] hover:border-[#c5c4bd] dark:hover:border-[#3e3e3b]'
          }`}
        >
          <div class="flex items-center justify-between">
            <CatIcon class="w-4 h-4 opacity-80" />
            {#if isProtected}
              <Lock class="w-3 h-3 text-amber-500" />
            {/if}
          </div>
          <div>
            <div class="text-xs font-medium truncate">{cat.name}</div>
            <div class="text-[10px] opacity-60">
              {#if isProtected}Locked{:else}{cat.groups.reduce((acc, g) => acc + g.items.length, 0)} items{/if}
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Search & Filter Bar -->
  <div class="space-y-3 pt-2">
    <div class="relative">
      <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706f6a] dark:text-[#94938d]" />
      <input
        type="text"
        placeholder="Filter resources by name, author, topic, or keyword..."
        bind:value={searchQuery}
        class="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f3] dark:bg-[#1c1c1a] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-sm text-[#161615] dark:text-[#f5f5f0] placeholder-[#94938d] focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
      />
      {#if searchQuery}
        <button
          type="button"
          onclick={() => (searchQuery = '')}
          class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
        >
          Clear
        </button>
      {/if}
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center space-x-1.5">
        <span class="text-[#706f6a] dark:text-[#94938d] font-medium mr-1">Filter Type:</span>
        {#each ['All', 'link', 'book', 'media'] as t}
          <button
            type="button"
            onclick={() => (selectedType = t)}
            class={`px-2.5 py-1 rounded-lg transition-colors ${
              selectedType === t
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30'
                : 'bg-[#f0f0ed] dark:bg-[#222220] text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0]'
            }`}
          >
            {t === 'link' ? 'Links & Tools' : t === 'book' ? 'Books' : t === 'media' ? 'Media' : 'All Types'}
          </button>
        {/each}
      </div>

      {#if selectedCategory !== 'All'}
        <div class="flex items-center space-x-2 text-[#706f6a] dark:text-[#94938d]">
          <span>Showing: <strong class="text-[#161615] dark:text-[#f5f5f0]">{selectedCategory}</strong></span>
          <button
            type="button"
            onclick={() => (selectedCategory = 'All')}
            class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Show All
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Content Grid Rendering -->
  {#if filteredSections.length === 0}
    <div class="text-center py-16 border border-dashed border-[#e6e5e0] dark:border-[#2a2a28] rounded-2xl space-y-2">
      <p class="text-[#161615] dark:text-[#f5f5f0] font-medium">No resources found</p>
      <p class="text-xs text-[#706f6a] dark:text-[#94938d]">Try adjusting your search query or category filters.</p>
    </div>
  {:else}
    <div class="space-y-12">
      {#each filteredSections as cat (cat.name)}
        {@const CatIcon = getCategoryIcon(cat.name)}
        <div class="space-y-6">
          <!-- Category Header -->
          <div class="flex items-center justify-between border-b border-[#e6e5e0] dark:border-[#2a2a28] pb-3">
            <div class="flex items-center space-x-2">
              <CatIcon class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 class="text-xl font-serif font-bold text-[#161615] dark:text-[#f5f5f0]">
                {cat.name}
              </h2>
            </div>

            {#if cat.isCatProtected}
              <span class="text-xs flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                <Lock class="w-3 h-3" />
                <span>Protected</span>
              </span>
            {/if}
          </div>

          <!-- If Category is Locked -->
          {#if cat.isCatProtected}
            <div class="p-8 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl text-center space-y-3">
              <div class="w-10 h-10 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Lock class="w-5 h-5" />
              </div>
              <div class="space-y-1">
                <h3 class="font-medium text-[#161615] dark:text-[#f5f5f0] text-sm">Protected Topic Locked</h3>
                <p class="text-xs text-[#706f6a] dark:text-[#94938d] max-w-md mx-auto">
                  Enter guest passcode to view items in this section.
                </p>
              </div>
              <button
                type="button"
                onclick={() => (showPasscodeModal = true)}
                class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs transition-colors shadow-sm"
              >
                Unlock Content
              </button>
            </div>
          {:else}
            <div class="space-y-8">
              {#each cat.groups as group (group.name)}
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#706f6a] dark:text-[#94938d]">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{group.name} ({group.items.length})</span>
                    </div>

                    {#if isAdmin}
                      <button
                        type="button"
                        onclick={() => openAddItemModal(group.id)}
                        class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                      >
                        <Plus class="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    {/if}
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {#each group.items as item, idx (`${item.name}-${idx}`)}
                      {@const itemKey = `${cat.name}-${group.name}-${item.name}`}
                      {@const statusBadge = getStatusBadge(item.status)}
                      {@const typeBadge = getTypeBadge(item.type)}
                      {@const TypeIconComp = typeBadge.icon}

                      <div
                        class={`group p-4 bg-[#f6f6f4] dark:bg-[#1a1a18] border border-[#e6e5e0] dark:border-[#2a2a28] border-l-4 ${typeBadge.border} rounded-xl hover:border-[#c5c4bd] dark:hover:border-[#3e3e3b] transition-all flex flex-col justify-between space-y-3`}
                      >
                        <div class="space-y-2">
                          <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center space-x-2 min-w-0">
                              {#if item.icon}
                                <img src={item.icon} alt="" class="w-4 h-4 rounded object-contain flex-shrink-0" />
                              {:else}
                                <TypeIconComp class="w-4 h-4 text-[#706f6a] dark:text-[#94938d] flex-shrink-0" />
                              {/if}

                              {#if item.href}
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="font-medium text-sm text-[#161615] dark:text-[#f5f5f0] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate flex items-center gap-1 group-hover:underline"
                                >
                                  <span>{item.name}</span>
                                  <ExternalLink class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                              {:else}
                                <span class="font-medium text-sm text-[#161615] dark:text-[#f5f5f0] truncate">{item.name}</span>
                              {/if}
                            </div>

                            <div class="flex items-center space-x-1.5 flex-shrink-0">
                              {#if statusBadge}
                                <span class={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
                                  {statusBadge.label}
                                </span>
                              {/if}

                              {#if isAdmin}
                                <button
                                  type="button"
                                  onclick={() => openEditItemModal(item, group.id)}
                                  class="p-1 text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
                                  title="Edit Item"
                                >
                                  <Edit3 class="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onclick={() => handleDeleteItem(item.id)}
                                  class="p-1 text-rose-500/70 hover:text-rose-500"
                                  title="Delete Item"
                                >
                                  <Trash2 class="w-3.5 h-3.5" />
                                </button>
                              {/if}
                            </div>
                          </div>

                          {#if item.author || item.creator}
                            <p class="text-xs text-[#706f6a] dark:text-[#94938d]">
                              {#if item.author}<span class="font-medium">Author:</span> {item.author}{/if}
                              {#if item.creator}<span class="font-medium">Creator:</span> {item.creator}{/if}
                              {#if item.year} ({item.year}){/if}
                            </p>
                          {/if}

                          {#if item.description}
                            <p class="text-xs text-[#52514d] dark:text-[#b4b3ac] leading-relaxed">
                              {item.description}
                            </p>
                          {/if}
                        </div>

                        {#if item.notes && item.notes.length > 0}
                          <div class="pt-3 border-t border-[#e6e5e0]/60 dark:border-[#2a2a28]/60">
                            <button
                              type="button"
                              onclick={() => toggleNote(itemKey)}
                              class="text-[11px] font-medium text-[#706f6a] dark:text-[#94938d] hover:text-[#161615] dark:hover:text-[#f5f5f0] flex items-center space-x-1"
                            >
                              <span>{expandedNotes[itemKey] ? 'Hide Key Takeaways' : `Show Notes (${item.notes.length})`}</span>
                              {#if expandedNotes[itemKey]}
                                <ChevronUp class="w-3 h-3" />
                              {:else}
                                <ChevronDown class="w-3 h-3" />
                              {/if}
                            </button>

                            {#if expandedNotes[itemKey]}
                              <ul class="mt-2 space-y-1.5 pl-3.5 list-disc text-xs text-[#52514d] dark:text-[#b4b3ac]">
                                {#each item.notes as note}
                                  <li class="leading-relaxed">{note}</li>
                                {/each}
                              </ul>
                            {/if}
                          </div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Guest NSFW Passcode Modal -->
{#if showPasscodeModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-[#fbfbfa] dark:bg-[#1c1c1a] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-2xl p-6 space-y-5 shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
          <Lock class="w-4 h-4" />
          <h3 class="font-serif font-bold text-base text-[#161615] dark:text-[#f5f5f0]">Protected Topics</h3>
        </div>
        <button
          type="button"
          onclick={() => {
            showPasscodeModal = false;
            passcodeError = '';
            passcodeInput = '';
          }}
          class="text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <p class="text-xs text-[#706f6a] dark:text-[#94938d] leading-relaxed">
        Enter the guest passcode to unlock protected sensitive topics (Default: <code class="px-1 py-0.5 bg-[#f0f0ed] dark:bg-[#2a2a28] rounded">1234</code>).
      </p>

      <form onsubmit={handleUnlockSubmit} class="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Enter passcode..."
            bind:value={passcodeInput}
            class="w-full px-3.5 py-2.5 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-sm text-[#161615] dark:text-[#f5f5f0] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {#if passcodeError}
            <p class="text-xs text-rose-500 mt-1">{passcodeError}</p>
          {/if}
        </div>

        <button
          type="submit"
          class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          Unlock Content
        </button>
      </form>
    </div>
  </div>
{/if}

<!-- Admin Login Modal -->
{#if showAdminLoginModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-[#fbfbfa] dark:bg-[#1c1c1a] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-2xl p-6 space-y-5 shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
          <Shield class="w-4 h-4" />
          <h3 class="font-serif font-bold text-base text-[#161615] dark:text-[#f5f5f0]">Admin Login</h3>
        </div>
        <button
          type="button"
          onclick={() => {
            showAdminLoginModal = false;
            adminLoginError = '';
            adminPasswordInput = '';
          }}
          class="text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <p class="text-xs text-[#706f6a] dark:text-[#94938d] leading-relaxed">
        Log in as administrator to manage categories, groups, resources, and passcodes. (Default: <code class="px-1 py-0.5 bg-[#f0f0ed] dark:bg-[#2a2a28] rounded">admin</code>).
      </p>

      <form onsubmit={handleAdminLoginSubmit} class="space-y-4">
        <div>
          <label for="admin-password-field" class="block text-xs font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Admin Password</label>
          <input
            id="admin-password-field"
            type="password"
            placeholder="Enter admin password"
            bind:value={adminPasswordInput}
            class="w-full px-3.5 py-2.5 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-sm text-[#161615] dark:text-[#f5f5f0] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {#if adminLoginError}
            <p class="text-xs text-rose-500 mt-1">{adminLoginError}</p>
          {/if}
        </div>

        <button
          type="submit"
          class="w-full py-2.5 rounded-xl bg-[#161615] dark:bg-[#f5f5f0] text-[#fbfbfa] dark:text-[#161615] text-xs font-semibold transition-colors shadow-sm"
        >
          Login as Admin
        </button>
      </form>
    </div>
  </div>
{/if}

<!-- Admin Passcode Settings Modal -->
{#if showSettingsModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-[#fbfbfa] dark:bg-[#1c1c1a] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-2xl p-6 space-y-5 shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
          <KeyRound class="w-4 h-4" />
          <h3 class="font-serif font-bold text-base text-[#161615] dark:text-[#f5f5f0]">Update Guest Passcode</h3>
        </div>
        <button
          type="button"
          onclick={() => {
            showSettingsModal = false;
            settingsMessage = '';
          }}
          class="text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <form onsubmit={handleSaveNewPasscode} class="space-y-4">
        <div class="space-y-3">
          <div>
            <label for="new-passcode-input" class="block text-xs font-medium text-[#706f6a] dark:text-[#94938d] mb-1">New Guest Passcode</label>
            <input
              id="new-passcode-input"
              type="password"
              placeholder="Enter new guest passcode"
              bind:value={newPasscode}
              class="w-full px-3.5 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-sm text-[#161615] dark:text-[#f5f5f0] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label for="confirm-passcode-input" class="block text-xs font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Confirm Guest Passcode</label>
            <input
              id="confirm-passcode-input"
              type="password"
              placeholder="Confirm new guest passcode"
              bind:value={confirmPasscode}
              class="w-full px-3.5 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-sm text-[#161615] dark:text-[#f5f5f0] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {#if settingsMessage}
          <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{settingsMessage}</p>
        {/if}

        <button
          type="submit"
          class="w-full py-2.5 rounded-xl bg-[#161615] dark:bg-[#f5f5f0] text-[#fbfbfa] dark:text-[#161615] text-xs font-semibold transition-colors shadow-sm"
        >
          Save Passcode in D1
        </button>
      </form>
    </div>
  </div>
{/if}

<!-- Admin Add/Edit Item Modal -->
{#if showItemModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
    <div class="w-full max-w-lg bg-[#fbfbfa] dark:bg-[#1c1c1a] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-2xl p-6 space-y-5 shadow-2xl my-8">
      <div class="flex items-center justify-between border-b border-[#e6e5e0] dark:border-[#2a2a28] pb-3">
        <h3 class="font-serif font-bold text-lg text-[#161615] dark:text-[#f5f5f0]">
          {editingItem ? 'Edit Resource Item' : 'Add New Resource Item'}
        </h3>
        <button
          type="button"
          onclick={() => (showItemModal = false)}
          class="text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <form onsubmit={handleSaveItem} class="space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="item-name-input" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Title / Name *</label>
            <input
              id="item-name-input"
              type="text"
              required
              bind:value={itemForm.name}
              class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
            />
          </div>

          <div>
            <label for="item-href-input" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">URL / Link</label>
            <input
              id="item-href-input"
              type="url"
              bind:value={itemForm.href}
              class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
            />
          </div>
        </div>

        <div>
          <label for="item-desc-input" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Description</label>
          <textarea
            id="item-desc-input"
            rows="2"
            bind:value={itemForm.description}
            class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label for="item-type-select" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Type</label>
            <select
              id="item-type-select"
              bind:value={itemForm.type}
              class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
            >
              <option value="link">Link / Tool</option>
              <option value="book">Book</option>
              <option value="media">Media / Show</option>
            </select>
          </div>

          <div>
            <label for="item-status-select" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Status</label>
            <select
              id="item-status-select"
              bind:value={itemForm.status}
              class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
            >
              <option value="want">Want</option>
              <option value="reading">Reading</option>
              <option value="read">Read</option>
              <option value="watched">Watched</option>
            </select>
          </div>

          <div>
            <label for="item-author-input" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Author / Creator</label>
            <input
              id="item-author-input"
              type="text"
              bind:value={itemForm.author}
              class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
            />
          </div>
        </div>

        <div>
          <label for="item-notes-textarea" class="block font-medium text-[#706f6a] dark:text-[#94938d] mb-1">Notes & Key Takeaways (One per line)</label>
          <textarea
            id="item-notes-textarea"
            rows="3"
            bind:value={itemForm.notesText}
            placeholder="Bullet 1...&#10;Bullet 2..."
            class="w-full px-3 py-2 bg-[#f5f5f3] dark:bg-[#242422] border border-[#e6e5e0] dark:border-[#2a2a28] rounded-xl text-[#161615] dark:text-[#f5f5f0]"
          ></textarea>
        </div>

        <div class="flex items-center space-x-2 pt-1">
          <input
            id="item-nsfw-checkbox"
            type="checkbox"
            bind:checked={itemForm.nsfw}
            class="rounded border-[#e6e5e0] text-emerald-600 focus:ring-emerald-500"
          />
          <label for="item-nsfw-checkbox" class="font-medium text-[#706f6a] dark:text-[#94938d]">
            Mark as Protected Sensitive Topic (NSFW)
          </label>
        </div>

        <div class="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            onclick={() => (showItemModal = false)}
            class="px-4 py-2 rounded-xl bg-[#f0f0ed] dark:bg-[#222220] text-[#706f6a] hover:text-[#161615] dark:hover:text-[#f5f5f0]"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
          >
            Save Item to D1
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
