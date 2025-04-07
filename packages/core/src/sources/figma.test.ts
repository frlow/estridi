import { beforeAll, describe, expect, test } from 'vitest'
import { Scraped, ScrapedNodeTypes } from '../scraped'
import { expected } from './expected'
import { filterScraped, getFigmaData } from '../test/editorTestCases'
import { allTests } from './testCommon'

describe(`Load from figma`, () => {
  let figmaData: Scraped
  const runTest =
    (name: string, type: ScrapedNodeTypes, expectedName?: string) =>
    async () => {
      const testCase = filterScraped(figmaData, `tc-node-${name}`)
      const targetNode = testCase.find((n) => n.type === type)
      expect(targetNode).toBeTruthy()
      const expectedValue = expected[expectedName || type]
      expect(expectedValue).toEqual(targetNode)
    }

  beforeAll(async () => {
    figmaData = await getFigmaData()
  })
  allTests(runTest)
})


