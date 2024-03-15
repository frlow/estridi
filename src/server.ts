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

app.post('/', (req, res) => {
  generateAll(req.body)
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
