#!/usr/bin/env node
import express from 'express'
import cors from 'cors'
import { generateAll } from './generators'
import { fileURLToPath } from 'node:url'
import * as path from 'node:path'
import { version } from '../package.json'
import fs from 'fs'

const app = express()
app.use(cors())
app.use(express.json())

const defaultConfig = {
  json: 'output',
  vitest: path.join('output', 'vitest'),
  playwright: path.join('output', 'playwright')
}
const configPath = 'estridi.json'
if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8')
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
export type Config = typeof defaultConfig
console.log('Config', config)

app.post('/', (req, res) => {
  generateAll(req.body, config)
  res.sendStatus(200)
})

const port = 3000
console.log(`Version: ${version}`)
console.log('Manifest located in the following directory:')
console.log(
  import.meta.url ? fileURLToPath(path.parse(import.meta.url).dir) : __dirname
)
console.log(`Listening on: http://localhost:${port}/`)
app.listen(3000)
