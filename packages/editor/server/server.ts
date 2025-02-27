#!/usr/bin/env node
import { Router, WebSocketExpress } from 'websocket-express'
import fs, { writeFileSync } from 'node:fs'
import { TLSocketRoom } from '@tldraw/sync-core'
import express from 'express'
import { port } from 'editor-common/config'
import path from 'node:path'
import { generateEstridiTests, parseRootNames, processTldraw } from 'core'
import { schema } from 'editor-common'

const app = new WebSocketExpress()
const router = new Router()

const rootDir = process.argv[2] || '.'
fs.mkdirSync(rootDir, { recursive: true })
const TEST_DIR = path.join(rootDir, 'tests')
const FILE = path.join(rootDir, 's3d.json')
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
  async onDataChange() {
    console.log(`Saving changes...`)
    const data = room.getCurrentSnapshot()
    writeFileSync(FILE, JSON.stringify(data, null, 2))
    updateTestTimer(data)
  }
})

// Simple usage:
router.ws('/sync', async (req, res) => {
  const ws = await res.accept()
  room.handleSocketConnect({ sessionId: 'demo', socket: ws })
})

app.use(router)
app.use(express.static(path.join(import.meta.dirname, 'editor')))

// create and run a server:
const server = app.createServer()
console.log(`Server running on http://localhost:${port}`)
server.listen(port)

let timeout: NodeJS.Timeout
const updateTestTimer = (data: any) => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => writeTests(data), 500)
}

const writeTests = async (data: any) => {
  console.log('writing tests')
  try {
    const scraped = await processTldraw(data).catch(e => {
      throw e
    })
    const roots = parseRootNames(scraped, '+')
    if (roots.length===0) {
      console.log('No roots found!')
      return
    }
    for(const rootName of roots){
      const filesToWrite = await generateEstridiTests({
        target: 'playwright',
        scraped,
        rootName
      }).catch(e => {
        throw e
      })
      fs.mkdirSync(TEST_DIR, { recursive: true })
      for (const fileToWrite of filesToWrite)
        fs.writeFileSync(path.join(TEST_DIR, fileToWrite.fileName), fileToWrite.code, 'utf8')
    }

  } catch (e) {
    console.log(e)
  }
}
