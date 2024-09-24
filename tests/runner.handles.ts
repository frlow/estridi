import type { RunnerHandles } from './runner.test.js'
import { FigmaConfig, Scraped } from '../src/index.js'
import { createTester, Handles, LogEventType, Variant } from '../src/runner.js'
import { expect, vi } from 'vitest'
import { figmaExampleTE } from './serviceCalls/data/figmaExamples.js'
import { processFigma } from '../src/processors/figma/index.js'
import { filterScraped } from '../src/common.js'

export type State = {
  testScraped: Scraped
  // variant: Variant<any>,
  variants: Variant<any>[]
  tester: ReturnType<typeof createTester>
  testHandles: Handles
  log: { eventType: LogEventType; msg: any }[]
  error: Error
  callMock: ReturnType<typeof vi.fn>
}
export const handles: RunnerHandles = {
  handleSetup: async () => {
    return { log: [] } as State
  },
  handleStart: async ({ state, currentPath, testNodeId }) => {
    state.tester = createTester(
      state.testScraped,
      state.testHandles,
      (eventType, msg) =>
        state.log.push({
          eventType,
          msg,
        }),
    )
  },
  handleServiceCall: async ({ key, state, gateways }) => {
    switch (key) {
      case '76:1168: Load scraped data': {
        const processed = await processFigma(
          { variant: 'TE' } as FigmaConfig,
          figmaExampleTE as any,
          () => null,
        )
        state.testScraped = filterScraped(processed, 'main')
        break
      }
      case '104:2156: Load handles': {
        state.callMock = vi.fn()
        state.testHandles = {
          handleAction: (args) => state.callMock('action', args),
          handleSetup: (args) => state.callMock('setup', args),
          handleStart: (args) => state.callMock('start', args),
          handleServiceCall: (args) => state.callMock('serviceCall', args),
          handleTestNode: (args) => state.callMock('testNode', args),
          config: {},
          filterPath: (args) => {
            if (args.hasConflict(args.path, 'A or B')) return false
            // More filters
            return true
          },
        }
        if (gateways['94:2102: Node has any variants'] === 'yes')
          state.testHandles.variants = () => [{ name: 'MyVariant' }]
        if (gateways['76:1261: Node has variant'] === 'yes')
          state.testHandles.variants = () => [{ name: 'MyVariant' }]
        if (gateways['76:1304: Variant has via'] === 'yes')
          state.testHandles.variants = () => [
            { name: 'MyVariant', via: ['40:171'] },
          ]
        if (gateways['110:2342: Any path containing all via nodes'] === 'no')
          state.testHandles.variants = () => [
            { name: 'MyVariant', via: ['dummy1', 'dummy2'] },
          ]
        if (gateways['76:1372: Any discouraged nodes'] === 'no')
          state.testHandles.config.discouragedNodes = undefined
        else if (gateways['77:1572: Any suggested paths left'] === 'no')
          state.testHandles.config.discouragedNodes = ['1:365: MyNode']
        else if (gateways['77:1572: Any suggested paths left'] === 'yes')
          state.testHandles.config.discouragedNodes = ['40:184: Shorter 1']
        if (gateways['87:2067: Variant has custom test'] === 'yes')
          state.testHandles.variants = () => [
            {
              name: 'Custom test',
              customTest: (args) => state.callMock('customTest', args),
            },
          ]
        if (gateways['78:1892: Variant has extra action'] === 'yes')
          state.testHandles.variants = () => [
            {
              name: 'Extra action',
              extraAction: (args) => state.callMock('extraAction', args),
            },
          ]
        break
      }
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleAction: async ({ state, key, gateways, variant }) => {
    switch (key) {
      case '76:1110: action - Test node': {
        let id = '1:365'
        if (gateways['110:2290: Any paths containing node'] === 'no')
          id = 'dummy'
        else if (gateways['136:809: Any paths containing end'] === 'no')
          id = '1:74'
        else if (variant.name === 'pathsWithEnd') id = '1:338'
        const testVariant = state.tester.getVariants(id)[0]
        await state.tester
          .testNode(id, { libArg: 'dummy', variant: testVariant })
          .catch((e) => (state.error = e))
        // libArg is just an example of args from a testing library, page, context from playwright etc.
        break
      }
      case '76:1110: action - Get variants':
        state.variants = state.tester.getVariants('MyNode')
        break
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleTestNode: async ({ state, key }) => {
    const expectedArgs = {
      libArg: 'dummy',
      gateways: expect.any(Object),
      getTable: expect.any(Function),
      currentPath: expect.any(Array),
      testNodeId: expect.any(String),
      // variant: expect.anything()
    }
    switch (key) {
      case '76:1189: Return Variants for node':
        expect(state.variants).toStrictEqual([{ name: 'MyVariant' }])
        break
      case '94:2126: Return default variant':
        expect(state.variants).toStrictEqual([{ name: 'MyNode' }])
        break
      case '109:2256: List all paths': {
        const paths = state.log.find((l) => l.eventType === 'allPaths').msg
        expect(paths.map((p) => p.length)).toStrictEqual([
          6, 19, 20, 19, 20, 20, 21, 20, 21, 6, 4,
        ])
        break
      }
      case '76:1241: Filter all paths containing node': {
        const pathsWithNode = state.log.find(
          (l) => l.eventType === 'pathContainingNode',
        ).msg
        expect(pathsWithNode.length).toStrictEqual(4)
        expect(pathsWithNode[0]).toContain('1:365')
        expect(pathsWithNode[1]).toContain('1:365')
        break
      }
      case '76:1322: Filter paths containing all via nodes': {
        const via = state.log.find(
          (l) => l.eventType === 'viaFilteredNodes',
        ).msg
        expect(via.length).toBeGreaterThanOrEqual(1)
        via.forEach((v) => expect(v).toContain('40:171'))
        break
      }
      case '108:2187: Don t filter nodes by via': {
        const via = state.log.find(
          (l) => l.eventType === 'viaFilteredNodes',
        ).msg
        const paths = state.log.find(
          (l) => l.eventType === 'pathContainingNode',
        ).msg
        expect(via).toStrictEqual(paths)
        break
      }
      case '77:1609: Filter encouraged paths': {
        const discouraged = state.log.find(
          (l) => l.eventType === 'discouragedFilterNodes',
        ).msg
        const paths = state.log.find(
          (l) => l.eventType === 'pathContainingNode',
        ).msg
        expect(discouraged.length).toBeLessThan(paths.length)
        break
      }
      case '108:2237: Don t filter discouraged':
      case '77:1635: Include discouraged paths': {
        const discouraged = state.log.find(
          (l) => l.eventType === 'discouragedFilterNodes',
        ).msg
        const paths = state.log.find(
          (l) => l.eventType === 'pathContainingNode',
        ).msg
        expect(discouraged).toStrictEqual(paths)
        break
      }
      case '76:1484: Use shortest path': {
        const shortest = state.log.find(
          (l) => l.eventType === 'shortestPath',
        ).msg
        const shortestPath = state.log
          .find((l) => l.eventType === 'pathContainingNode')
          .msg.reduce(
            (acc, cur) => (!acc || cur.length < acc.length ? cur : acc),
            undefined,
          )
        expect(shortestPath).toStrictEqual(shortest)
        break
      }
      case '87:2080: Call custom test': {
        expect(state.callMock).not.toHaveBeenCalledWith(
          'setup',
          expect.anything(),
        )
        expect(state.callMock).toHaveBeenCalledWith(
          'customTest',
          expect.anything(),
        )
        break
      }
      case '110:2303: No paths containing node':
        expect(state.error).toStrictEqual('No paths containing node: dummy')
        break
      case '110:2327: No paths containing all via nodes':
        expect(state.error).toStrictEqual(
          'No paths containing all via nodes: dummy1, dummy2',
        )
        break
      case '78:1739: Show args testLib args getTable gateways variant':
        const testArgs = state.log.find((l) => l.eventType === 'testArgs').msg
        expect(Object.keys(testArgs)).toStrictEqual([
          'variant',
          'libArg',
          'getTable',
          'gateways',
          'currentPath',
          'testNodeId',
        ])
        expect(testArgs.variant).toStrictEqual({ name: '1:365' })
        expect(testArgs.libArg).toStrictEqual('dummy')
        expect(
          testArgs.gateways['1:73: Any errors from backend'],
        ).toStrictEqual('no')
        const table = testArgs.getTable('9:415: My Table')
        expect(table.values).toStrictEqual([
          {
            Id: 'Line 1',
            First: 'AAAA',
            Second: 'BBBB',
          },
          {
            Id: 'Line 2',
            First: 'CCCC',
            Second: 'DDDD',
          },
        ])
        break
      case '78:1749: Call setup args': {
        expect(state.callMock).toHaveBeenNthCalledWith(1, 'setup', {
          ...expectedArgs,
          variant: expect.anything(),
        })
        break
      }
      case '78:1766: Call serviceCalls args serviceCallKey state': {
        expect(state.callMock).toHaveBeenNthCalledWith(2, 'serviceCall', {
          ...expectedArgs,
          variant: expect.anything(),
          key: '1:67: Get Data From Backend',
        })
        break
      }
      case '78:1798: Call start args state': {
        expect(state.callMock).toHaveBeenNthCalledWith(3, 'start', {
          ...expectedArgs,
          variant: expect.anything(),
        })
        break
      }
      case '78:1843: Call actions before tested node args actionKey state': {
        expect(state.callMock).toHaveBeenNthCalledWith(4, 'action', {
          ...expectedArgs,
          variant: expect.anything(),
          key: '1:235: action - Next Clicked',
        })
        break
      }
      case '78:1865: Call testNode args testNodeKey state Including scripts messages and unlinked subprocesses': {
        expect(state.callMock).toHaveBeenNthCalledWith(5, 'testNode', {
          ...expectedArgs,
          key: '1:365: Show Done',
          variant: expect.anything(),
        })
        break
      }
      case '78:1923: Call extraAction args state': {
        expect(state.callMock).toHaveBeenNthCalledWith(5, 'extraAction', {
          ...expectedArgs,
          variant: expect.anything(),
        })
        expect(state.callMock).toHaveBeenNthCalledWith(6, 'testNode', {
          ...expectedArgs,
          key: '1:365: Show Done',
          variant: expect.anything(),
        })
        break
      }
      case '136:823: Only paths with end': {
        const allPaths = state.log.find(
          (l) => l.eventType === 'discouragedFilterNodes',
        ).msg
        const pathsWithEndNode = state.log.find(
          (l) => l.eventType === 'pathsWithEndNode',
        ).msg
        expect(pathsWithEndNode.length).toBeLessThan(allPaths.length)
        break
      }
      case '136:833: Keep paths without end': {
        const allPaths = state.log.find(
          (l) => l.eventType === 'discouragedFilterNodes',
        ).msg
        const pathsWithEndNode = state.log.find(
          (l) => l.eventType === 'pathsWithEndNode',
        ).msg
        expect(pathsWithEndNode.length).toEqual(allPaths.length)
        break
      }
      case '170:822: Filter paths by filterPaths function':
        const aOrBGatewayPaths = state.log
          .find((l) => l.eventType === 'pathContainingNode')
          .msg.map((p) =>
            p
              .map((id) => state.testScraped.find((s) => s.id === id))
              .map((node, i, arr) => {
                let option = undefined
                if (arr[i + 1] && node.options) {
                  option = node.options[arr[i + 1].id]
                }
                return { ...node, option }
              })
              .filter((node) => node.option && node.text === 'A or B'),
          )
        for (const gateways of aOrBGatewayPaths) {
          const first = gateways[0].option
          gateways.forEach((gw) => expect(gw.option).toEqual(first))
        }
        break
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  variants: ({ matchId, autoVariants, id }) => {
    if (matchId('136:823: Only paths with end'))
      return [{ name: 'pathsWithEnd' }]
    // return autoVariants(id)
  },
}
