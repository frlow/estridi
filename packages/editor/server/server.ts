#!/usr/bin/env node
import { Router, WebSocketExpress } from 'websocket-express'
import fs, { writeFileSync } from 'node:fs'
import { RoomSnapshot, TLSocketRoom } from '@tldraw/sync-core'
import express from 'express'
import { port } from 'editor-common/config'
import path from 'node:path'
import { generateEstridiTests, parseRoots, processTldraw } from 'core'
import { migrateRoomSnapshot, schema } from 'editor-common'
import { program } from 'commander'

program
  .option('-d, --directory <string>', 'output directory', '.')
  .option('-s, --skip-tests', 'Skip test generation', false)

program.parse()

const options = program.opts()

const rootDir = options.directory
console.log(`Target directory: ${path.resolve(rootDir)}
Output tests: ${!options.skipTests}`)

const app = new WebSocketExpress()
const router = new Router()

fs.mkdirSync(rootDir, { recursive: true })
const TEST_DIR = path.join(rootDir, 'tests')
const FILE = path.join(rootDir, 's3d.json')
const UPLOADS_DIR = path.join(rootDir, 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const roomId = 'singleton'

const initialSnapshot: RoomSnapshot = fs.existsSync(FILE)
  ? JSON.parse(fs.readFileSync(FILE, 'utf8'))
  : undefined
if (initialSnapshot) migrateRoomSnapshot(initialSnapshot)

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
    updateTestTimer(data)
  },

  // Commeting out this since its not correct
  // onError(error) {
  //   console.error('Sync Error:', error)
  // },
})

// Add CORS middleware
app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  next()
})

// Can be used for debugging:
// app.use((req: any, res: any, next: any) => {
//   console.log(`${req.method} ${req.url}`)
//   next()
// })

// Simple usage:
router.ws('/sync', async (req, res) => {
  const sessionId = (req.query as any)?.['sessionId'] as string
  const ws = await res.accept()
  room.handleSocketConnect({ sessionId, socket: ws })
})

// Handle file uploads
app.put('/uploads/:filename', (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename)
    console.log(`Processing upload for file: ${filename}`)
    const filePath = path.join(UPLOADS_DIR, filename)
    const stream = fs.createWriteStream(filePath)

    req.pipe(stream)

    stream.on('finish', () => {
      console.log(`File uploaded successfully: ${filename}`)
      res.status(200).send('File uploaded successfully')
    })

    stream.on('error', (err) => {
      console.error(`Error uploading file: ${err.message}`)
      res.status(500).send('Error uploading file')
    })
  } catch (error) {
    console.error(`Upload error: ${error.message}`)
    res.status(500).send('Error processing upload')
  }
})

// Handle file deletions
app.delete('/uploads/:filename', (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename)
    console.log(`Processing deletion for file: ${filename}`)
    const filePath = path.join(UPLOADS_DIR, filename)

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`File deleted successfully: ${filename}`)
      res.status(200).send('File deleted successfully')
    } else {
      console.log(`File not found: ${filename}`)
      res.status(404).send('File not found')
    }
  } catch (error) {
    console.error(`Delete error: ${error.message}`)
    res.status(500).send('Error deleting file')
  }
})

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR))

app.use(router)
app.use(express.static(path.join(import.meta.dirname, 'editor')))

// create and run a server:
const server = app.createServer()
console.log(`Server running on http://localhost:${port}`)
server.listen(port)

let timeout: NodeJS.Timeout
const updateTestTimer = (data: any) => {
  if (options.skipTests) return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => writeTests(data), 500)
}

const writeTests = async (data: any) => {
  console.log('writing tests')
  try {
    const scraped = await processTldraw(data).catch((e) => {
      throw e
    })
    const roots = parseRoots(scraped, '+')
    if (roots.length === 0) {
      console.log('No roots found!')
      return
    }
    for (const root of roots) {
      const fileToWrite = await generateEstridiTests({
        target: root.extra?.target || 'playwright',
        scraped,
        rootName: root.raw,
      }).catch((e) => {
        throw e
      })
      fs.mkdirSync(TEST_DIR, { recursive: true })
      fs.writeFileSync(
        path.join(TEST_DIR, fileToWrite.fileName),
        fileToWrite.code,
        'utf8',
      )
    }
  } catch (e) {
    console.log(e)
  }
}
