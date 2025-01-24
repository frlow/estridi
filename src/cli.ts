#!/usr/bin/env node
import { program } from 'commander'
import { generateEstridiTests, parseRootNames } from './index.js'
import fs from 'node:fs'
import path from 'node:path'

program
  .option('-t, --target <string>')
  .option('-r, --root-name <string>')
  .option('-d, --directory <string>')

program.parse()

const options = program.opts()

const configPath = 'estridi.json'

const run = async () => {
  try {
    if (!fs.existsSync(configPath)) throw 'Could not find estridi.json config file'
    const config: EstridiConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    const roots = await parseRootNames(config, options.rootName)
    for (const rootName of roots) {
      console.log('Root: ', rootName)
      const filesToWrite = await generateEstridiTests({
        target: options.target,
        config,
        rootName: rootName?.trim() || undefined,
      })
      const dir = options.directory || 'tests'
      fs.mkdirSync(dir, { recursive: true })
      for (const fileToWrite of filesToWrite)
        fs.writeFileSync(path.join(dir, fileToWrite.fileName), fileToWrite.code, 'utf8')
    }
    console.log('Done!')
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}

run().then()
