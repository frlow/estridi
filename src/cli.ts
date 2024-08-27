#!/usr/bin/env node
import fs from 'fs'
import { generateAll } from './generators/index.js'
import { EstridiConfig } from './common.js'
import { process } from './processors/index.js'

const filename = 'estridi.json'
if (!fs.existsSync(filename)) throw 'estridi.json not found'
let config: EstridiConfig = null as any
try {
  config = JSON.parse(fs.readFileSync(filename, 'utf8'))
} catch (e) {
  throw e
}

export async function main() {
  const data = await process(config)
  generateAll(data, config.mode)
}

main()
  .catch(e => console.log(e))
  .then(() => console.log('Done!'))
