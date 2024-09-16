import type {RunnerHandles} from './runner.test.js'
import {FigmaConfig, Scraped} from "../src";
import {createTester, Handles, LogEventType, Variant} from "../src/runner";
import {expect, vi} from 'vitest';
import {figmaExampleTE} from "./serviceCalls/data/figmaExamples";
import {processFigma} from "../src/processors/figma";
import {filterScraped} from "../src/common";

export type State = {
  testScraped: Scraped,
  variant: Variant<any>,
  variants: Variant<any>[],
  tester: ReturnType<typeof createTester>,
  testHandles: Handles,
  log: { eventType: LogEventType, msg: any }[]
}
export const handles: RunnerHandles = {
  handleSetup: async () => {
    return {log: []} as State
  },
  handleStart: async ({state}) => {
    state.tester = createTester(
        state.testScraped,
        state.testHandles,
        (eventType, msg) => state.log.push({
          eventType,
          msg
        }))
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
          handleTestNode: vi.fn(),
          config: {}
        }
        if (gateways["94:2102: Node has any variants"] === "yes")
          state.testHandles.variants = () => ([{name: "MyVariant"}])
        if (gateways["76:1261: Node has variant"] === "yes")
          state.variant = {name: "MyVariant"}
        if (gateways["76:1304: Variant has via"] === "yes")
          state.variant.via = ["40:171"]
        if (gateways["76:1372: Any discouraged nodes"] === "no")
          state.testHandles.config.discouragedNodes = undefined
        else if (gateways["77:1572: Any suggested paths left"] === "no")
          state.testHandles.config.discouragedNodes = ["1:365: MyNode"]
        else if (gateways["77:1572: Any suggested paths left"] === "yes")
          state.testHandles.config.discouragedNodes = ["40:184: Shorter 1"]
        if (gateways["87:2067: Variant has custom test"] === "yes")
          state.variant = {...state.variant, name: "Custom test", customTest: vi.fn()}
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
        await state.tester.testNode("1:365", {variant: state.variant})
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
      case "109:2256: List all paths": {
        const paths = state.log.find(l => l.eventType === "allPaths").msg
        const expected = [
          ["1:72", "1:67", "1:73", "1:338", "1:235", "1:326"],
          ["1:72", "1:67", "1:73", "1:338", "1:235", "1:76", "1:358", "1:365", "40:145", "40:184", "40:220", "40:237"],
          ["1:72", "1:67", "1:73", "1:338", "1:235", "1:76", "1:358", "1:365", "40:145", "40:158", "40:171", "40:220", "40:237"],
          ["1:72", "1:67", "1:73", "1:338", "1:235", "1:77"],
          ["1:72", "1:67", "1:73", "1:74"]
        ]
        expect(paths).toStrictEqual(expected)
        break
      }
      case "76:1241: Filter all paths containing node": {
        const pathsWithNode = state.log.find(l => l.eventType === "pathContainingNode").msg
        expect(pathsWithNode.length).toStrictEqual(2)
        expect(pathsWithNode[0]).toContain("1:365")
        expect(pathsWithNode[1]).toContain("1:365")
        break
      }
      case "76:1322: Filter paths containing all via nodes": {
        const via = state.log.find(l => l.eventType === "viaFilteredNodes").msg
        expect(via.length).toEqual(1)
        expect(via[0]).toContain("40:171")
        break
      }
      case "108:2187: Don t filter nodes by via": {
        const via = state.log.find(l => l.eventType === "viaFilteredNodes").msg
        const paths = state.log.find(l => l.eventType === "pathContainingNode").msg
        expect(via).toStrictEqual(paths)
        break
      }
      case "77:1609: Filter encouraged paths": {
        const discouraged = state.log.find(l => l.eventType === "discouragedFilterNodes").msg
        const paths = state.log.find(l => l.eventType === "pathContainingNode").msg
        expect(discouraged.length).toStrictEqual(paths.length - 1)
        break
      }
      case "108:2237: Don t filter discouraged":
      case "77:1635: Include discouraged paths": {
        const discouraged = state.log.find(l => l.eventType === "discouragedFilterNodes").msg
        const paths = state.log.find(l => l.eventType === "pathContainingNode").msg
        expect(discouraged).toStrictEqual(paths)
        break
      }
      case "76:1484: Use shortest path": {
        const shortest = state.log.find(l => l.eventType === "shortestPath").msg
        const paths: string[][] = state.log.find(l => l.eventType === "pathContainingNode")
            .msg
            .toSorted((a, b) => a.length > b.length ? 1 : -1)
        expect(paths[0]).toStrictEqual(shortest)
        break
      }
      case "87:2080: Call custom test": {
        expect(state.testHandles.handleSetup).not.toHaveBeenCalled()
        expect(state.variant.customTest).toHaveBeenCalled()
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  config: {
    discouragedNodes: [
      "87:2080: Call custom test",
      "76:1322: Filter paths containing all via nodes",
      "77:1609: Filter encouraged paths",
      "77:1635: Include discouraged paths"
    ]
  }
}
