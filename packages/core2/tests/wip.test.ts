import { describe, expect, suite, test, vi } from 'vitest'
import { handles } from './wip'

const testOrder = async (gateways: any, spies: Spy[]) => {
  const state = await handles.setup({ gateways })
  await handleServiceCalls({ gateways, state })
  await handles.start({ gateways, state })
  await expectCallsInOrder(spies)
}

export type Spy = ReturnType<typeof vi.spyOn>

describe('wip', () => {
  describe('paths', () => {
    describe('root', () => {
      test('root', async () =>
        testOrder({}, [handles.nodeFunctionMappings.root_wip]))
      describe('Load Scraped', () => {
        test('Load Scraped', async () =>
          testOrder({}, [
            handles.nodeFunctionMappings.root_wip,
            handles.nodeFunctionMappings.subprocess_loadScraped,
          ]))
        describe('Process Figma', () => {
          test('Process Figma', async () =>
            testOrder({}, [
              handles.nodeFunctionMappings.root_wip,
              handles.nodeFunctionMappings.subprocess_loadScraped,
              handles.nodeFunctionMappings.subprocess_processFigma,
            ]))
          test('Load From Figma API', async () =>
            testOrder({}, [
              handles.nodeFunctionMappings.root_wip,
              handles.nodeFunctionMappings.subprocess_loadScraped,
              handles.nodeFunctionMappings.subprocess_processFigma,
              handles.nodeFunctionMappings.serviceCall_loadFromFigmaAPI,
            ]))
        })
      })
    })
  })

  describe('unit tests', () => {
    test('root_wip', () =>
      handles.test_root_wip(
        getImplementation(handles.nodeFunctionMappings.root_wip),
      ))
    test('subprocess_loadScraped', () =>
      handles.test_subprocess_loadScraped(
        getImplementation(handles.nodeFunctionMappings.subprocess_loadScraped),
      ))
    test('subprocess_processFigma', () =>
      handles.test_subprocess_processFigma(
        getImplementation(handles.nodeFunctionMappings.subprocess_processFigma),
      ))
    test('serviceCall_loadFromFigmaAPI', () =>
      handles.test_loadFromFigmaAPI(
        getImplementation(
          handles.nodeFunctionMappings.serviceCall_loadFromFigmaAPI,
        ),
      ))
    describe('Parse Figma To Scraped', () => {
      test('message', () => {
        handles.test_subprocess_parseFigmaToScraped(
          getImplementation(
            handles.nodeFunctionMappings.subprocess_parseFigmaToScraped,
          ),
            {
              Id: 'message',
              Properties: '',
            },
        )
      })

      test('script', () => {
        handles.test_subprocess_parseFigmaToScraped(
            getImplementation(
                handles.nodeFunctionMappings.subprocess_parseFigmaToScraped,
            ),
            {
              Id: 'script',
              Properties: '',
            },
        )
      })

      // ... rest of node types
    })
  })
})

export type Wip = {
  setup: (args: { gateways: Record<string, string> }) => Promise<any>
  start: (args: {
    gateways: Record<string, string>
    state: any
  }) => Promise<void>
  test_root_wip: (func: Function) => Promise<void>
  test_subprocess_loadScraped: (func: Function) => Promise<void>
  test_subprocess_processFigma: (func: Function) => Promise<void>
  test_loadFromFigmaAPI: (func: Function) => Promise<void>
  test_subprocess_parseFigmaToScraped: (
    func: Function,
    tableRow?: Record<string, string>,
  ) => Promise<void>
  serviceCall_loadFromFigmaApi: (args: {
    gateways: Record<string, string>
    state: any
    spy: Spy
  }) => Promise<void>

  nodeFunctionMappings: {
    root_wip: Spy
    subprocess_loadScraped: Spy
    subprocess_processFigma: Spy
    serviceCall_loadFromFigmaAPI: Spy
    subprocess_parseFigmaToScraped: Spy
  }
}

const getImplementation = (spy: Spy) =>
  spy[Object.getOwnPropertySymbols(spy)[0]].impl

const handleServiceCalls = async (args: {
  gateways: Record<string, string>
  state: any
}) => {
  await handles.serviceCall_loadFromFigmaApi({
    ...args,
    spy: handles.nodeFunctionMappings.serviceCall_loadFromFigmaAPI,
  })
}

const expectCallsInOrder = async (calls: Spy[]) => {
  calls.reduce((acc, cur) => {
    expect(
      cur.mock.invocationCallOrder.length,
      `Function: ${cur.getMockName()} has not been called`,
    ).toBeGreaterThan(0)
    expect(
      cur.mock.invocationCallOrder[0],
      `Function: ${cur.getMockName()} called in wrong order`,
    ).toBeGreaterThan(acc)
    return cur.mock.invocationCallOrder[0]
  }, 0)
}
