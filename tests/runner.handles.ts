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
  log: { eventType: LogEventType, msg: any }[],
  error: Error,
  callMock: ReturnType<typeof vi.fn>
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
        state.callMock = vi.fn()
        state.testHandles = {
          handleAction: args => state.callMock("action", args),
          handleSetup: args => state.callMock("setup", args),
          handleStart: args => state.callMock("start", args),
          handleServiceCall: args => state.callMock("serviceCall", args),
          handleTestNode: args => state.callMock("testNode", args),
          config: {}
        }
        if (gateways["94:2102: Node has any variants"] === "yes")
          state.testHandles.variants = () => ([{name: "MyVariant"}])
        if (gateways["76:1261: Node has variant"] === "yes")
          state.variant = {name: "MyVariant"}
        if (gateways["76:1304: Variant has via"] === "yes")
          state.variant.via = ["40:171"]
        if (gateways["110:2342: Any path containing all via nodes"] === "no")
          state.variant.via = ["dummy1", "dummy2"]
        if (gateways["76:1372: Any discouraged nodes"] === "no")
          state.testHandles.config.discouragedNodes = undefined
        else if (gateways["77:1572: Any suggested paths left"] === "no")
          state.testHandles.config.discouragedNodes = ["1:365: MyNode"]
        else if (gateways["77:1572: Any suggested paths left"] === "yes")
          state.testHandles.config.discouragedNodes = ["40:184: Shorter 1"]
        if (gateways["87:2067: Variant has custom test"] === "yes")
          state.variant = {...state.variant, name: "Custom test", customTest: vi.fn()}
        if (gateways["78:1892: Variant has extra action"] === "yes")
          state.variant = {
            ...state.variant,
            name: "Custom test",
            extraAction: args => state.callMock("extraAction", args)
          }
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleAction: async ({state, key, gateways}) => {
    switch (key) {
      case "76:1153: Test node": {
        let id = "1:365"
        if (gateways["110:2290: Any paths containing node"] === "no") id = "dummy"
        await state.tester.testNode(id, {libArg: "dummy", variant: state.variant}).catch(e => state.error = e)
        // libArg is just an example of args from a testing library, page, context from playwright etc.
        break
      }
      case "76:1143: Get variants":
        state.variants = state.tester.getVariants("MyNode")
        break
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleTestNode: async ({state, key}) => {
    const expectedArgs = {
      "libArg": "dummy",
      gateways: expect.any(Object),
      getTable: expect.any(Function)
    }
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
          ["1:72", "1:67", "1:73", "1:338", "1:235", "1:76", "1:358", "1:365", "40:145", "40:184", "40:220", "47:198", "40:237"],
          ["1:72", "1:67", "1:73", "1:338", "1:235", "1:76", "1:358", "1:365", "40:145", "40:158", "40:171", "40:220", "47:198", "40:237"],
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
        expect(state.callMock).not.toHaveBeenCalled()
        expect(state.variant.customTest).toHaveBeenCalled()
        break
      }
      case "110:2303: No paths containing node":
        expect(state.error).toStrictEqual("No paths containing node: dummy")
        break
      case "110:2327: No paths containing all via nodes":
        expect(state.error).toStrictEqual("No paths containing all via nodes: dummy1, dummy2")
        break
      case  "78:1739: Show args testLib args getTable gateways variant":
        const testArgs = state.log.find(l => l.eventType === "testArgs").msg
        expect(Object.keys(testArgs)).toStrictEqual([
          "variant",
          "libArg",
          "getTable",
          "gateways"
        ])
        expect(testArgs.variant).toStrictEqual({name: "MyVariant", "via": ["40:171"],})
        expect(testArgs.libArg).toStrictEqual("dummy")
        expect(testArgs.gateways).toStrictEqual({
          "1:73: Any errors from backend": "no",
          "40:145: Shorter or longer": "longer",
        })
        const table = testArgs.getTable("9:415: My Table")
        expect(table.values).toStrictEqual([
          {
            "Id": "Line 1",
            "First": "AAAA",
            "Second": "BBBB",
          },
          {
            "Id": "Line 2",
            "First": "CCCC",
            "Second": "DDDD",
          },
        ])
        break
      case "78:1749: Call setup args": {
        expect(state.callMock).toHaveBeenNthCalledWith(1, "setup", expectedArgs)
        break
      }
      case "78:1766: Call serviceCalls args serviceCallKey state": {
        expect(state.callMock).toHaveBeenNthCalledWith(2, "serviceCall", {
          ...expectedArgs,
          key: "1:67: Get Data From Backend"
        })
        break
      }
      case "78:1798: Call start args state": {
        expect(state.callMock).toHaveBeenNthCalledWith(3, "start", expectedArgs)
        break
      }
      case "78:1843: Call actions before tested node args actionKey state": {
        expect(state.callMock).toHaveBeenNthCalledWith(4, "action", {
          ...expectedArgs,
          key: "1:235: action - Next Clicked"
        })
        break
      }
      case "78:1865: Call testNode args testNodeKey state Including scripts messages and unlinked subprocesses": {
        expect(state.callMock).toHaveBeenNthCalledWith(5, "testNode", {...expectedArgs, key: "1:365: Show Done",})
        break
      }
      case "78:1923: Call extraAction args state": {
        expect(state.callMock).toHaveBeenNthCalledWith(5, "extraAction", {...expectedArgs, variant: expect.anything()})
        expect(state.callMock).toHaveBeenNthCalledWith(6, "testNode", {
          ...expectedArgs,
          key: "1:365: Show Done",
          variant: expect.anything()
        })
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  variants: ({matchId}) => {
    if (matchId("78:1739: Show args testLib args getTable gateways variant"))
      return [{name: "78:1739", via: ["76:1304: Variant has via"]}]
    if (matchId("78:1739: Show args testLib args getTable gateways variant"))
      return [{name: "78:1739", via: ["76:1322: Filter paths containing all via nodes"]}]
  },

  config: {
    discouragedNodes: [
      "87:2080: Call custom test",
      "110:2327: No paths containing all via nodes"
    ]
  }
}
