import express from 'express'
import cors from 'cors'
import { generateAll } from './generators'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/', (req, res) => {
  generateAll(req.body)
  res.send(200)
})

app.get('/', (req, res) => {
  res.contentType('application/json')
  res.send(JSON.stringify({ demo: 'sdlfihskduf' }))
})

app.listen(3000)
