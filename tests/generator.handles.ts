import type { GeneratorHandles, TestNodeKey } from './generator.test.js'
import {
  estridi,
  Estridi,
  EstridiConfig,
  EstridiParameters,
  EstridiTargets,
  LogEvents,
} from '../src'
import { expect, vi } from 'vitest'
import { getFigmaDocument } from './serviceCalls/figmaServiceCalls'
import { figmaExampleTE } from './serviceCalls/data/figmaExamples'
import {
  expectedDataFile,
  expectedHandlesFile,
  expectedPlaywrightFile,
  expectedVitestFile,
  expectedWriterFile,
} from './serviceCalls/data/testFiles'

export type State = {
  estridi: Estridi
  parameters: EstridiParameters
  log: { key: LogEvents; data: any }[]
  getLog: (key: LogEvents) => any
}
export const handles: GeneratorHandles = {
  handleSetup: async (args) => {
    return {
      log: [],
    } as State
  },
  handleStart: async ({ state, variant }) => {
    state.getLog = (key) => state.log.findLast((l) => l.key === key)!.data
    state.estridi.writeFile = vi.fn()
    state.estridi.log = (key, content) => state.log.push({ data: content, key })
    await state.estridi.generate()
  },
  handleServiceCall: async ({ key, state, gateways, variant }) => {
    switch (key) {
      case '58:1051: Cli parameters': {
        const rootName =
          variant.data?.parameters?.rootName ||
          (gateways['57:452: Does root exist'] === 'no'
            ? 'dummy'
            : gateways['57:430: Root node specified'] === 'yes'
              ? 'main'
              : undefined)
        const target: EstridiTargets =
          variant.data?.parameters?.target ||
          (gateways['58:1014: Is target valid'] === 'no'
            ? ('dummy' as any)
            : gateways['58:675: Target set'] === 'yes'
              ? 'vitest'
              : undefined)
        state.parameters = { rootName, target }
        break
      }
      case '1:380: Config file':
        state.estridi = estridi(state.parameters)
        state.estridi.fileExists = vi.fn().mockImplementation(() => {
          return gateways['53:456: Does handles file exist'] !== 'no'
        })
        state.estridi.loadConfig = () => {
          if (variant.data?.source)
            return {
              type: variant.data?.source?.Family,
              variant: variant.data?.source?.Variant,
            } as EstridiConfig
          else if (gateways['22:2092: Errors loading config'] === 'yes')
            return undefined
          return {
            type: 'figma',
            variant: 'TE',
          } as EstridiConfig
        }
        break
      case '22:2042: Load Data': {
        if (gateways['22:2142: Errors loading data'] === 'yes')
          state.estridi.loadData = async () => undefined
        state.estridi.loadFigmaDocument = async () => {
          const ret = structuredClone(getFigmaDocument(variant))
          if (gateways['57:489: Is there exactly one root'] === 'yes') {
            const otherConnector = (ret as any).children[0].children.find(
              (n) => n.id === '26:156',
            )
            if (otherConnector) otherConnector.name = 'other'
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
  handleTestNode: async ({ state, key, variant, getTable }) => {
    switch (key) {
      case '22:2100: Could not load config':
        expect(state.log).toStrictEqual([])
        break
      case '22:2150: Could not load data':
        expect(state.getLog('couldNotLoadData')).toStrictEqual(null)
        break
      case '22:2121: Show loaded config': {
        expect(state.getLog('loadedConfig')).toStrictEqual({
          type: 'figma',
          variant: 'TE',
        })
        break
      }
      case '22:2167: Show loaded data': {
        if (
          variant.data.source.Family === 'figma' &&
          variant.data.source.Variant === 'TE'
        ) {
          const loadedData = state.getLog('loadedData')
          const expected = figmaExampleTE
          expect(loadedData).toStrictEqual(expected)
        } else debugger
        break
      }
      case '22:2180: Parse Nodes': {
        const type: string = variant.data.node.Alias || variant.data.node.Id
        const logName = `parsed${type[0].toUpperCase()}${type.substring(1)}`
        let node = state.getLog(logName as any)
        if (type === 'other')
          node = state.log.find(
            (l) => l.key === 'parsedOther' && l.data.next,
          ).data
        const props = Object.entries(variant.data.node)
          .filter((e) => e[1] === 'x')
          .map((e) => e[0])
        expect(node.id).toBeTruthy()
        for (const prop of props)
          switch (prop) {
            case 'text':
              if (node.isRoot) expect(node.text).toEqual('test')
              else if (node.type === 'subprocess')
                expect(node.text).toEqual('Next')
              else if (node.type === 'end') expect(node.text).toEqual('end')
              else expect(node.text).toEqual('Some text')
              break
            case 'next':
              expect(node.next).toEqual('NextId')
              break
            case 'isRoot':
              expect(node.isRoot).toEqual(true)
              break
            case 'options':
              expect(node.options).toStrictEqual({
                YesId: 'yes',
                NoId: 'no',
              })
              break
            case 'link':
              expect(node.link).toEqual('LinkId')
              break
            case 'actions':
              expect(node.actions).toStrictEqual({ ActionId: 'Click' })
              break
            default:
              debugger
              throw `no expected data for ${prop}`
          }
        break
      }
      case '22:2197: Parse Tables':
        expect(state.getLog('parsedTable')).toStrictEqual({
          id: 'TableId',
          rows: [
            ['.My Table', 'Column1', 'Column2'],
            ['Line1', 'AAAA', 'BBBB'],
            ['Line2', 'CCCC', 'DDDD'],
          ],
          type: 'table',
          text: 'My Table',
        })
        break
      case '39:2363: Show parsed nodes and tables': {
        expect(state.getLog('allParsed').length).toEqual(165) // Amount of nodes in the example data
        break
      }
      case '57:503: Document must contain exactly one root':
        expect(state.getLog('parameterError')).toEqual(
          'Root name must be set if more than one root exists',
        )
        break
      case '57:466: Root node not found':
        expect(state.getLog('parameterError')).toEqual('Root node not found')
        break
      case '57:599: Show using default root':
        expect(state.getLog('parametersUsed').rootName).toEqual('main')
        break
      case '57:567: Show using defined root':
        expect(state.getLog('parametersUsed').rootName).toEqual('main')
        break
      case '58:707: Default target playwright':
        expect(state.getLog('parametersUsed').target).toEqual('playwright')
        break
      case '58:1027: Target not valid':
        expect(state.getLog('parameterError')).toEqual('Target not valid')
        break
      case '58:734: Show target':
        expect(state.getLog('parametersUsed').target).toEqual('vitest')
        break
      case '58:877: Show filtered nodes connected to root': {
        const allNodes = state.getLog('allParsed')
        const filteredNodes = state.getLog('filteredNodes')
        expect(allNodes.length === 165)
        expect(filteredNodes.length === 19)
        break
      }
      case '50:315: Write data file':
        expect(state.estridi.writeFile).toHaveBeenNthCalledWith(
          1,
          expectedDataFile,
          'main.data.ts',
        )
        break
      case '53:434: Write Test file for selected target': {
        const generator = variant.data.generator
        switch (generator.Id) {
          case 'vitest':
            expect(state.estridi.writeFile).toHaveBeenNthCalledWith(
              3,
              expectedVitestFile,
              `main.${generator['Test file name']}.ts`,
            )
            break
          case 'playwright':
            expect(state.estridi.writeFile).toHaveBeenNthCalledWith(
              3,
              expectedPlaywrightFile,
              `main.${generator['Test file name']}.ts`,
            )
            break
          case 'writer':
            expect(state.estridi.writeFile).toHaveBeenNthCalledWith(
              3,
              expectedWriterFile,
              `main.${generator['Test file name']}.ts`,
            )
            break
          default:
            debugger
            throw 'Not implemented!'
        }
        break
      }
      case '53:465: Write Handles file': {
        const generator = variant.data.generator
        expect(state.estridi.writeFile).toHaveBeenNthCalledWith(
          2,
          expectedHandlesFile(generator['Test file name']),
          `main.handles.ts`,
        )
        break
      }
      case '53:478: Leave handles file unchanged': {
        expect(state.estridi.writeFile).not.toHaveBeenCalledWith(
          expect.any(String),
          `main.handles.ts`,
        )
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  filterPaths: ({ getGateways, allPaths }) =>
    allPaths.filter((p) => {
      const gateways = getGateways(p)
      const gatewayHasConflictingValues = (text: string) => {
        const matchingGateways = gateways.filter((g: any) => g.text === text)
        return (
          matchingGateways.length > 1 &&
          !matchingGateways.every(
            (g: any) => g.value === matchingGateways[0]!.value,
          )
        )
      }
      if (gatewayHasConflictingValues('Source type')) return false
      // More conditions below
      return true
    }),
  variants: ({ getTable, matchId }) => {
    const sources = getTable('16:1764: Source types').values.map((s) => ({
      data: { source: s },
      name: s.Id,
      via: ['57:567: Show using defined root'] as TestNodeKey[],
    }))
    const tables = getTable('16:1764: Source types').values.map((s) => ({
      data: { source: s, tables: true },
      name: s.Id,
    }))
    const temp: any[] = []
    for (const source of getTable('16:1764: Source types').values) {
      for (const node of getTable('1:966: Node types').values) {
        temp.push({ source, node })
      }
    }
    const sourcesAndNodes = temp.map((t) => ({
      data: t,
      name: `${t.source.Id} ${t.node.Id}`,
    }))
    const generators = getTable('51:412: Generation targets').values.map(
      (v) => ({
        name: v.Id,
        data: { parameters: { target: v.Id }, generator: v },
      }),
    )

    if (matchId('22:2180: Parse Nodes')) return sourcesAndNodes
    if (matchId('22:2167: Show loaded data')) return sources
    if (matchId('22:2197: Parse Tables')) return tables
    if (matchId('53:434: Write Test file for selected target'))
      return generators
    if (matchId('53:465: Write Handles file')) return generators
  },
}
