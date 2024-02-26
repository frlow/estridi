import { Feature } from '../feature'
import * as fs from 'node:fs'
import * as path from 'node:path'

export const generateJSON = (dir: string, features: Feature[]) => {
  fs.writeFileSync(
    path.join(dir, 'scenarios.json'),
    JSON.stringify(features, null, 2),
    'utf8',
  )
}
