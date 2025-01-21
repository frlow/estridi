import { TLSocketRoom } from '@tldraw/sync-core'
import fs, { writeFileSync } from 'node:fs'
import { WebSocketServer } from 'ws'

const FILE = 'data.json'
const roomId = 'singleton'

export const startServer = () => {
  const initialSnapshot = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : undefined

  const room = new TLSocketRoom({
    initialSnapshot,
    onSessionRemoved(room, args) {
      console.log('client disconnected', args.sessionId, roomId)
      if (args.numSessionsRemaining === 0) {
        console.log('closing room', roomId)
        room.close()
      }
    },
    onDataChange() {
      console.log("Saving changes...")
      writeFileSync(FILE, JSON.stringify(room.getCurrentSnapshot()))
    }
  })


  const wss = new WebSocketServer({ port: 8080 })

  wss.on('connection', function connection(socket) {
    room.handleSocketConnect({ sessionId: 'demo', socket })
  })
}

