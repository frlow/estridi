import fs from 'node:fs'
import path from 'node:path'
import { filterScraped, processTldraw } from 'core'

export const getTestCase = async (name: string) => {
  const raw = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', '..', 's3d.json'),
    'utf8',
  )
  const data = JSON.parse(raw)
  const scraped = await processTldraw(data)
  return filterScraped(scraped, name)
}
