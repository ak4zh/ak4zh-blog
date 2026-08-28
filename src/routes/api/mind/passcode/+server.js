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

  const { type, value } = await request.json()

  const key = type === 'admin' ? 'admin_password' : 'nsfw_passcode'

  await db
    .prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
    .bind(key, value)
    .run()

  return json({ success: true, key })
}
