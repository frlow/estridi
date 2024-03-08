import * as path from 'node:path'
import { Feature, Scraped } from '../common'
import { writeFile } from './files'

export const generateJSON = (dir: string, scraped: Scraped, features: Feature[]) => {
  writeFile(path.join(dir, 'scraped.json'), JSON.stringify(scraped, null, 2))
  writeFile(path.join(dir, 'features.json'), JSON.stringify(features, null, 2))
}
