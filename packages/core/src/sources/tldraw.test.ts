import { describe, test } from 'vitest'
import { testNodeParsing } from './test/nodeTypeTestUtils'
import { getTldrawDocument } from './test/tldrawGenerator'
import { processTldraw } from './tldraw'

describe.skip('Load from figma', () => {
  test('test parsing nodes from figma', async () => {
    await testNodeParsing(async (...args) =>
      await processTldraw(getTldrawDocument(...args)))
  })
})
