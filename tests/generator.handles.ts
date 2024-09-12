import type {GeneratorHandles} from './generator.test.js'
import {estridi, Estridi, EstridiConfig, EstridiParameters, EstridiTargets} from '../src'
import {expect, vi} from "vitest";
import {getFigmaDocument} from "./serviceCalls/figmaServiceCalls";
import {figmaExampleTE} from "./serviceCalls/data/figmaExamples";
import {expectedDataFile, expectedHandlesFile} from "./serviceCalls/data/testFiles";

export type State = { estridi: Estridi, parameters: EstridiParameters }
export const handles: GeneratorHandles = {
  handleSetup: async (args) => {
    return {} as State
  },
  handleStart: async ({state, variant}) => {
    state.estridi.writeFile = vi.fn().mockImplementation((content, fileName) => {
      const a = 0 // debugging here!
    })
    state.estridi.fileExists = vi.fn().mockImplementation(() => {
      return !!variant.data?.fileExists
    })
    await state.estridi.generate()
  },
  handleServiceCall: async ({key, state, gateways, variant}) => {
    switch (key) {
      case "58:1051: Cli parameters": {
        const rootName = variant.data?.parameters?.rootName ||
            (gateways["57:452: Does root exist"] === "no" ? "dummy" :
                (gateways["57:430: Root node specified"] === "yes" ? "main" : undefined))
        const target: EstridiTargets = variant.data?.parameters?.target ||
            (gateways["58:1014: Is target valid"] === "no" ? "dummy" as any :
                (gateways["58:675: Target set"] === "yes" ? "vitest" : undefined))
        state.parameters = {rootName, target}
        break
      }
      case "1:380: Config file":
        state.estridi = estridi(state.parameters)
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
        state.estridi.loadFigmaDocument = async () => {
          const ret = structuredClone(getFigmaDocument(variant))
          if (gateways["57:489: Is there exactly one root"] === "yes") {
            const otherConnector = (ret as any).children[0].children.find(n => n.id === "26:156")
            if (otherConnector) otherConnector.name = "other"
          }
          return ret
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
          text: "My Table"
        })
        break
      case "39:2363: Show parsed nodes and tables": {
        expect(state.estridi.getLog("allParsed").length).toEqual(121) // Amount of nodes in the example data
        break
      }
      case "57:503: Document must contain exactly one root":
        expect(state.estridi.getLog("parameterError")).toEqual("Root name must be set if more than one root exists")
        break
      case "57:466: Root node not found":
        expect(state.estridi.getLog("parameterError")).toEqual("Root node not found")
        break
      case "57:599: Show using default root":
        expect(state.estridi.getLog("parametersUsed").rootName).toEqual("main")
        break
      case "57:567: Show using defined root":
        expect(state.estridi.getLog("parametersUsed").rootName).toEqual("main")
        break
      case "58:707: Default target playwright":
        expect(state.estridi.getLog("parametersUsed").target).toEqual("playwright")
        break
      case "58:1027: Target not valid":
        expect(state.estridi.getLog("parameterError")).toEqual("Target not valid")
        break
      case "58:734: Show target":
        expect(state.estridi.getLog("parametersUsed").target).toEqual("vitest")
        break
      case "58:877: Show filtered nodes connected to root":
        expect(state.estridi.getLog("filteredNodes")).toStrictEqual([
          {
            "id": "26:135",
            "isRoot": true,
            "next": "26:143",
            "text": "other",
            "type": "start",
          },
          {
            "id": "26:143",
            "next": undefined,
            "text": "Something else",
            "type": "script",
          },
          {
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
            "text": "My Table",
            "type": "table",
          },
        ])
        break
      case "50:315: Write data file":
        expect(state.estridi.writeFile).toHaveBeenCalledWith(expectedDataFile, "tests/main.data.ts")
        break
      case "53:434: Write Test file for selected target": {
        const generator = variant.data.generator
        switch (generator.Id) {
          case "playwright":
            expect(state.estridi.writeFile).toHaveBeenNthCalledWith(3, "soudhufsd", `tests/test.${generator["Test file name"]}.ts`)
            break
          default:
            debugger
            throw "Not implemented!"
        }
        break
      }
      case "53:465: Write Handles file": {
        const generator = variant.data.generator
        expect(state.estridi.writeFile).toHaveBeenNthCalledWith(2, expectedHandlesFile(generator["Test file name"]), `tests/main.handles.ts`)
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
      }),
  variants: ({getTable, matchId}) => {
    const sources = getTable("16:1764: Source types").values.map(s => ({data: {source: s}, name: s.Id}))
    const tables = getTable("16:1764: Source types").values.map(s => ({data: {source: s, tables: true}, name: s.Id}))
    const temp: any[] = []
    for (const source of getTable("16:1764: Source types").values) {
      for (const node of getTable("1:966: Node types").values) {
        temp.push({source, node})
      }
    }
    const sourcesAndNodes = temp.map(t => ({data: t, name: `${t.source.Id} ${t.node.Id}`}))
    const generators = getTable("51:412: Generation targets").values.map(v => ({
      name: v.Id,
      data: {parameters: {target: v.Id}, generator: v}
    }))

    if (matchId("22:2180: Parse Nodes"))
      return sourcesAndNodes
    // .filter(n => n.name === "Figma TE other")
    if (matchId("22:2167: Show loaded data")) return sources
    if (matchId("22:2197: Parse Tables")) return tables
    if (matchId("53:434: Write Test file for selected target")) return generators
    if (matchId("53:465: Write Handles file")) return generators
    if (matchId("58:877: Show filtered nodes connected to root")) return [{
      name: "Filtered nodes",
      data: {parameters: {rootName: "other"}}
    }]
  }, config: {
    discouragedNodes: [
      "58:1027: Target not valid",
      "57:466: Root node not found",
      "57:599: Show using default root"
    ]
  }
}
