import { describe, expect, test } from 'vitest'
import { generateVitest } from './vitest2'
import testdata from './expected/testdata2.json'
import * as path from 'node:path'
import * as fs from 'fs'
import { writeAllFiles } from './files'
import { freezeTests } from './index'

describe('vitest tests', () => {
  test.skipIf(freezeTests)('regenerate', () => {
    const files = generateVitest(path.join(__dirname, 'expected', 'vitest'), testdata).map(f => ({
      ...f,
      overwrite: true
    }))
    writeAllFiles(files)
  })
  test('generate files', () => {
    const expectedDir = path.join(__dirname, 'expected', 'vitest')
    const files = fs.readdirSync(expectedDir)
    const generated = generateVitest(path.join('expected', 'vitest'), testdata)
    for (const file of files.filter(f => f.includes('.test.ts'))) {
      const referenceContent = fs.readFileSync(path.join(expectedDir, file), 'utf8').trim()
      const generatedContent = generated.find(g => g.file === path.join('expected', 'vitest', file))?.content?.trim()
      expect(generatedContent).toEqual(referenceContent)
    }
  })
})
