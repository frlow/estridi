#!/usr/bin/env node

import { program } from 'commander'
import { estridi } from './index'
import fs from 'fs'
import path from 'path'

program
  .option('-t, --target <string>')
  .option('-r, --root-name <string>')
  .option('-i, --import-source <string>')
  .option('-d, --directory <string>')
  .option('-h, --handles-file <string>')

program.parse()
const options = program.opts()
const instance = estridi(options)
instance.writeFile = (content, fileName) => {
  const toWrite =
    typeof content === 'string' ? content : JSON.stringify(content, null, 2)
  const filePath = path.join(options.directory || 'tests', fileName)
  fs.mkdirSync(path.parse(path.resolve(filePath)).dir, { recursive: true })
  fs.writeFileSync(filePath, toWrite, 'utf8')
}
instance.loadConfig = () => JSON.parse(fs.readFileSync('estridi.json', 'utf8'))
instance.fileExists = (fileName: string): boolean =>
  fs.existsSync(path.join(options.directory || 'tests', fileName))

const run = async () => {
  await instance.generate().catch((e) => {
    debugger
  })
}

run().then()
