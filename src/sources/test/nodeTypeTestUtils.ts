import { expect } from 'vitest'
import { DocumentType } from './documentGenerator.js'

export const testNodeParsing = async (getDocument: (docType: DocumentType) => Promise<Scraped>) => {
  const script = (await getDocument('script')).find(node => node.type === 'script')
  expect(script).toStrictEqual({
    'id': 'ScriptId',
    'next': 'NextId',
    'text': 'Some text',
    'type': 'script'
  })

  const message = (await getDocument('message')).find(node => node.type === 'script')
  expect(message).toStrictEqual({
    'id': 'ScriptId',
    'next': 'NextId',
    'text': 'Some text',
    'type': 'script'
  })

  const signalSend = (await getDocument('signalSend')).find(node => node.type === 'script')
  expect(signalSend).toStrictEqual({
    'id': 'ScriptId',
    'next': 'NextId',
    'text': 'Some text',
    'type': 'script'
  })

  const subprocess = (await getDocument('subprocess')).find(node => node.type === 'subprocess')
  expect(subprocess).toStrictEqual({
    'id': 'SubprocessId',
    'link': 'LinkId',
    'next': 'NextId',
    'tableKey': undefined,
    'text': 'Next',
    'type': 'subprocess'
  })

  const userAction = (await getDocument('userAction')).find(node => node.type === 'userAction')
  expect(userAction).toStrictEqual({
    'actions': {
      'ActionId': 'Click'
    },
    'id': 'UserActionId',
    'next': 'NextId',
    'text': 'Some text',
    'type': 'userAction'
  })

  const gateway = (await getDocument('gateway')).find(node => node.type === 'gateway')
  expect(gateway).toStrictEqual({
    'id': 'GatewayId',
    'options': {
      'NoId': 'no',
      'YesId': 'yes'
    },
    'text': 'Some text',
    'type': 'gateway'
  })

  const start = (await getDocument('start')).find(node => node.type === 'start')
  expect(start).toStrictEqual({
    'id': 'StartId',
    'isRoot': false,
    'next': 'NextId',
    'text': 'Some text',
    'type': 'start'
  })

  const root = (await getDocument('root')).find(node => node.type === 'start')
  expect(root).toStrictEqual({
    'id': 'StartId',
    'isRoot': true,
    'next': 'NextId',
    'text': 'test',
    'type': 'start'
  })

  const end = (await getDocument('end')).find(node => node.type === 'end')
  expect(end).toStrictEqual({
    'id': 'EndId',
    'text': 'end',
    'type': 'end'
  })

  const other = (await getDocument('other'))
    .find(node => node.type === 'other' && node.id==="OtherId")
  expect(other).toStrictEqual({
    "id": "OtherId",
    "next": "NextId",
    "text": "Some text",
    "type": "other",
  })

  const dotted = (await getDocument('dotted')).find(node => node.type === 'serviceCall')
  expect(dotted).toStrictEqual({
    "id": "ServiceCallId",
    "next": undefined,
    "text": "Service Call",
    "type": "serviceCall",
  })

  const table = (await getDocument('table')).find(node => node.type === 'table')
  expect(table).toStrictEqual({
    'id': 'TableId',
    'rows': [
      [
        '.My Table',
        'Column1',
        'Column2'
      ],
      [
        'Line1',
        'AAAA',
        'BBBB'
      ],
      [
        'Line2',
        'CCCC',
        'DDDD'
      ]
    ],
    'text': 'My Table',
    'type': 'table'
  })
}
