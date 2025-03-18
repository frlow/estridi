import { describe, expect, test } from 'vitest'
import { filterScraped } from '../../common/filter.js'
import {
  generateHandlesTypeCode,
  getHandlesObjectTypeCode,
} from './handlesTypes.js'
import { autoText, standardTestCase } from '../../test/testCases'
import { Scraped } from '../../scraped'
import { getTestCase } from '../../test/editorTestCases'

describe('generate handles types', () => {
  test('normal case', async () => {
    const scraped: Scraped = [
      {
        id: 'startId',
        type: 'root',
        ...autoText('demo'),
        next: 'serviceCallId',
      },
      {
        id: 'serviceCallId',
        type: 'serviceCall',
        ...autoText('Some service call'),
        next: 'scriptId',
      },
      {
        id: 'scriptId',
        type: 'script',
        variant: 'script',
        ...autoText('Some script'),
        next: 'userActionId',
      },
      {
        id: 'userActionId',
        type: 'userAction',
        ...autoText('some user action'),
        next: 'gatewayId',
        actions: { nextNodeId: 'Click Button' },
        variant: 'userAction',
      },
      {
        id: 'gatewayId',
        type: 'gateway',
        variant: 'gateway',
        ...autoText('Is something true?'),
        options: {},
      },
    ]
    const filtered = filterScraped(scraped, 'demo')
    const handlesTypesText = generateHandlesTypeCode(filtered, 'demo')
    expect(handlesTypesText).toEqual(`export const Gateways = [
  'Is something true'
] as const

export type GatewayKey = (typeof Gateways)[number]
export type GatewayCollection = Partial<Record<GatewayKey, string>>

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection
  state: TState
  page: Page & TPageExtensions
  context: BrowserContext
  tableRow?: Record<string,string>
}

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined
) => Promise<void | (() => Promise<void>)>


const handleServiceCalls = async (args: TestArgs<any, any>)=>{
  // Some service call
  await handles.serviceCall_someServiceCall(args)
}

export type Demo<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
} & DemoRoot<TState, TPageExtensions>

export type HandlesGenerics<U = typeof handles> = U extends Main<infer A,infer B> ? [A, B] : never

export type DemoRoot<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
  serviceCall_someServiceCall: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_clickButton: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_someServiceCall: TestFunction<TState, TPageExtensions>
  test_someScript: TestFunction<TState, TPageExtensions>
}
`)
  })

  test('multiple calls to same serviceCall should only create one type', async () => {
    const scraped: Scraped = [
      {
        id: 'startId',
        type: 'root',
        ...autoText('demo'),
        next: 'serviceCall1Id',
      },
      {
        id: 'serviceCall1Id',
        type: 'serviceCall',
        ...autoText('Some service call'),
        next: 'serviceCall2Id',
      },
      {
        id: 'serviceCall2Id',
        type: 'serviceCall',
        ...autoText('Some service call'),
      },
    ]
    const filtered = filterScraped(scraped, 'demo')
    const handlesTypesText = generateHandlesTypeCode(filtered, 'demo')
    expect(handlesTypesText).toEqual(`export const Gateways = [

] as const

export type GatewayKey = (typeof Gateways)[number]
export type GatewayCollection = Partial<Record<GatewayKey, string>>

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection
  state: TState
  page: Page & TPageExtensions
  context: BrowserContext
  tableRow?: Record<string,string>
}

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined
) => Promise<void | (() => Promise<void>)>


const handleServiceCalls = async (args: TestArgs<any, any>)=>{
  // Some service call
  await handles.serviceCall_someServiceCall(args)
}

export type Demo<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
} & DemoRoot<TState, TPageExtensions>

export type HandlesGenerics<U = typeof handles> = U extends Main<infer A,infer B> ? [A, B] : never

export type DemoRoot<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
  serviceCall_someServiceCall: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_someServiceCall: TestFunction<TState, TPageExtensions>
}
`)
  })
})

describe('handles type object code', () => {
  test('normal case', async () => {
    const filtered = filterScraped(standardTestCase, 'main')
    const typesCode = getHandlesObjectTypeCode('demo', filtered, 'normal')
    expect(typesCode)
      .toEqual(`export type Demo<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
} & DemoRoot<TState, TPageExtensions> & DemoNextPage<TState, TPageExtensions>

export type HandlesGenerics<U = typeof handles> = U extends Main<infer A,infer B> ? [A, B] : never

export type DemoRoot<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
  serviceCall_apiData: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_click: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_apiData: TestFunction<TState, TPageExtensions>
  test_showAnErrorMessage: TestFunction<TState, TPageExtensions>
  test_doSomethingHere: TestFunction<TState, TPageExtensions>
}


export type DemoNextPage<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
  test_goToSomePage: TestFunction<TState, TPageExtensions>
}
`)
  })

  test('test referenced in multiple subflows should only have one type', async () => {
    const testCase = await getTestCase('scriptInMultipleSubflows')
    const filtered = filterScraped(testCase, 'scriptInMultipleSubflows')
    const typesCode = getHandlesObjectTypeCode('demo', filtered, 'normal')
    const matches = Array.from(typesCode.matchAll(/test_myscript/g))
    expect(matches.length).toEqual(1)
  })
})
