#!/usr/bin/env node
import path from 'node:path'
import { program } from 'commander'
import { startServer } from './server'

program.option('-d, --directory <string>', 'output directory', '.')

program.parse()

const options = program.opts()

const rootDir = options.directory
console.log(`Target directory: ${path.resolve(rootDir)}`)

startServer(rootDir)
