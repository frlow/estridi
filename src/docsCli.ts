#!/usr/bin/env node
import express from 'express'
import path from 'node:path'

const app = express()
const port = 8080
const basePath = import.meta.dirname
app.use(express.static(path.join(basePath, 'docs')))
console.log(`Docs available at http://localhost:8080`)
app.listen(port)

