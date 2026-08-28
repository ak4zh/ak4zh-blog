import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, platform }) {
  const { passcode } = await request.json()
  const db = platform?.env?.DB

  let expectedPasscode = '1234'

  if (db) {
    try {
      const setting = await db
        .prepare("SELECT value FROM settings WHERE key = 'nsfw_passcode'")
        .first()
      if (setting?.value) {
        expectedPasscode = setting.value
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (passcode === expectedPasscode) {
    cookies.set('nsfw_session', 'active', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return json({ success: true, isNsfwUnlocked: true })
  }

  return json({ success: false, message: 'Invalid passcode' }, { status: 401 })
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies }) {
  cookies.delete('nsfw_session', { path: '/' })
  return json({ success: true, isNsfwUnlocked: false })
}
