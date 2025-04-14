import type { RoomSnapshot } from '@tldraw/sync-core'
import fs, { writeFileSync } from 'node:fs'
import { migrateRoomSnapshot } from 'editor-common'
import path from 'node:path'
import type { Account, User } from '@auth/core/types'

const rootDir = "config"
fs.mkdirSync(rootDir, {recursive: true})

export const loadSnapshot = (roomId: string) => {
  const FILE = path.join(rootDir, `${roomId}.json`)
  const initialSnapshot: RoomSnapshot = fs.existsSync(FILE)
    ? JSON.parse(fs.readFileSync(FILE, 'utf8'))
    : undefined
  if (initialSnapshot) migrateRoomSnapshot(initialSnapshot)
  return initialSnapshot
}

export const saveSnapshot = (
  roomId: string,
  data: RoomSnapshot,
) => {
  const FILE = path.join(rootDir, `${roomId}.json`)
  writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export const getAccount = (userId: string) => {
  return getAccounts()[userId]
}

export type Accounts = Record<string, Account>
let _accounts: Accounts | undefined = undefined
const accountsFilePath = path.join(rootDir, 'accounts.json')
const getAccounts = (): Accounts => {
  return _accounts || fs.existsSync(accountsFilePath)
    ? JSON.parse(fs.readFileSync(accountsFilePath, 'utf8'))
    : {}
}

export const saveUserId = (user: User, account: Account) => {
  const accounts = getAccounts()
  if (!user.id) throw 'No user id'
  if (!account) throw 'No account'
  accounts[user.id!] = account
  Object.entries(accounts)
    .filter((a) => (a[1].expires_at || 0) < Date.now() / 1000)
    .forEach((a) => delete accounts[a[0]])
  fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2), 'utf-8')
}
