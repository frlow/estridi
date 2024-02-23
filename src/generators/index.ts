import { Feature } from '../feature'
import { generateVitest } from './vitest'
import { generateJSON } from './json'
import * as fs from 'node:fs'

export const getFileName = (name: string) =>
  name
    .replace(/ /, '')
    .replace(/:/, '')
    .replace(/\|/, '')
    .replace(/\//, '')
    .toLowerCase()

export const generateAll = (features: Feature[]) => {
  fs.mkdirSync('output', { recursive: true })
  generateJSON(features)
  generateVitest(features)
}
