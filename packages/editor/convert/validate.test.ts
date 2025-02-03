import { describe, test } from 'vitest'
import * as fs from 'node:fs'
import { schema } from 'editor-common'
import { convertToTldraw } from 'core'
import { standardTestCase } from 'core/test-cases'

describe('validate', () => {
  test('validate tldraw example', () => {
    const example = JSON.parse(fs.readFileSync('./test/example.json', 'utf8'))
    for (const doc of example.documents) {
      schema.validateRecord(null, doc.state, 'initialize', null)
    }
  })

  test.skip('validate generated standard case', async () => {
    const document = await convertToTldraw(standardTestCase)
    for (const doc of document.documents) {
      const state = doc.state
      schema.validateRecord(null, state, 'initialize', null)
    }
  })
})
