// @ts-nocheck
import { BrowserContext, Page, test, expect } from '@playwright/test'
import { handles } from './main.js'

test.describe('main', ()=>{
  test('api data', async ({ page, context }) => {
    const gateways: GatewayCollection = {}
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_apiData
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('Show an error message', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors from api call': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_showAnErrorMessage
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('Do something here', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors from api call': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_doSomethingHere
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test.describe('Next page', ()=>{
  test('Go to some page', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors from api call': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    let testFunc = handles.test_goToSomePage
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.action_click(args)
    expect(await testFunc(args)).toBeUndefined()
  })

  })
})

export const Gateways = [
  'Any errors from api call'
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
  // /api/data
  await handles.serviceCall_apiData(args)
}

export type Main<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
} & MainRoot<TState, TPageExtensions> & MainNextPage<TState, TPageExtensions>

export type HandlesGenerics<U = typeof handles> = U extends Main<infer A,infer B> ? [A, B] : never

export type MainRoot<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
  serviceCall_apiData: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_click: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_apiData: TestFunction<TState, TPageExtensions>
  test_showAnErrorMessage: TestFunction<TState, TPageExtensions>
  test_doSomethingHere: TestFunction<TState, TPageExtensions>
}


export type MainNextPage<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
  test_goToSomePage: TestFunction<TState, TPageExtensions>
}
