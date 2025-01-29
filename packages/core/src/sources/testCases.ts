import { convertToFigma } from '../converter/figmaConverter'
import { processFigma } from './figma'
import { expect } from 'vitest'

export type Parser = {
  converter: (scraped: Scraped) => Promise<any>
  processor: (data: any) => Promise<Scraped>
}

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
  raw: 'Some [text]',
  'text': 'Some text',
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
  'text': 'Next',
  raw: 'Next',
  'type': 'subprocess'
}]

export const startTestCase: Scraped = [{
  'id': 'StartId',
  'isRoot': false,
  'next': 'NextId',
  'text': 'Some text',
  raw: 'Some [text]',
  'type': 'start'
}]

export const serviceCallTestCase: Scraped = [{
  'id': 'ServiceCallId',
  'next': 'NextId',
  'text': 'api get data',
  'raw': '/api/get-data',
  'type': 'serviceCall'
}]

export const userActionTestCase: Scraped = [{
  'actions': {
    'ActionId': 'Click'
  },
  'id': 'UserActionId',
  'next': 'NextId',
  'text': 'Some text',
  raw: 'Some [text]',
  'type': 'userAction'
}]
