import { describe, test } from 'vitest'
import { testNodeParsing } from './test/nodeTypeTestUtils.js'
import { getDrawIoDocument } from './test/drawIoGenerator.js'
import { processDrawIo } from './drawio.js'


describe('Load from drawio', () => {
  test('test parsing nodes from figma', async () => {
    await testNodeParsing(async (...args) => await processDrawIo(getDrawIoDocument(...args)))
  })
})
