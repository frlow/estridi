import { describe, test } from 'vitest'
import {
  complexStringTestCase,
  endTestCase,
  gatewayTestCase,
  loopTestCase,
  messageTestCase,
  otherTestCase,
  parsers,
  rootTestCase,
  scriptTestCase,
  serviceCallTestCase,
  signalSendTestCase,
  startTestCase,
  subprocessActionsTestCase,
  subProcessTestCase,
  tableTestCase,
  testTestCase,
  userActionTestCase
} from './testCases'

const parserName: keyof typeof parsers = 'figma'
const parser = parsers[parserName]


describe(`Load from ${parserName}`, () => {
  describe('test cases', () => {
    test('message', async () => await testTestCase(parser, messageTestCase))
    test('script', async () => await testTestCase(parser, scriptTestCase))
    test('signalSend', async () => await testTestCase(parser, signalSendTestCase))
    test('subprocess', async () => await testTestCase(parser, subProcessTestCase))
    test('serviceCall', async () => await testTestCase(parser, serviceCallTestCase))
    test('userAction', async () => await testTestCase(parser, userActionTestCase))
    test('gateway', async () => await testTestCase(parser, gatewayTestCase))
    test('start', async () => await testTestCase(parser, startTestCase))
    test('root', async () => await testTestCase(parser, rootTestCase))
    test('end', async () => await testTestCase(parser, endTestCase))
    test('other', async () => await testTestCase(parser, otherTestCase))
    test('complex string', async () => await testTestCase(parser, complexStringTestCase))
    test('table', async () => await testTestCase(parser, tableTestCase))
    test('subprocess-actions', async () => await testTestCase(parser, subprocessActionsTestCase))
    test('loop', async () => await testTestCase(parser, loopTestCase))
  })
})


//     test('scriptWithGroupedText', async () => {
//       const scriptWithGroupedText = (await getDocument('scriptWithGroupedText')).find(node => node.type === 'script')
//       expect(scriptWithGroupedText).toStrictEqual({
//         'id': 'ScriptWithGroupedTextId',
//         'next': 'NextId',
//         'text': 'Grouped Text',
//         'raw': 'Grouped Text',
//         'type': 'script'
//       })
//     })


//     test('dotted', async () => {
//       const dotted = (await getDocument('dotted')).find(node => node.type === 'serviceCall')
//       expect(dotted).toStrictEqual({
//         'id': 'ServiceCallId',
//         'next': undefined,
//         'text': 'Service Call',
//         raw: 'Service Call',
//         'type': 'serviceCall'
//       })
//     })

