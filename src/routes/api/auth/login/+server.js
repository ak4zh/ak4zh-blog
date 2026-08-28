import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, platform }) {
  const { password } = await request.json()
  const db = platform?.env?.DB

  let expectedPassword = 'admin'

  if (db) {
    try {
      const setting = await db
        .prepare("SELECT value FROM settings WHERE key = 'admin_password'")
        .first()
      if (setting?.value) {
        expectedPassword = setting.value
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (password === expectedPassword) {
    cookies.set('admin_session', 'active', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    cookies.set('nsfw_session', 'active', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return json({ success: true, isAdmin: true })
  }

  return json({ success: false, message: 'Invalid admin password' }, { status: 401 })
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies }) {
  cookies.delete('admin_session', { path: '/' })
  return json({ success: true, isAdmin: false })
}
