#!/usr/bin/env node
import { Router, WebSocketExpress } from 'websocket-express'
import fs, { writeFileSync } from 'node:fs'
import { TLSocketRoom } from '@tldraw/sync-core'
import { schema } from './schema'
import express from 'express'
import { port } from 'editor-common/config'

const app = new WebSocketExpress()
const router = new Router()

const FILE = 'data.json'
const roomId = 'singleton'

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
    console.log(`Saving changes...`)
    writeFileSync(FILE, JSON.stringify(room.getCurrentSnapshot()))
  }
})

// Simple usage:
router.ws('/sync', async (req, res) => {
  const ws = await res.accept()
  room.handleSocketConnect({ sessionId: 'demo', socket: ws })
})

app.use(router)
app.use(express.static('client'))

// create and run a server:
const server = app.createServer()
console.log(`Server running on http://localhost:${port}`)
server.listen(port)
