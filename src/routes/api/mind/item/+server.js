import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, platform }) {
  if (!locals.isAdmin) {
    return json({ success: false, message: 'Unauthorized' }, { status: 403 })
  }

  const db = platform?.env?.DB
  if (!db) {
    return json({ success: false, message: 'D1 Database not available' }, { status: 500 })
  }

  const item = await request.json()
  const id = item.id || `item_${Date.now()}`
  const notesJson = JSON.stringify(item.notes || [])

  await db
    .prepare(
      `INSERT OR REPLACE INTO items (
        id, group_id, name, href, description, icon, type, status, author, creator, year, media_type, nsfw, notes_json, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      item.group_id,
      item.name,
      item.href || '',
      item.description || '',
      item.icon || '',
      item.type || 'link',
      item.status || '',
      item.author || '',
      item.creator || '',
      item.year || '',
      item.media_type || '',
      item.nsfw ? 1 : 0,
      notesJson,
      item.sort_order || 99
    )
    .run()

  return json({ success: true, item: { ...item, id } })
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals, platform }) {
  if (!locals.isAdmin) {
    return json({ success: false, message: 'Unauthorized' }, { status: 403 })
  }

  const db = platform?.env?.DB
  if (!db) {
    return json({ success: false, message: 'D1 Database not available' }, { status: 500 })
  }

  const { id } = await request.json()

  await db.prepare('DELETE FROM items WHERE id = ?').bind(id).run()

  return json({ success: true, id })
}
