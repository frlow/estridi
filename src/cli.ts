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


const run = async () => {
  try {
    const config = JSON.parse(fs.readFileSync('estridi.json', 'utf8'))
    const roots = await parseRootNames(config, options.rootName)
    for (const rootName of roots) {
      console.log('Root: ', rootName)
      const { code, fileName } = await generateEstridiTests({
        target: options.target,
        config,
        rootName: rootName?.trim() || undefined
      })
      const dir = options.directory || 'tests'
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, fileName), code, 'utf8')
    }
    console.log('Done!')
  } catch (e) {
    console.error(e)
    process.exit(0)
  }
}

run().then()
