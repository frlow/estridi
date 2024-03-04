import * as path from 'node:path'
import { Scraped } from '../common'
import { writeFile } from './files'

export const generateJSON = (dir: string, scraped: Scraped) => {
  writeFile(path.join(dir, 'scraped.json'), JSON.stringify(scraped, null, 2))
}
