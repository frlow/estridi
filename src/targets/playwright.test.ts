import { describe, expect, test } from 'vitest'
import { getFigmaTestData } from '../sources/test/figmaGenerator.js'
import { processFigma } from '../sources/figma.js'
import fs, { writeFileSync } from 'node:fs'
import path from 'node:path'
import { filterScraped } from '../common/filter.js'
import { generatePlaywright } from './playwright.js'

describe('playwright', () => {
  test('generated code should match reference', async () => {
    const scraped = filterScraped(await processFigma(getFigmaTestData()), 'main')
    const code = generatePlaywright('main', scraped)
    const filePath = path.join(__dirname, 'test', 'playwrightReference.ts')
    // fs.writeFileSync(filePath, code, 'utf8')
    const reference = fs.readFileSync(filePath, 'utf8')
    expect(code).toStrictEqual(reference)
  })
})
