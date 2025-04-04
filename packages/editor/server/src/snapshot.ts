import { RoomSnapshot } from '@tldraw/sync-core'
import fs, { writeFileSync } from 'node:fs'
import { migrateRoomSnapshot } from 'editor-common'
import path from 'node:path'

export const loadSnapshot = (rootDir: string) => {
  const FILE = path.join(rootDir, 's3d.json')
  const initialSnapshot: RoomSnapshot = fs.existsSync(FILE)
    ? JSON.parse(fs.readFileSync(FILE, 'utf8'))
    : undefined
  if (initialSnapshot) migrateRoomSnapshot(initialSnapshot)
  return initialSnapshot
}

export const saveSnapshot = (rootDir: string, data: RoomSnapshot) => {
  const FILE = path.join(rootDir, 's3d.json')
  writeFileSync(FILE, JSON.stringify(data, null, 2))
}
