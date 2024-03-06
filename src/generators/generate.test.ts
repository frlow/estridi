import { describe, expect, test } from 'vitest'
import testdata from './expected/testdata2.json'
import * as path from 'node:path'
import * as fs from 'fs'
import { writeAllFiles } from './files'
import { generateVitest } from './vitest'
import { generatePlaywright } from './playwright'

const formats = {
  vitest: generateVitest,
  playwright: generatePlaywright
}

export const regenerate = false
if (regenerate) {
  for (const [format, generator] of Object.entries(formats)) {
    const files = generator(path.join(__dirname, 'expected', format), testdata).map(f => ({
      ...f,
      overwrite: true
    }))
    writeAllFiles(files)
  }
}


describe('generate tests', () => {
  for (const [format, generator] of Object.entries(formats))
    describe(`${format} tests`, () => {
      const expectedDir = path.join(__dirname, 'expected', format)
      const files = fs.readdirSync(expectedDir)
      const generated = generator(path.join('expected', format), testdata)
      for (const file of files) {
        const referenceContent = fs.readFileSync(path.join(expectedDir, file), 'utf8').trim()
        const generatedContent = generated.find(g => g.file === path.join('expected', format, file))?.content?.trim()
        test(`file: ${file}`, () => {
          expect(generatedContent).toEqual(referenceContent)
        })
      }
    })
})
