import { describe, expect, test } from 'vitest'
import { getTestCase } from '../test/editorTestCases'
import { ScrapedNodeTypes } from '../scraped'
import { expected } from './expected'
import { allTests } from './testCommon'

const runTest =
  (name: string, type: ScrapedNodeTypes, expectedName?: string) => async () => {
    const testCase = await getTestCase(`tc-node-${name}`)
    const targetNode = testCase.find((n) => n.type === type)
    expect(targetNode).toBeTruthy()
    expect(expected[expectedName || type]).toEqual(targetNode)
  }

describe('Load from tldraw', () => {
  allTests(runTest)
})


