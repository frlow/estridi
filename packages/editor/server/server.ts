#!/usr/bin/env node
import { Router, WebSocketExpress } from 'websocket-express'
import fs, { writeFileSync } from 'node:fs'
import { RoomSnapshot, TLSocketRoom } from '@tldraw/sync-core'
import express from 'express'
import { port } from 'editor-common/config'
import path from 'node:path'
import { migrateRoomSnapshot, schema } from 'editor-common'
import { program } from 'commander'

program.option('-d, --directory <string>', 'output directory', '.')

program.parse()

const options = program.opts()

const rootDir = options.directory
console.log(`Target directory: ${path.resolve(rootDir)}`)

const app = new WebSocketExpress()
const router = new Router()

fs.mkdirSync(rootDir, { recursive: true })
const FILE = path.join(rootDir, 's3d.json')
const roomId = 'singleton'

const initialSnapshot: RoomSnapshot = fs.existsSync(FILE)
  ? JSON.parse(fs.readFileSync(FILE, 'utf8'))
  : undefined
if (initialSnapshot) migrateRoomSnapshot(initialSnapshot)

// let timeout: NodeJS.Timeout
// const updateTestTimer = (data: any) => {
//   if (timeout) clearTimeout(timeout)
//   timeout = setTimeout(() => writeTests(data), 500)
// }

const room = new TLSocketRoom({
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
    writeFileSync(FILE, JSON.stringify(data, null, 2))
    // updateTestTimer(data)
  },
})

// Simple usage:
router.ws('/sync', async (req, res) => {
  const sessionId = (req.query as any)?.['sessionId'] as string
  const ws = await res.accept()
  room.handleSocketConnect({ sessionId, socket: ws })
})

app.use(router)
app.use(express.static(path.join(import.meta.dirname, 'editor')))

// create and run a server:
const server = app.createServer()
console.log(`Server running on http://localhost:${port}`)
server.listen(port)

// const writeTests = async (data: any) => {
//   console.log('writing tests')
//   try {
//     const scraped = await processTldraw(data).catch((e) => {
//       throw e
//     })
//     const roots = parseRoots(scraped, '+')
//     if (roots.length === 0) {
//       console.log('No roots found!')
//       return
//     }
//     for (const root of roots) {
//       if (!root.extra?.target || root.extra.target === 'none') continue
//       const fileToWrite = await generateEstridiTests({
//         target: root.extra?.target,
//         scraped,
//         rootName: root.raw,
//       }).catch((e) => {
//         throw e
//       })
//       const testDir = path.join(rootDir, root.extra?.testDir || 'tests')
//       fs.mkdirSync(testDir, { recursive: true })
//       fs.writeFileSync(
//         path.join(testDir, fileToWrite.fileName),
//         fileToWrite.code,
//         'utf8',
//       )
//     }
//   } catch (e) {
//     console.log(e)
//   }
// }
