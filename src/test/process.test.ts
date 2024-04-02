import { describe, expect, test } from 'vitest'
import fs from 'fs'
import path from 'node:path'
import { loadDocumentFromFigma } from '../figma/client.js'
import { processFigmaDocument } from '../figma/process.js'
import { generateVitestTests } from '../generators/vitest.js'
import { generatePlaywrightTests } from '../generators/playwright.js'
import { writeAllFiles } from '../utils/files.js'
import { generateTableKeys } from '../generators/testKeys.js'
import { scrapedFile } from '../common.js'

const referenceDir = path.join(__dirname, 'reference')

describe('process document', () => {
  test.skipIf(fs.existsSync(referenceDir))('prepare', async () => {
    const token = (await import('../../estridi.json')).default.token
    const document = await loadDocumentFromFigma({
      token, fileId: 'u56o42nzF7HYmZE05wWiUp'
    })
    fs.mkdirSync(referenceDir)
    fs.writeFileSync(path.join(referenceDir, 'testdata.ts'), `export const testDocument = ${JSON.stringify(document)}`, 'utf8')
    const data = processFigmaDocument(document)
    const rootId = data.find(n => n.text.startsWith('root:')).id
    const vitest = generateVitestTests(data, referenceDir, rootId, 'vitest', {})
    const playwright = generatePlaywrightTests(data, referenceDir, rootId, 'playwright', {})
    writeAllFiles([...vitest, ...playwright])
    fs.writeFileSync(path.join(referenceDir, scrapedFile), JSON.stringify(data, null, 2), 'utf8')
  })
  describe('modes', () => {
    test('playwright', async () => {
      const { testDocument } = await import('./reference/testdata.js')
      const data = processFigmaDocument(testDocument)
      const rootId = data.find(n => n.text.startsWith('root:')).id
      const playwright = generatePlaywrightTests(data, referenceDir, rootId, 'playwright', {})
      const expected = ['playwright.spec.ts', 'playwright.handles.ts']
        .map(f => fs.readFileSync(path.join(referenceDir, f), 'utf8'))
      expect(playwright[0].content).toEqual(expected[0])
      expect(playwright[1].content).toEqual(expected[1])
    })

    test('vitest', async () => {
      const { testDocument } = await import('./reference/testdata.js')
      const data = processFigmaDocument(testDocument)
      const rootId = data.find(n => n.text.startsWith('root:')).id
      const playwright = generateVitestTests(data, referenceDir, rootId, 'vitest', {})
      const expected = ['vitest.test.ts', 'vitest.handles.ts']
        .map(f => fs.readFileSync(path.join(referenceDir, f), 'utf8'))
      expect(playwright[0].content).toEqual(expected[0])
      expect(playwright[1].content).toEqual(expected[1])
    })
  })

  test('tables', async () => {
    const { testDocument } = await import('./reference/testdata.js')
    const data = processFigmaDocument(testDocument)
    const tableKeys = generateTableKeys(data)
    expect(tableKeys).toStrictEqual(['  | \'1:601: My Fields\''])
  })
})
