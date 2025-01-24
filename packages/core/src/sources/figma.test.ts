import { describe, expect, test } from 'vitest'
import { processFigma } from './figma.js'
import { getFigmaDocument, getFigmaTestData } from './test/figmaGenerator.js'
import { testNodeParsing } from './test/nodeTypeTestUtils.js'

describe('Load from figma', () => {
  test('process figma document', async () => {
    const data = getFigmaTestData()
    const scraped = await processFigma(data)
    expect(scraped.length).toBeGreaterThan(3500)
  })

  test('test parsing nodes from figma', async () => {
    await testNodeParsing(async (...args) => await processFigma(getFigmaDocument(...args)))
  })
})
