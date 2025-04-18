import { ScrapedNodeTypes } from '../scraped'
import { describe, test } from 'vitest'

export const allTests = (
  runTest: (
    name: string,
    type: ScrapedNodeTypes,
    expectedName?: string,
  ) => () => Promise<void>,
) => {
  describe('common', () => {
    test('connector', runTest('connector', 'connector'))
    test('page', runTest('root-fe', 'page'))
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
    test(
      'multiple out',
      runTest('script-multiple-out-fe', 'script', 'scriptMultipleOut'),
    )
  })
}
