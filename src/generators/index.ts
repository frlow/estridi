import { Feature } from '../figma/feature'
import { generateVitest } from './vitest'
import { generateJSON } from './json'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { writeAllFiles } from './files'

export type GenerationResult = { file: string, content: string, overwrite: boolean }

export const getFileName = (name: string) =>
  name
    .replace(/ /g, '_')
    .replace(/[:|\/]/g, '')
    .toLowerCase()

export const generateAll = (features: Feature[]) => {
  fs.mkdirSync('output', { recursive: true })
  generateJSON('output', features)
  const filesToWrite: GenerationResult[] = []
  filesToWrite.push(...generateVitest(path.join('output', 'vitest'), features))
  writeAllFiles(filesToWrite)
}
