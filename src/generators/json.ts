import { Feature } from '../feature'
import * as fs from 'node:fs'

export const generateJSON = (features: Feature[]) => {
  fs.writeFileSync(
    'output/scenarios.json',
    JSON.stringify(features, null, 2),
    'utf8',
  )
}
