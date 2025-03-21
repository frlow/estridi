#!/usr/bin/env node
import { program } from 'commander'
import { EstridiConfig, generateEstridiTests, loadScraped, parseRoots } from 'core'
import fs from 'node:fs'
import path from 'node:path'

program
  .option('-t, --target <string>')
  .option('-r, --root-name <string>')
  .option('-d, --directory <string>')
  .option('-v, --virtual-nodes')

program.parse()

const options = program.opts()

const configPath = 'estridi.json'

const run = async () => {
  try {
    if (!fs.existsSync(configPath)) throw 'Could not find estridi.json config file'
    const config: EstridiConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    const scraped = await loadScraped(config)
    const roots = parseRoots(scraped, options.rootName)
    for (const root of roots) {
      console.log('Root: ', root.raw)
      const fileToWrite = await generateEstridiTests({
        target: options.target || "playwright",
        scraped,
        rootName: root.raw?.trim() || undefined,
        virtualNodes: options.virtualNodes,
      })
      const dir = options.directory || 'tests'
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, fileToWrite.fileName), fileToWrite.code, 'utf8')
    }
    console.log('Done!')
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}

run().then()
