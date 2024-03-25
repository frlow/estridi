#!/usr/bin/env node
import express from 'express'
import cors from 'cors'
import { generateAll, modes } from './generators/index.js'
import { fileURLToPath } from 'node:url'
import * as path from 'node:path'
import * as fs from 'fs'
import { Mode } from './generators/index.js'

const app = express()
app.use(cors())
app.use(express.json())

const mode: Mode = process.argv[2] || "playwright" as any
if(!modes.includes(mode as any)) throw `Mode: ${mode} is not supported!`

app.post('/', (req, res) => {
  generateAll(req.body, mode)
  res.sendStatus(200)
})

const port = 3000
// console.log(`Version: ${version}`)
console.log('Manifest located in the following directory:')
console.log(
  import.meta.url ? fileURLToPath(path.parse(import.meta.url).dir) : __dirname
)
console.log(`Listening on: http://localhost:${port}/`)
app.listen(3000)
