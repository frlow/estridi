import { beforeAll, describe, expect, test } from 'vitest'
import { Scraped, ScrapedNodeTypes } from '../scraped'
import { expected } from './expected'
import { filterScraped, getFigmaData } from '../test/editorTestCases'

describe(`Load from figma`, () => {
  let figmaData: Scraped
  const runTest = (name: string, type: ScrapedNodeTypes) => async () => {
    const testCase = filterScraped(figmaData, `tc-node-${name}`)
    const targetNode = testCase.find((n) => n.type === type)
    expect(targetNode).toBeTruthy()
    const expectedValue = expected[type]
    expect(expectedValue).toEqual(targetNode)
  }

  beforeAll(async () => {
    figmaData = await getFigmaData()
  })
  describe('common', () => {
    test('connector', runTest('connector', 'connector'))
  })
  describe('front end', () => {
    test('root', runTest('root-fe', 'root'))
    test('message', runTest('message-fe', 'script'))
    test('gateway', runTest('gateway-fe', 'gateway'))
    test('user action', runTest('user-action', 'userAction'))
    test('signal send', runTest('signal-send-fe', 'script'))
    test('service call', runTest('service-call-fe', 'serviceCall'))
    test('subprocess', runTest('subprocess-fe', 'subprocess'))
    test('start', runTest('subprocess-fe', 'start'))
    test('script', runTest('script-fe', 'script'))
    test('loop', runTest('loop-fe', 'loop'))
    test('parallel', runTest('parallel-fe', 'parallel'))
  })
})
