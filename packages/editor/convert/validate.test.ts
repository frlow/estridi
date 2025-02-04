import { describe, test } from 'vitest'
import * as fs from 'node:fs'
import { schema } from 'editor-common'
import { convertToTldraw, filterScraped, loadFigmaDocument, processFigma } from 'core'
import { standardTestCase } from 'core/test-cases'

describe('validate', () => {
  test('validate tldraw example', () => {
    const example = JSON.parse(fs.readFileSync('./test/example.json', 'utf8'))
    for (const doc of example.documents) {
      schema.validateRecord(null, doc.state, 'initialize', null)
    }
  })

  test('validate generated standard case', async () => {
    const document = await convertToTldraw(standardTestCase)
    for (const doc of document.documents) {
      const state = doc.state
      schema.validateRecord(null, state, 'initialize', null)
    }
  })

  test.skip('write wip data', async () => {
    const document = await convertToTldraw(standardTestCase)
    fs.writeFileSync('../server/data.json', JSON.stringify(document, null, 2), 'utf8')
  })

  test.skip('import from figma', async () => {
    const config = JSON.parse(fs.readFileSync('estridi.json', 'utf8'))
    const figmaDoc = await loadFigmaDocument(config)
    const scraped = await processFigma(figmaDoc)
    const filtered = filterScraped(scraped, 'main')
    const document = await convertToTldraw(filtered)
    fs.writeFileSync('../server/data.json', JSON.stringify(document, null, 2), 'utf8')
  }, 1000000)
})
