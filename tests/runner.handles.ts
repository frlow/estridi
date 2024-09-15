import type {RunnerHandles} from './runner.test.js'
import {FigmaConfig, Scraped} from "../src";
import {createTester, Handles, Variant} from "../src/runner";
import {expect, vi} from 'vitest';
import {figmaExampleTE} from "./serviceCalls/data/figmaExamples";
import {processFigma} from "../src/processors/figma";
import {filterScraped} from "../src/common";

export type State = {
  testScraped: Scraped,
  variant: Variant<any>,
  variants: Variant<any>[],
  tester: ReturnType<typeof createTester>,
  testHandles: Handles
}
export const handles: RunnerHandles = {
  handleSetup: async () => {
    return {} as State
  },
  handleStart: async ({state}) => {
    state.tester = createTester(state.testScraped, state.testHandles)
  },
  handleServiceCall: async ({key, state, gateways}) => {
    switch (key) {
      case "76:1168: Load scraped data": {
        const processed = await processFigma(
            {variant: "TE",} as FigmaConfig,
            figmaExampleTE as any,
            () => null
        )
        state.testScraped = filterScraped(processed, "main")
        break
      }
      case "104:2156: Load handles": {
        state.testHandles = {
          handleAction: vi.fn(),
          handleSetup: vi.fn(),
          handleStart: vi.fn(),
          handleServiceCall: vi.fn(),
          handleTestNode: vi.fn()
        }
        if (gateways["94:2102: Node has any variants"] === "yes")
          state.testHandles.variants = () => ([{name: "MyVariant"}])
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleAction: async ({state, key}) => {
    switch (key) {
      case "76:1153: Test node":
        state.tester.testNode("1:365")
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
  },
  config: {
    discouragedNodes: ["87:2080: Call custom test"]
  }
}
