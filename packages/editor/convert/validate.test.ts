import { describe, expect, test } from 'vitest'
import * as fs from 'node:fs'
import { schema } from 'editor-common'
import { convertToTldraw, filterScraped, loadFigmaDocument, processFigma, processTldraw } from 'core'
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

  test.skip('example of broken', () => {
    const example = JSON.parse(fs.readFileSync('./test/brokenExample.json', 'utf8'))
    const a = 3
    const b = 9
    expect(example.documents[a]).toStrictEqual(example.documents[b])
    debugger
  })

  test.skip('two node example', async () => {
    const example = JSON.parse(fs.readFileSync('./test/twoNode.json', 'utf8'))
    const scraped = await processTldraw(example)
    const filtered = filterScraped(scraped, 'main')
    const document = await convertToTldraw(filtered)
    const trimDocument = (doc: any) => {
      delete doc.lastChangedClock
      delete doc.state.parentId
      delete doc.state.index
      delete doc.state.id
    }
    document.documents.forEach(doc => trimDocument(doc))
    for (const exampleDoc of example.documents.filter(d => !['page', 'document'].includes(d.state.typeName))) {
      trimDocument(exampleDoc)
      expect(document.documents).toContainEqual(expect.objectContaining(exampleDoc))
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
