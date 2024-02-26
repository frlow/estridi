import express from 'express'
import cors from 'cors'
import { generateAll } from './generators'
import { generateVitest } from './generators/vitest'

const app = express()
app.use(cors())
app.use(express.json())

const type = process.argv[2]
const dist = process.argv[3]

app.post('/', (req, res) => {
  if (!!type && !!dist) {
    switch (type) {
      case 'vitest':
        generateVitest(dist, req.body)
        break
      default:
        throw `Type ${type} not implemented`
    }
  } else generateAll(req.body)
  res.sendStatus(200)
})

const port = 3000
console.log(`Listening on: http://localhost:${port}/`)
app.listen(3000)
