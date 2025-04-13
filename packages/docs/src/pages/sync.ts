import type { APIRoute } from 'astro'
import { schema } from 'editor-common'
import { TLSocketRoom } from '@tldraw/sync-core'
import fs from 'node:fs'
import { loadSnapshot, saveSnapshot } from './snapshot.ts'

const rootDir = '.'
fs.mkdirSync(rootDir, { recursive: true })

const roomId = 'singleton'
const initialSnapshot = loadSnapshot(rootDir)

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
    saveSnapshot(rootDir, data)
  },
})

export const GET: APIRoute = (ctx) => {
  if (ctx.request.headers.get('upgrade') === 'websocket') {
    const { response, socket } = ctx.locals.upgradeWebSocket()
    const url = new URL(ctx.request.url)
    const sessionId = url.searchParams.get('sessionId')
    if (sessionId) room.handleSocketConnect({ sessionId, socket })
    return response
  }
  return new Response('Upgrade required', { status: 426 })
}
