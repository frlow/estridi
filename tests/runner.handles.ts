import type {RunnerHandles} from './runner.test.js'
import {Scraped} from "../src";
import {createTester, Handles, Variant} from "../src/runner";
import {expect, vi} from 'vitest';

export type State = {
  scraped: Scraped,
  variant: Variant<any>,
  variants: Variant<any>[],
  tester: ReturnType<typeof createTester>
}
export const handles: RunnerHandles = {
  handleSetup: async () => {
    return {} as State
  },
  handleStart: async ({state, gateways}) => {
    const handles: Handles = {
      handleAction: vi.fn(),
      handleSetup: vi.fn(),
      handleStart: vi.fn(),
      handleServiceCall: vi.fn(),
      handleTestNode: vi.fn()
    }
    if (gateways["94:2102: Node has any variants"] === "yes")
      handles.variants = () => ([{name: "MyVariant"}])
    state.tester = createTester(state.scraped, handles)
  },
  handleServiceCall: async ({key, state, gateways}) => {
    switch (key) {
      case "76:1168: Load scraped data":
        state.scraped = []
        break
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleAction: async ({state, key}) => {
    switch (key) {
      case "76:1153: Test node":
        state.tester.testNode("MyNode")
        break
      case "76:1143: Get variants":
        state.variants = state.tester.getVariants("MyNode")
        break
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleTestNode: async ({state, key}) => {
    switch (key) {
      case "76:1189: Return Variants for node":
        expect(state.variants).toStrictEqual([{name: "MyVariant"}])
        break
      case "94:2126: Return default variant":
        expect(state.variants).toStrictEqual([{name: "MyNode"}])
        break
      default:
        debugger
        throw `${key} not implemented`
    }
  }
}
