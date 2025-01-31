import { convertToFigma } from '../converter/figmaConverter'
import { processFigma } from '../sources/figma'
import { expect } from 'vitest'
import fs from 'node:fs'
import { sanitizeText } from '../common/texts'

export type Parser = {
  converter: (scraped: Scraped) => Promise<any>
  processor: (data: any) => Promise<Scraped>
}

export const autoText = (raw: string) => ({ raw, text: sanitizeText(raw) })

export const parsers: Record<string, Parser> = {
  figma: {
    converter: convertToFigma,
    processor: processFigma
  }
}

export const testTestCase = async (parser: Parser, testCase: Scraped) => {
  const document = await parser.converter(testCase)
  const scraped = await parser.processor(document)
  for (const testItem of testCase) {
    expect(scraped).toContainEqual(testItem)
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
  ...autoText('Next'),
  'type': 'subprocess'
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
  ...autoText('Some [text]'),
  'type': 'userAction',
  variant: 'userAction'
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
  ...autoText('External component'),
  'type': 'userAction',
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

export const standardTestCase: Scraped = [
  { id: 'RootId', type: 'root', ...autoText('main'), next: 'ServiceCallId' },
  { id: 'ServiceCallId', type: 'serviceCall', ...autoText('/api/data'), next: 'ServiceCallErrorHandlingId' },
  {
    id: 'ServiceCallErrorHandlingId',
    type: 'gateway',
    variant: 'gateway', ...autoText('Any errors from api call?'),
    options: {
      ShowErrorId: 'yes',
      ScriptId: 'no'
    }
  },
  { id: 'ShowErrorId', type: 'script', variant: 'message', ...autoText('Show an error message') },
  { id: 'ScriptId', type: 'script', variant: 'script', ...autoText('Do something [here]'), next: 'UserActionId' },
  {
    id: 'UserActionId', type: 'userAction', variant: 'userAction', ...autoText('action'), next: 'BaseEndId', actions: {
      SubprocessId: 'Click'
    }
  },
  { id: 'BaseEndId', type: 'end', ...autoText('end') },
  { id: 'SubprocessId', ...autoText('Next page'), type: 'subprocess', link: 'NextPageId' },
  { id: 'NextPageId', type: 'start', ...autoText('Next page'), next: 'LinkId' },
  { id: 'LinkId', type: 'script', variant: 'signalSend', ...autoText('Go to some page') }
]

export const getFigmaTestData = () => JSON.parse(fs.readFileSync('./src/sources/figma.json', 'utf8'))
