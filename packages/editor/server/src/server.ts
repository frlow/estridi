import { Router, WebSocketExpress } from 'websocket-express'
import fs from 'node:fs'
import { loadSnapshot, saveSnapshot } from './snapshot'
import { TLSocketRoom } from '@tldraw/sync-core'
import { schema } from 'editor-common'
import express from 'express'
import path from 'node:path'
import { port } from 'editor-common/config'
import { estridiTargets, generateEstridiTests, processTldraw } from 'core'

export const startServer = (rootDir: string) => {
  const app = new WebSocketExpress()
  const router = new Router()

  fs.mkdirSync(rootDir, { recursive: true })

  const roomId = 'singleton'
  const initialSnapshot = loadSnapshot(rootDir)

  const getRoots = () => {
    const data = room.getCurrentSnapshot() as any
    return data.documents
      .filter((d) => d.state.props?.text?.startsWith('root:'))
      .map((root) => root.state.props.text.replace('root:', ''))
  }

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
      saveSnapshot(rootDir, data)
    },
  })

  router.ws('/sync', async (req, res) => {
    const sessionId = (req.query as any)?.['sessionId'] as string
    const ws = await res.accept()
    room.handleSocketConnect({ sessionId, socket: ws })
  })

  app.get('/api/roots', async (req, res) => {
    const roots = getRoots()
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(roots))
  })

  app.get('/api/targets', async (req, res) => {
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(estridiTargets))
  })

  app.get('/api/code/:root/:target', async (req, res) => {
    const target = req.params.target
    if (!estridiTargets.includes(target as any)) {
      res.sendStatus(404)
      return
    }
    const rootName = req.params.root
    if (!getRoots().includes(rootName)) {
      res.sendStatus(404)
      return
    }
    const data = room.getCurrentSnapshot()
    const scraped = await processTldraw(data)
    const file = await generateEstridiTests({ scraped, rootName, target })
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(file))
  })

  app.use(router)
  app.use(express.static(path.join(import.meta.dirname, 'editor')))

  const index = app.createServer()
  console.log(`Server running on http://localhost:${port}`)
  return index.listen(port)
}
