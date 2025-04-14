import type { APIRoute } from 'astro'
import { schema } from 'editor-common'
import { TLSocketRoom } from '@tldraw/sync-core'
import { getAccount, loadSnapshot, saveSnapshot } from './files.ts'
import { getSession } from 'auth-astro/server'

const getRoom = (roomId: string) => {
  if (rooms[roomId]) return rooms[roomId]
  const initialSnapshot = loadSnapshot(roomId)
  const room = new TLSocketRoom({
    // @ts-ignore
    schema,
    initialSnapshot,
    onSessionRemoved(room, args) {
      console.log('client disconnected', args.sessionId, roomId)
      room.closeSession(args.sessionId)
      if (args.numSessionsRemaining === 0) {
        console.log('closing room', roomId)
        room.close()
      }
    },
    async onDataChange() {
      console.log(`Saving changes...`)
      const data = room.getCurrentSnapshot()
      saveSnapshot(roomId, data)
    },
  })
  return room
}

const rooms: Record<string, TLSocketRoom> = {}

export const GET: APIRoute = async (ctx) => {
  const session = await getSession(ctx.request)
  if (!session) return new Response(null, { status: 401 })
  if (ctx.request.headers.get('upgrade') === 'websocket') {
    const { response, socket } = ctx.locals.upgradeWebSocket()
    const url = new URL(ctx.request.url)
    const sessionId = url.searchParams.get('sessionId')
    const account = getAccount(session.user?.id!)
    const room = getRoom(account.providerAccountId)
    if (sessionId) room.handleSocketConnect({ sessionId, socket })
    return response
  }
  return new Response('Upgrade required', { status: 426 })
}
