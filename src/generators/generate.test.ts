import { test } from 'vitest'
import { generateAll } from './index.js'
// @ts-ignore
import scraped from '../../tests/scraped.json'
import * as fs from 'fs'
import path from 'node:path'

test('generate', () => {
  fs.readdirSync('tests')
    .filter(file => file.endsWith('.ts'))
    .forEach(file => fs.rmSync(path.join('tests', file)))
  generateAll(scraped)
})
