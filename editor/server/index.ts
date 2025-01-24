import { TLSocketRoom } from '@tldraw/sync-core'
import fs, { writeFileSync } from 'node:fs'
import { WebSocketServer } from 'ws'
import { createTLSchema, defaultBindingSchemas, defaultShapeSchemas } from 'tldraw'
import { CounterShapeProps } from 'editor-common/props'

const FILE = 'data.json'
const roomId = 'singleton'

const schema = createTLSchema({
  shapes: {
    ...defaultShapeSchemas,
    counter: {
      props: CounterShapeProps
    }
  },
  bindings: defaultBindingSchemas
})

let counter = 0
export const startServer = () => {
  const initialSnapshot = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : undefined

  const room = new TLSocketRoom({
    schema,
    initialSnapshot,
    onSessionRemoved(room, args) {
      console.log('client disconnected', args.sessionId, roomId)
      if (args.numSessionsRemaining === 0) {
        console.log('closing room', roomId)
        room.close()
      }
    },
    onDataChange() {
      console.log(`Saving changes... (${counter++})`)
      writeFileSync(FILE, JSON.stringify(room.getCurrentSnapshot()))
    }
  })


  const wss = new WebSocketServer({ port: 8080 })

  wss.on('connection', function connection(socket) {
    room.handleSocketConnect({ sessionId: 'demo', socket })
  })
}

startServer()
