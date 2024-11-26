import { describe, test } from 'vitest'
import { testNodeParsing } from './test/nodeTypeTestUtils.js'
import { getDrawIoDocument } from './test/drawIoGenerator.js'
import { processDrawIo } from './drawio.js'


describe.skip('Load from drawio', () => {
  test('test parsing nodes from drawio', async () => {
    await testNodeParsing(async (...args) => await processDrawIo(getDrawIoDocument(...args)))
  })
})
