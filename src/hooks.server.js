/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const adminCookie = event.cookies.get('admin_session')
  const nsfwCookie = event.cookies.get('nsfw_session')

  event.locals.isAdmin = adminCookie === 'active'
  event.locals.isNsfwUnlocked = nsfwCookie === 'active' || event.locals.isAdmin

  return await resolve(event)
}
