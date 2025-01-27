import { describe } from 'vitest'
import { testNodeParsing } from './test/nodeTypeTestUtils'
import { getTldrawDocument } from './test/tldrawGenerator'
import { processTldraw } from './tldraw'

const disableTldraw = true

describe.skipIf(disableTldraw)('Load from tldraw', () => {
  describe('test parsing nodes from tldraw', async () => {
    testNodeParsing(async (...args) => {
        const document = getTldrawDocument(...args)
        return await processTldraw(document)
      }
    )
  })
})
