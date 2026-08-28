import { DEFAULT_DATA } from '#lib/mind-data.js'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, platform }) {
  const isAdmin = locals.isAdmin || false
  const isNsfwUnlocked = locals.isNsfwUnlocked || false

  const db = platform?.env?.DB

  if (!db) {
    // Fallback to static mind-data if D1 binding is not active locally
    return {
      categories: DEFAULT_DATA.categories,
      isAdmin,
      isNsfwUnlocked,
      isD1: false
    }
  }

  try {
    // Query D1 SQLite database
    const { results: rawCategories } = await db
      .prepare('SELECT * FROM categories ORDER BY sort_order ASC')
      .all()

    const { results: rawGroups } = await db
      .prepare('SELECT * FROM groups ORDER BY sort_order ASC')
      .all()

    const { results: rawItems } = await db
      .prepare('SELECT * FROM items ORDER BY sort_order ASC')
      .all()

    const categories = rawCategories.map((cat) => {
      const groups = rawGroups
        .filter((g) => g.category_id === cat.id)
        .map((group) => {
          const items = rawItems
            .filter((i) => i.group_id === group.id)
            .map((item) => ({
              ...item,
              nsfw: Boolean(item.nsfw),
              notes: item.notes_json ? JSON.parse(item.notes_json) : []
            }))
          return { ...group, items }
        })

      return {
        ...cat,
        nsfw: Boolean(cat.nsfw),
        groups
      }
    })

    return {
      categories,
      isAdmin,
      isNsfwUnlocked,
      isD1: true
    }
  } catch (err) {
    console.error('D1 Query Error:', err)
    return {
      categories: DEFAULT_DATA.categories,
      isAdmin,
      isNsfwUnlocked,
      isD1: false
    }
  }
}
