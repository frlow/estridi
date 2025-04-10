import type { APIRoute } from 'astro'
import { getSession } from 'auth-astro/server'

export const GET: APIRoute = async ({ params, request }) => {
  const session = await getSession(request)
  return new Response(null, { status: 200 })
}
