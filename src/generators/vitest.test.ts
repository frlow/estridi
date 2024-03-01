import { describe, expect, test } from 'vitest'
import { generateVitest } from './vitest'
import testdata from './expected/testdata.json'
import * as path from 'node:path'
import * as fs from 'fs'
import { writeAllFiles } from './files'

describe('demo', () => {
  test.skip('regerate', () => {
    const files = generateVitest(path.join(__dirname, 'expected', 'vitest'), testdata).map(f => ({
      ...f,
      overwrite: true
    }))
    writeAllFiles(files)
  })
  test('generate files', () => {
    const generated = generateVitest(path.join('expected', 'vitest'), testdata)
    for (const generatedFile of generated) {
      const reference = fs.readFileSync(path.join(__dirname, generatedFile.file), 'utf8')
      expect(generatedFile.content.trim()).toEqual(reference.trim())
    }
  })
})
