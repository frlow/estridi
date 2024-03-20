import { test } from 'vitest'
import { generateAll } from './index.js'
// @ts-ignore
import scraped from '../../tests/scraped.json'
import * as fs from 'fs'
import path from 'node:path'
import { findAllPaths } from '../utils/paths.js'

test('generate', () => {
  fs.readdirSync('tests')
    .filter(file => file.endsWith('.ts'))
    .forEach(file => fs.rmSync(path.join('tests', file)))
  generateAll(scraped)
  // const roots = scraped.filter(node => node.type === 'start' && node.text?.startsWith('root:'))
  // for (const root of roots) {
  //   const allPaths = findAllPaths(scraped, root.id)
  //   debugger
  // }
})
