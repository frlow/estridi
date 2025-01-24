import { describe, expect, test } from 'vitest'
import { processFigma } from '../../sources/figma.js'
import { figmaConnectorNode, figmaNodes, getBaseFigmaNode } from '../../sources/test/figmaGenerator.js'
import { filterScraped } from '../../common/filter.js'
import { generateHandlesTypeCode } from './handlesTypes.js'

describe('generate handles types', () => {
  test('normal case', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: 'startId' }),
        ...figmaConnectorNode({ text: 'root:demo', start: 'startId', end: 'serviceCallId' }),
        figmaNodes.serviceCall({ id: 'serviceCallId', text: 'Some service call' }),
        ...figmaConnectorNode({ start: 'serviceCallId', end: 'scriptId' }),
        figmaNodes.script({ id: 'scriptId', type: 'script', text: 'Some script' }),
        ...figmaConnectorNode({ start: 'scriptId', end: 'userActionId' }),
        figmaNodes.userAction({ id: 'userActionId', text: 'some user action', position: 0 }),
        figmaNodes.signalListen({ id: 'signalListenId', position: 0, text: 'Click Button' }),
        ...figmaConnectorNode({ start: 'userActionId', end: 'gatewayId' }),
        figmaNodes.gateway({ id: 'gatewayId', text: 'Is something true?' })
      ])
    )
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
  serviceCall_someServiceCall: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_clickButton: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_someServiceCall: TestFunction<TState, TPageExtensions>
  test_someScript: TestFunction<TState, TPageExtensions>
}
`)
  })

  test('multiple calls to same serviceCall should only create one type', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: 'startId' }),
        ...figmaConnectorNode({ text: 'root:demo', start: 'startId', end: 'serviceCall1Id' }),
        figmaNodes.serviceCall({ id: 'serviceCall1Id', text: 'Some service call' }),
        ...figmaConnectorNode({ start: 'serviceCall1Id', end: 'serviceCall2Id' }),
        figmaNodes.serviceCall({ id: 'serviceCall2Id', text: 'Some service call' })
      ])
    )
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
  serviceCall_someServiceCall: (args: TestArgs<TState, TPageExtensions>) => Promise<void>

  test_someServiceCall: TestFunction<TState, TPageExtensions>
}
`)
  })
})
