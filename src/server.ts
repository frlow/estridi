import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/', (req, res) => {
  const dir = 'features'
  fs.mkdirSync(dir, { recursive: true })
  for (const feature of req.body) {
    const name = feature.name
      .replace(/ /, '')
      .replace(/:/, '')
      .replace(/\|/, '')
      .replace(/\//, '')
      .toLowerCase()
    fs.writeFileSync(path.join(dir, name + '.feature'), feature.feature, 'utf8')
  }
  res.send(200)
})

app.listen(3000)
