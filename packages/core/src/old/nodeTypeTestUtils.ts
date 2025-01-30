import { expect, test } from 'vitest'
import { GetDocumentFunc } from './documentGenerator.js'

export const testNodeParsing = (getDocument: GetDocumentFunc<Promise<Scraped>>) => {
  test('script', async () => {
    const document = await getDocument('script')
    const script = (document).find(node => node.type === 'script')
    expect(script).toStrictEqual({
      'id': 'ScriptId',
      'next': 'NextId',
      raw: 'Some [text]',
      'text': 'Some text',
      'type': 'script'
    })
  })

  test('message', async () => {
    const message = (await getDocument('message')).find(node => node.type === 'script')
    expect(message).toStrictEqual({
      'id': 'ScriptId',
      'next': 'NextId',
      raw: 'Some [text]',
      'text': 'Some text',
      'type': 'script'
    })
  })


  test('signalSend', async () => {
    const signalSend = (await getDocument('signalSend')).find(node => node.type === 'script')
    expect(signalSend).toStrictEqual({
      'id': 'ScriptId',
      'next': 'NextId',
      raw: 'Some [text]',
      'text': 'Some text',
      'type': 'script'
    })
  })

  test('scriptWithGroupedText', async () => {
    const scriptWithGroupedText = (await getDocument('scriptWithGroupedText')).find(node => node.type === 'script')
    expect(scriptWithGroupedText).toStrictEqual({
      'id': 'ScriptWithGroupedTextId',
      'next': 'NextId',
      'text': 'Grouped Text',
      'raw': 'Grouped Text',
      'type': 'script'
    })
  })

  test('subprocess', async () => {
    const subprocess = (await getDocument('subprocess')).find(node => node.type === 'subprocess')
    expect(subprocess).toStrictEqual({
      'id': 'SubprocessId',
      'link': 'LinkId',
      'next': 'NextId',
      'tableKey': undefined,
      'text': 'Next',
      raw: 'Next',
      'type': 'subprocess'
    })
  })

  test('serviceCall', async () => {
    const serviceCall = (await getDocument('serviceCall')).find(node => node.type === 'serviceCall')
    expect(serviceCall).toStrictEqual({
      'id': 'ServiceCallId',
      'next': 'NextId',
      'text': 'api get data',
      'raw': '/api/get-data',
      'type': 'serviceCall'
    })
  })

  test('userAction', async () => {
    const userAction = (await getDocument('userAction')).find(node => node.type === 'userAction')
    expect(userAction).toStrictEqual({
      'actions': {
        'ActionId': 'Click'
      },
      'id': 'UserActionId',
      'next': 'NextId',
      'text': 'Some text',
      raw: 'Some [text]',
      'type': 'userAction'
    })
  })

  test('gateway', async () => {
    const gateway = (await getDocument('gateway')).find(node => node.type === 'gateway')
    expect(gateway).toStrictEqual({
      'id': 'GatewayId',
      'options': {
        'NoId': 'no',
        'YesId': 'yes'
      },
      variant: 'gateway',
      'text': 'Some text',
      raw: 'Some [text]',
      'type': 'gateway'
    })
  })

  test('start', async () => {
    const start = (await getDocument('start')).find(node => node.type === 'start')
    expect(start).toStrictEqual({
      'id': 'StartId',
      'next': 'NextId',
      'text': 'Some text',
      raw: 'Some [text]',
      'type': 'start'
    })
  })

  test('root', async () => {
    const root = (await getDocument('root')).find(node => node.type === 'start')
    expect(root).toStrictEqual({
      'id': 'StartId',
      'next': 'NextId',
      'text': 'test',
      raw: 'test',
      'type': 'root'
    })
  })


  test('end', async () => {
    const end = (await getDocument('end')).find(node => node.type === 'end')
    expect(end).toStrictEqual({
      'id': 'EndId',
      'text': 'end',
      'type': 'end',
      raw: 'end'
    })
  })

  test('other', async () => {
    const other = (await getDocument('other'))
      .find(node => node.type === 'other' && node.id === 'OtherId')
    expect(other).toStrictEqual({
      'id': 'OtherId',
      'next': 'NextId',
      'text': 'Some text',
      raw: 'Some [text]',
      'type': 'other'
    })
  })

  test('dotted', async () => {
    const dotted = (await getDocument('dotted')).find(node => node.type === 'serviceCall')
    expect(dotted).toStrictEqual({
      'id': 'ServiceCallId',
      'next': undefined,
      'text': 'Service Call',
      raw: 'Service Call',
      'type': 'serviceCall'
    })
  })

  test('complex string', async () => {
    const complexName = (
      await getDocument('script', {
        text: `My, complex
(text) with [more things]`
      })).find(node => node.type === 'script')
    expect(complexName).toStrictEqual({
      'id': 'ScriptId',
      'next': 'NextId',
      'text': 'My complex text with more things',
      'type': 'script',
      raw: `My, complex
(text) with [more things]`
    })
  })

  test('table', async () => {
    const table = (await getDocument('table')).find(node => node.type === 'table')
    expect(table).toStrictEqual({
      'id': 'TableId',
      raw: 'My Table',
      'rows': [
        [
          'My Table',
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
  })

  test('subprocess-actions', async () => {
    const subprocessWithActions = (await getDocument('subprocess-actions')).find(node => node.type === 'userAction')
    expect(subprocessWithActions).toStrictEqual({
      'actions': {
        'ActionId': 'Click'
      },
      'id': 'SubprocessId',
      'next': 'NextId',
      'text': 'External component',
      'raw': 'External component',
      'type': 'userAction'
    })
  })

  test('note', async () => {
    const scriptWithNote = (await getDocument('note')).find(node => node.type === 'start')
    expect(scriptWithNote).toStrictEqual({
      'id': 'StartId',
      'next': 'NextId',
      'raw': 'Some [text]',
      'text': 'Some text',
      'type': 'start',
      note: 'Some comment here'
    })
  })

  test('loop', async () => {
    const loop = (await getDocument('loop')).find(node => node.type === 'gateway' && node.variant === 'loop')
    expect(loop).toStrictEqual({
      'type': 'gateway',
      'id': 'LoopId',
      'text': 'loop',
      'options': {
        'ScriptId': 'Connector Line'
      },
      'variant': 'loop',
      'raw': 'loop'
    })
  })
}
