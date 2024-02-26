import { Feature } from '../feature'
import { generateVitest } from './vitest'
import { generateJSON } from './json'
import * as fs from 'node:fs'
import * as path from 'node:path'

export const getFileName = (name: string) =>
  name
    .replace(/ /, '')
    .replace(/:/, '')
    .replace(/\|/, '')
    .replace(/\//, '')
    .toLowerCase()
    .replace(/ /g, '_')

export const generateAll = (features: Feature[]) => {
  fs.mkdirSync('output', { recursive: true })
  generateJSON('output', features)
  generateVitest(path.join('output', 'vitest'), features)
}
