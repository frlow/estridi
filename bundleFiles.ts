import fs from 'node:fs'

fs.mkdirSync('dist/utils', { recursive: true })
const filesToCopy = {
  utils: './src/targets/test/utils.ts'
}

const utils: Record<string, string> = {}

Object.entries(filesToCopy).forEach(([name, filePath]) =>
  utils[name] = Buffer.from(fs.readFileSync(filePath, 'utf8')).toString('base64')
)

fs.writeFileSync('./src/targets/bundledFiles.ts', `export const bundledFiles = ${JSON.stringify(utils, null, 2)}`)

