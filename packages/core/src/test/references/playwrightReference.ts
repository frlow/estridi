// @ts-nocheck
import { test, expect } from '@playwright/test'
import type { BrowserContext, Page } from '@playwright/test'
import { handles } from './standard.js'

test.describe('standard', () => {
  test('Intro Message', async ({ page, context }) => {
    const gateways: GatewayCollection = {}
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_introMessage
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('Serivce Call', async ({ page, context }) => {
    const gateways: GatewayCollection = {}
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_serivceCall
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('Something', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      Linked: 'A',
      Gateway: 'yes',
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_something
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('Negative Something', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      Linked: 'A',
      Gateway: 'no',
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_negativeSomething
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('My Script', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      Linked: 'A',
      Gateway: 'yes',
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_myScript
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test('Negative My Script', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      Linked: 'A',
      Gateway: 'no',
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_negativeMyScript
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })
  test.describe('Standard Sub', () => {
    test('Script', async ({ page, context }) => {
      const gateways: GatewayCollection = {
        Linked: 'B',
      }
      const state = await handles.setup({ gateways, page, context } as any)
      const args = { gateways, state, page, context } as any
      await handleServiceCalls(args)

      let testFunc = handles.test_script
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
      await handles.start(args)
      expect(await testFunc(args)).toBeUndefined()
    })
    test.describe('Standard Sub', () => {
      test('Script', async ({ page, context }) => {
        const gateways: GatewayCollection = {
          Linked: 'B',
        }
        const state = await handles.setup({ gateways, page, context } as any)
        const args = { gateways, state, page, context } as any
        await handleServiceCalls(args)
        await handles.start(args)
        let testFunc = handles.test_script
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
        await handles.action_reload(args)
        expect(await testFunc(args)).toBeUndefined()
      })
    })
  })
  test.describe('Validate Standard Case Table', () => {
    test('Validate Standard Case Table AAA', async ({ page, context }) => {
      const gateways: GatewayCollection = {
        Linked: 'A',
        'Validate Standard Case Table': 'AAA',
      }
      const state = await handles.setup({ gateways, page, context } as any)
      const args = { gateways, state, page, context } as any
      await handleServiceCalls(args)
      await handles.start(args)
      let testFunc = handles.test_validateStandardCaseTableAaa
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
      await handles.action_click(args)
      expect(await testFunc(args)).toBeUndefined()
    })
    test('Validate Standard Case Table BBB', async ({ page, context }) => {
      const gateways: GatewayCollection = {
        Linked: 'A',
        'Validate Standard Case Table': 'BBB',
      }
      const state = await handles.setup({ gateways, page, context } as any)
      const args = { gateways, state, page, context } as any
      await handleServiceCalls(args)
      await handles.start(args)
      let testFunc = handles.test_validateStandardCaseTableBbb
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
      await handles.action_click(args)
      expect(await testFunc(args)).toBeUndefined()
    })
    test('Validate Standard Case Table CCC', async ({ page, context }) => {
      const gateways: GatewayCollection = {
        Linked: 'A',
        'Validate Standard Case Table': 'CCC',
      }
      const state = await handles.setup({ gateways, page, context } as any)
      const args = { gateways, state, page, context } as any
      await handleServiceCalls(args)
      await handles.start(args)
      let testFunc = handles.test_validateStandardCaseTableCcc
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
      await handles.action_click(args)
      expect(await testFunc(args)).toBeUndefined()
    })
  })
  test.describe('Standard Sub 1', () => {
    test('A Message', async ({ page, context }) => {
      const gateways: GatewayCollection = {
        Linked: 'A',
      }
      const state = await handles.setup({ gateways, page, context } as any)
      const args = { gateways, state, page, context } as any
      await handleServiceCalls(args)
      await handles.start(args)
      let testFunc = handles.test_aMessage
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
      await handles.action_click(args)
      expect(await testFunc(args)).toBeUndefined()
    })
  })
})

export const Gateways = [
  'Linked',
  'Gateway',
  'Validate Standard Case Table',
] as const

export type GatewayKey = (typeof Gateways)[number]
export type GatewayCollection = Partial<Record<GatewayKey, string>>

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection
  state: TState
  page: Page & TPageExtensions
  context: BrowserContext
}

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined,
) => Promise<void | (() => Promise<void>)>

const handleServiceCalls = async (args: TestArgs<any, any>) => {
  await handles.serviceCall_serivceCall(args)
}

export type Standard<TState = {}, TPageExtensions = {}> = {
  setup: (
    args: Omit<TestArgs<TState, TPageExtensions>, 'state'>,
  ) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
} & StandardRoot<TState, TPageExtensions> &
  StandardStandardSub<TState, TPageExtensions> &
  StandardValidateStandardCaseTable<TState, TPageExtensions>

export type HandlesGenerics<U = typeof handles> =
  U extends Standard<infer A, infer B> ? [A, B] : never

export type StandardRoot<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  serviceCall_serivceCall: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>
  action_click: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_introMessage: TestFunction<TState, TPageExtensions>
  test_serivceCall: TestFunction<TState, TPageExtensions>
  test_something: TestFunction<TState, TPageExtensions>
  test_negativeSomething: TestFunction<TState, TPageExtensions>
  test_myScript: TestFunction<TState, TPageExtensions>
  test_negativeMyScript: TestFunction<TState, TPageExtensions>
}

export type StandardStandardSub<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  action_reload: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_script: TestFunction<TState, TPageExtensions>
}

export type StandardValidateStandardCaseTable<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  test_validateStandardCaseTableAaa: TestFunction<TState, TPageExtensions>
  test_validateStandardCaseTableBbb: TestFunction<TState, TPageExtensions>
  test_validateStandardCaseTableCcc: TestFunction<TState, TPageExtensions>
}
