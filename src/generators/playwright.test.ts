import { describe, expect, test } from 'vitest'
import testdata from './expected/testdata.json'
import * as path from 'node:path'
import * as fs from 'fs'
import { writeAllFiles } from './files'
import { freezeTests } from './index'
import { generatePlaywright } from './playwright'

describe('playwright tests', () => {
  test.skipIf(freezeTests)('regenerate', () => {
    const files = generatePlaywright(path.join(__dirname, 'expected', 'playwright'), testdata).map(f => ({
      ...f,
      overwrite: true
    }))
    writeAllFiles(files)
  })
  test('generate files', () => {
    const generated = generatePlaywright(path.join('expected', 'playwright'), testdata)
    for (const generatedFile of generated) {
      const reference = fs.readFileSync(path.join(__dirname, generatedFile.file), 'utf8')
      expect(generatedFile.content.trim()).toEqual(reference.trim())
    }
  })
})
