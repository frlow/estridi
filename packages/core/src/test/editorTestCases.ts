import fs from 'node:fs'
import { processTldraw } from '../sources/tldraw'
import path from 'node:path'

export const getTestCase = async (name: string) => {
  const raw = fs.readFileSync(path.join(__dirname, 's3d.json'), 'utf8')
  const data = JSON.parse(raw)
  const scraped = await processTldraw(data)
  return scraped //return filterScraped(scraped, name)
}
