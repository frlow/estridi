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
  // describe(`Load from tldraw`, () => {
  //   describe('common', () => {
  //     test('connector', runTest('connector', 'connector'))
  //   })
  //   describe('front end', () => {
  //     test('root', runTest('root-fe', 'root'))
  //     test('message', runTest('message-fe', 'script'))
  //     test('gateway', runTest('gateway-fe', 'gateway'))
  //     test('user action', runTest('user-action', 'userAction'))
  //     test('signal send', runTest('signal-send-fe', 'script'))
  //     test('service call', runTest('service-call-fe', 'serviceCall'))
  //     test('subprocess', runTest('subprocess-fe', 'subprocess'))
  //     test('start', runTest('subprocess-fe', 'start'))
  //     test('script', runTest('script-fe', 'script'))
  //     test('loop', runTest('loop-fe', 'loop'))
  //     test('parallel', runTest('parallel-fe', 'parallel'))
  //   })
  // })
})


