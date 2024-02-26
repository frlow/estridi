import * as fs from 'node:fs'
import * as path from 'node:path'

export const writeFile = (file: string, content: string) => {
  fs.mkdirSync(path.parse(file).dir, { recursive: true })
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined
  if (prev !== content) {
    console.log(`Writing file: ${file}`)
    fs.writeFileSync(file, content, 'utf8')
  }
}
