import { beforeEach, describe, expect, test } from 'vitest'
import { generateAll } from './index.js'
// @ts-ignore
import scraped from '../../tests/scraped.json'
import * as fs from 'fs'
import path from 'node:path'
import { generatePlaywrightTests } from './playwright.js'
import { loadFromFigma } from '../figma/client.js'

describe('generate', () => {
  beforeEach(() => {
    fs.readdirSync('tests')
      .filter(file => file.endsWith('.ts'))
      .forEach(file => fs.rmSync(path.join('tests', file)))
  })
  test('playwright', () => {
    generateAll(scraped, 'playwright')
  })
  test('vitest', () => {
    generateAll(scraped, 'vitest')
  })
  test('new vs old', async () => {
    const fromScraped = generatePlaywrightTests(scraped, 'dummy', '3085:4043', 'main')
    const config = JSON.parse(fs.readFileSync('estridi.json', 'utf8'))
    const restData = await loadFromFigma(config)
    const fromClient = generatePlaywrightTests(restData, 'dummy', '3085:4043', 'main')
    expect(fromScraped[1].content).toEqual(fromClient[1].content)
    expect(fromScraped[0].content).toEqual(fromClient[0].content)
  })
})
