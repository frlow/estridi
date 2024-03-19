import { test } from 'vitest'
import { generateAll } from './index.js'
// @ts-ignore
import scraped from '../../output/scraped.json'

test('generate', () => {
  generateAll(scraped)
})
