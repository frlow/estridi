import type {MainHandles} from './main.test.js'
import {estridi, Estridi, EstridiConfig, FigmaConfig, Scraped} from '../src'
import {getTEFigmaDocument} from "./serviceCalls/figmaTEServiceCalls";
import {expect} from "vitest";

export type State = { estridi: Estridi, scraped?: Scraped }
export const handles: MainHandles = {
  handleSetup: async (args) => {
    return {
      estridi: estridi()
    }
  },
  handleStart: async ({state}) => {
    state.scraped = await state.estridi.generate()
  },
  handleServiceCall: async ({key, state, gateways}) => {
    switch (key) {
      case "1:380: Config file":
        state.estridi.loadConfig = () => {
          if (gateways["1:569: Source type"] === "figma") {
            const config: FigmaConfig = {
              fileId: "dummyFile",
              token: "dummyToken",
              type: "figma",
              variant: gateways["1:897: Figma variant"] === "Open" ? "Open" : "TE",
              logging: "verbose"
            }
            return config
          }
          throw "Not implemented!"
        }
        break
      case "1:568: Load Figma Document": {
        state.estridi.loadFigmaDocument = async (config: EstridiConfig) => {
          if (config.variant === "TE") return getTEFigmaDocument(gateways)
          throw "Not implemented yet!"
        }
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleAction: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw `${args.key} not implemented`
    }
  },
  handleTestNode: async ({state, key}) => {
    const getLog = state.estridi.getLog
    switch (key) {
      case "1:741: V List all loaded data": {
        expect(getLog("loadedData").children[0].children[0]).toBeTruthy()
        break
      }
      case "1:803: V List all nodes":
        expect(getLog("figmaNodes")["0:0"]).toBeTruthy()
        break
      case "1:853: V Show parsed table":
        expect(getLog("parsedTable")).toStrictEqual({
          "id": "9:415",
          "rows": [
            [
              ".My Table",
              "First",
              "Second",
            ],
            [
              "Line 1",
              "AAAA",
              "BBBB",
            ],
            [
              "Line 2",
              "CCCC",
              "DDDD",
            ],
          ],
          "type": "table",
        })
        break
      case "2:1466: V Do not show parsed table": {
        expect(getLog("parsedTable")).toBeUndefined()
        break
      }
      case "4:1524: V Parse Script Text Connections 0 1": {
        expect(getLog("parsedScript")).toStrictEqual({
          "id": "1:338",
          "next": "1:500",
          "text": "Show Data",
          "type": "script",
        })
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  filterPaths: ({getGateways, allPaths}) =>
      allPaths.filter((p) => {
        const gateways = getGateways(p)
        const gatewayHasConflictingValues = (text: string) => {
          const matchingGateways = gateways.filter((g: any) => g.text === text)
          return (
              matchingGateways.length > 1 &&
              !matchingGateways.every(
                  (g: any) => g.value === matchingGateways[0]!.value
              )
          )
        }
        if (gatewayHasConflictingValues('Source type')) return false
        // More conditions below
        return true
      })
}
