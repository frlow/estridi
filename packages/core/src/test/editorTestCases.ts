import fs from 'node:fs'
import { processTldraw } from '../sources/tldraw'
import path from 'node:path'

export const getTestCase = async () => {
  const raw = fs.readFileSync(path.join(__dirname, 's3d.json'), 'utf8')
  const data = JSON.parse(raw)
  return await processTldraw(data) //return filterScraped(scraped, name)
}
