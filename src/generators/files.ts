import * as fs from 'node:fs'
import * as path from 'node:path'
import { GenerationResult } from './index'

export const writeFile = (file: string, content: string) => {
  fs.mkdirSync(path.parse(file).dir, { recursive: true })
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined
  if (prev !== content) {
    console.log(`Writing file: ${file}`)
    fs.writeFileSync(file, content, 'utf8')
  }
}

export const writeAllFiles = (files: GenerationResult[]) => {
  files.forEach(file => {
    if (file.overwrite || !fs.existsSync(file.file)) writeFile(file.file, file.content)
  })
}
