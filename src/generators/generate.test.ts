import { test } from 'vitest'
import { generateAll } from './index.js'
// @ts-ignore
import scraped from '../../tests/scraped.json'

test('generate', () => {
  generateAll(scraped)
})
