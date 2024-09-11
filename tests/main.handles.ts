import type {MainHandles} from './main.test.js'
import {estridi, Estridi, EstridiConfig} from '../src'
import {expect} from "vitest";
import {getFigmaDocument} from "./serviceCalls/figmaServiceCalls";
import {figmaExampleTE} from "./serviceCalls/data/figmaExamples";

export type State = { estridi: Estridi }
export const handles: MainHandles = {
  handleSetup: async (args) => {
    return {
      estridi: estridi()
    }
  },
  handleStart: async ({state}) => {
    await state.estridi.generate()
  },
  handleServiceCall: async ({key, state, gateways, variant}) => {
    switch (key) {
      case "1:380: Config file":
        state.estridi.loadConfig = () => {
          if (variant.data?.source) return {
            logging: "verbose",
            type: variant.data?.source?.Family,
            variant: variant.data?.source?.Variant
          } as EstridiConfig
          else if (gateways["22:2092: Errors loading config"] === "yes") return undefined
          return {
            logging: "verbose",
            type: "figma",
            variant: "TE"
          } as EstridiConfig
        }
        break
      case "22:2042: Load Data": {
        if (gateways["22:2142: Errors loading data"] === "yes") state.estridi.loadData = async () => undefined
        state.estridi.loadFigmaDocument = async () => getFigmaDocument(variant)
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
  handleTestNode: async ({state, key, variant, getTable}) => {
    switch (key) {
      case "22:2100: Could not load config":
        expect(state.estridi.log).toStrictEqual([])
        break
      case "22:2150: Could not load data":
        expect(state.estridi.getLog("couldNotLoadData")).toStrictEqual(null)
        break
      case "22:2121: Show loaded config": {
        expect(state.estridi.getLog("loadedConfig")).toStrictEqual({
          "logging": "verbose",
          "type": "figma",
          "variant": "TE",
        })
        break
      }
      case "22:2167: Show loaded data": {
        if (variant.data.source.Family === "figma" && variant.data.source.Variant === "TE")
          expect(state.estridi.getLog("loadedData")).toStrictEqual(figmaExampleTE)
        else
          debugger
        break
      }
      case "22:2180: Parse Nodes": {
        const type: string = variant.data.node.Alias || variant.data.node.Id
        const logName = `parsed${type[0].toUpperCase()}${type.substring(1)}`
        let node = state.estridi.getLog(logName as any)
        if (type === "other") node = state.estridi.log.find(l => l.tag === "parsedOther" && l.data.next).data
        const props = Object.entries(variant.data.node).filter(e => e[1] === "x").map(e => e[0])
        expect(node.id).toBeTruthy()
        for (const prop of props)
          switch (prop) {
            case "text":
              if (node.isRoot)
                expect(node.text).toEqual("test")
              else if (node.type === "subprocess")
                expect(node.text).toEqual("Next")
              else
                expect(node.text).toEqual("Some text")
              break
            case "next":
              expect(node.next).toEqual("NextId")
              break
            case "isRoot":
              expect(node.isRoot).toEqual(true)
              break
            case "options":
              expect(node.options).toStrictEqual({
                "YesId": "yes",
                "NoId": "no",
              })
              break
            case "link":
              expect(node.link).toEqual("LinkId")
              break
            case "actions":
              expect(node.actions).toStrictEqual({"ActionId": "Click"})
              break
            default:
              debugger
              throw `no expected data for ${prop}`
          }
        break
      }
      case "22:2197: Parse Tables":
        expect(state.estridi.getLog("parsedTable")).toStrictEqual({
          "id": "TableId",
          "rows": [
            [".My Table", "Column1", "Column2",],
            ["Line1", "AAAA", "BBBB",],
            ["Line2", "CCCC", "DDDD",],
          ],
          "type": "table",
        })
        break
      case "39:2363: Show parsed nodes and tables": {
        expect(state.estridi.getLog("allParsed").length).toEqual(111) // Amount of nodes in the example data
        break
      }
      case "47:2395: Show filtered nodes connected to root":
        expect(state.estridi.getLog("filteredNodes")).toStrictEqual([
          {
            "id": "1:72",
            "isRoot": true,
            "next": "1:67",
            "text": "main",
            "type": "start",
          },
          {
            "id": "1:67",
            "next": "1:73",
            "text": "Get Data From Backend",
            "type": "serviceCall",
          },
          {
            "id": "1:73",
            "options": {
              "1:338": "no",
              "1:74": "yes",
            },
            "text": "Any errors from backend",
            "type": "gateway",
          },
          {
            "id": "1:74",
            "next": undefined,
            "type": "other",
          },
          {
            "id": "1:338",
            "next": "1:235",
            "text": "Show Data",
            "type": "script",
          },
          {
            "actions": {
              "1:326": "Cancel Clicked",
              "1:76": "Next Clicked",
            },
            "id": "1:235",
            "next": "1:77",
            "text": "action",
            "type": "userAction",
          },
          {
            "id": "1:77",
            "isRoot": undefined,
            "next": undefined,
            "text": "start",
            "type": "start",
          },
          {
            "id": "1:76",
            "link": "1:358",
            "next": undefined,
            "text": "Next Page",
            "type": "subprocess",
          },
          {
            "id": "1:358",
            "isRoot": false,
            "next": "1:365",
            "text": "Next Page",
            "type": "start",
          },
          {
            "id": "1:365",
            "next": undefined,
            "text": "Show Done",
            "type": "script",
          },
          {
            "id": "1:326",
            "next": undefined,
            "text": "Clear Page",
            "type": "script",
          },
        ])
        break
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
      }),
  variants: ({getTable, matchId}) => {
    // const nodes = getTable("1:966: Node types").values.map(n => ({data: {node: n}, name: n.Id}))
    const sources = getTable("16:1764: Source types").values.map(s => ({data: {source: s}, name: s.Id}))
    const tables = getTable("16:1764: Source types").values.map(s => ({data: {source: s, tables: true}, name: s.Id}))
    const temp: any[] = []
    for (const source of getTable("16:1764: Source types").values) {
      for (const node of getTable("1:966: Node types").values) {
        temp.push({source, node})
      }
    }
    const sourcesAndNodes = temp.map(t => ({data: t, name: `${t.source.Id} ${t.node.Id}`}))
    if (matchId("22:2180: Parse Nodes"))
      return sourcesAndNodes
    // .filter(n => n.name === "Figma TE other")
    if (matchId("22:2167: Show loaded data")) return sources
    if (matchId("22:2197: Parse Tables")) return tables
  }
}
