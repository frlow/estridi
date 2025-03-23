import { convertToFigma } from '../converter/figmaConverter'
import { processFigma } from '../sources/figma'
import fs from 'node:fs'
import { convertToTldraw } from '../converter/tldrawConverter'
import { processTldraw } from '../sources/tldraw'
import { Scraped } from '../scraped'
import { expect } from 'vitest'
import { autoText } from '../common/texts'

export { autoText }

export type Parser = {
  converter: (scraped: Scraped) => Promise<any>
  processor: (data: any) => Promise<Scraped>
}

export const parsers: Record<string, Parser> = {
  figma: {
    converter: convertToFigma,
    processor: processFigma
  },
  tldraw: {
    converter: convertToTldraw,
    processor: processTldraw
  }
}

export const testTestCase = async (parser: Parser, testCase: Scraped) => {
  const document = await parser.converter(testCase)
  const scraped = await parser.processor(document)
  for (const testItem of testCase) {
    expect(scraped).toContainEqual(expect.objectContaining(testItem))
  }
}

const baseScript = {
  'id': 'ScriptId',
  'next': 'NextId',
  ...autoText('Some [text]'),
  'type': 'script'
} as const

export const scriptTestCase: Scraped = [{
  ...baseScript,
  variant: 'script'
}]

export const messageTestCase: Scraped = [{
  ...baseScript,
  variant: 'message'
}]

export const signalSendTestCase: Scraped = [{
  ...baseScript,
  variant: 'signalSend'
}]

export const subProcessTestCase: Scraped = [{
  'id': 'SubprocessId',
  'link': 'LinkId',
  'next': 'NextId',
  'tableKey': undefined,
  ...autoText('Next Page'),
  'type': 'subprocess'
}, {
  type: 'start',
  id: 'LinkId',
  ...autoText('Next Page'),
  next: 'OtherId'
}]

export const startTestCase: Scraped = [{
  'id': 'StartId',
  'next': 'NextId',
  ...autoText('Some [text]'),
  'type': 'start'
}]

export const serviceCallTestCase: Scraped = [{
  'id': 'ServiceCallId',
  'next': 'NextId',
  ...autoText('/api/get-data'),
  'type': 'serviceCall'
}]

export const userActionTestCase: Scraped = [{
  'actions': {
    'ActionId': 'Click'
  },
  'id': 'UserActionId',
  'next': 'NextId',
  'type': 'userAction',
  variant: 'userAction',
  ...autoText('')
}]

export const gatewayTestCase: Scraped = [{
  'id': 'GatewayId',
  'options': {
    'NoId': 'no',
    'YesId': 'yes'
  },
  variant: 'gateway',
  ...autoText('Some [text]'),
  'type': 'gateway'
}]

export const rootTestCase: Scraped = [{
  'id': 'StartId',
  'next': 'NextId',
  ...autoText('test'),
  'type': 'root'
}]

export const endTestCase: Scraped = [{
  'id': 'EndId',
  'type': 'end',
  ...autoText('end')
}]

export const otherTestCase: Scraped = [{
  'id': 'OtherId',
  'next': 'NextId',
  ...autoText('Some [text]'),
  'type': 'other'
}]

export const complexStringTestCase: Scraped = [{
  'id': 'ScriptId',
  'next': 'NextId',
  'type': 'script',
  ...autoText(`My, complex
(text) with [more things]`),
  variant: 'script'
}]

export const tableTestCase: Scraped = [{
  'id': 'TableId',
  ...autoText('My Table'),
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
  'type': 'table'
}]

export const subprocessActionsTestCase: Scraped = [{
  'actions': {
    'ActionId': 'Click'
  },
  'id': 'SubprocessId',
  'next': 'NextId',
  'type': 'userAction',
  ...autoText(''),
  variant: 'subprocess'
}]

export const loopTestCase: Scraped = [{
  id: 'StartId',
  type: 'root',
  next: 'LoopId',
  ...autoText('loop')
},
{
  id: 'LoopId',
  type: 'gateway',
  variant: 'loop',
  options: {
    ScriptId: 'any text'
  },
  ...autoText('loop')
},
{
  type: 'script',
  ...autoText('Script'),
  id: 'ScriptId',
  variant: 'script',
  next: 'LoopReturnId'
},
{
  id: 'LoopReturnId',
  type: 'gateway',
  variant: 'gateway',
  ...autoText('loop return'),
  options: {
    LoopId: 'yes'
  }
}]

export const subprocessLoopTestCase: Scraped = [{
  id: 'StartId',
  type: 'root',
  next: 'SubprocessId',
  ...autoText('subloop')
},
{
  id: 'SubprocessId',
  type: 'subprocess',
  ...autoText('Sub Start'),
  link: 'SubprocessRootId'
},
{
  id: 'SubprocessRootId',
  type: 'start',
  next: 'ScriptId',
  ...autoText('Sub Start')
},
{
  id: 'ScriptId',
  type: 'script',
  variant: 'script',
  ...autoText('Do thing'),
  next: 'UserActionId'
},
{
  id: 'UserActionId',
  type: 'userAction',
  ...autoText('action'),
  variant: 'userAction',
  actions: {
    SubprocessLoopId: 'Click'
  }
}, {
  id: 'SubprocessLoopId',
  type: 'subprocess',
  ...autoText('Sub Start'),
  link: 'SubprocessRootId'
}]

export const connectorTestCase: Scraped = [{
  'id': 'ConnectorId',
  'next': 'NextId',
  ...autoText(''),
  'type': 'connector'
}]

export const standardTestCase: Scraped = [
  {
    id: 'RootId',
    type: 'root', ...autoText('main'),
    next: 'ServiceCallId',
    extra: { x: 0, y: 0, width: 80, height: 80 }
  },
  {
    id: 'ServiceCallId',
    type: 'serviceCall', ...autoText('/api/data'),
    next: 'ServiceCallErrorHandlingId',
    extra: { x: 350, y: 0, width: 80, height: 80 }
  },
  {
    id: 'ServiceCallErrorHandlingId',
    type: 'gateway',
    variant: 'gateway', ...autoText('Any errors from api call?'),
    options: {
      ShowErrorId: 'yes',
      ScriptId: 'no'
    }, extra: { x: 700, y: 0, width: 80, height: 80 }
  },
  {
    id: 'ShowErrorId',
    type: 'script',
    variant: 'message', ...autoText('Show an error message'),
    extra: { x: 700, y: -350, width: 80, height: 80 }
  },
  {
    id: 'ScriptId',
    type: 'script',
    variant: 'script', ...autoText('Do something [here]'),
    next: 'UserActionId',
    extra: { x: 1100, y: 0, width: 80, height: 80 }
  },
  {
    id: 'UserActionId', type: 'userAction', variant: 'userAction', ...autoText('action'), next: 'BaseEndId', actions: {
      SubprocessId: 'Click'
    }, extra: { x: 1450, y: 0, width: 400, height: 80 }
  },
  { id: 'BaseEndId', type: 'end', ...autoText('end'), extra: { x: 2050, y: 0, width: 80, height: 80 } },
  {
    id: 'SubprocessId', ...autoText('Next page'),
    type: 'subprocess',
    link: 'NextPageId',
    extra: { x: 1500, y: 240, width: 80, height: 80 }
  },
  {
    id: 'NextPageId',
    type: 'start', ...autoText('Next page'),
    next: 'LinkId',
    extra: { x: 0, y: 500, width: 80, height: 80 }
  },
  {
    id: 'LinkId',
    type: 'script',
    variant: 'signalSend', ...autoText('Go to some page'),
    extra: { x: 350, y: 500, width: 80, height: 80 }
  }
]

export const getFigmaTestData = () => JSON.parse(fs.readFileSync('./src/sources/figma.json', 'utf8'))
