#!/usr/bin/env node
import { loadFromFigma } from './figma/client.js'
import fs from 'fs'
import { generateAll, Mode } from './generators/index.js'

const filename = 'estridi.json'
if (!fs.existsSync(filename)) throw 'estridi.json not found'
let config: { mode: Mode, token: string, fileId: string } = null as any
try {
  config = JSON.parse(fs.readFileSync(filename, 'utf8'))
} catch (e) {
  throw e
}


export async function main() {
  const data = await loadFromFigma(config)
  generateAll(data, config.mode)
}

main()
  .catch(e => console.log(e))
  .then(() => console.log('Done!'))
