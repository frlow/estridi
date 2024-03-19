import * as fs from 'node:fs'
import * as path from 'node:path'
import { GenerationResult } from '../common.js'

export const writeFile = (generationResult: GenerationResult) => {
  fs.mkdirSync(path.parse(generationResult.file).dir, { recursive: true })
  if (generationResult.overwrite || !fs.existsSync(generationResult.file)) {
    console.log(`Writing file: ${generationResult.file}`)
    fs.writeFileSync(generationResult.file, generationResult.content, 'utf8')
  }
}

export const writeAllFiles = (generationResults: GenerationResult[]) => {
  generationResults.forEach(generationResult => writeFile(generationResult))
}
