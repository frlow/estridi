import { findAllPaths } from '../utils/paths.js'

export type Table = {
  content: string[][],
  headers: string[],
  id: string,
  text: string,
}

export type HandleArgs<TState, TNodeTestArgs, TTableKeys> = TNodeTestArgs & {
  state: TState,
  getTable: (key: TTableKeys) => Table
}

export type Handles<
  TState = any,
  TGWKey extends string = any,
  TServiceCallKey extends string = any,
  TNodeKey extends string = any,
  TActionKey extends string = any,
  TNodeTestArgs = any,
  TTableKeys extends string = any
> = {
  handleSetup: (args: TNodeTestArgs) => Promise<TState>
  handleStart: (args: HandleArgs<TState, TNodeTestArgs, TTableKeys>) => Promise<void>
  handleServiceCall: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys> & {
      key: TServiceCallKey,
      gateways: Record<TGWKey, string>
    }
  ) => Promise<void>
  handleAction: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys> & {
      key: TActionKey,
      gateways: Record<TGWKey, string>
    }
  ) => Promise<void>
  handleTestNode: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys> & {
      key: TNodeKey,
      gateways: Record<TGWKey, string>
      paths: string[],
    }
  ) => Promise<void>
  filterPaths?: (allPaths: string[][], scraped: any[]) => string[][]
  variants?: (id: string) => string[]
}

const getGateways = (pathToTest: any[]) =>
  pathToTest.reduce((acc, cur, i, arr) => {
    if (cur!.type !== 'gateway') return acc
    const next = arr[i + 1]
    const value: string = (cur!.connections as any)![next!.id as any]!
    acc[`${cur.id}: ${cur.text}`] = value
    return acc
  }, {} as Record<string, string>)

export const runTest = async <TNodeTestArgs>(
  config: { args: TNodeTestArgs, handles: Handles, allPaths: string[][], scraped: any },
  id: string
) => {
  const {
    handleTestNode,
    handleAction,
    handleStart,
    handleServiceCall,
    handleSetup
  } = config.handles
  const findRelevantPath = (id: string) => {
    const relevantPaths = config.allPaths
      .filter((paths) => paths.includes(id))
      .map((path) =>
        path.map((id) => config.scraped.find((s: any) => s.id === id))
      )
    return relevantPaths.reduce((acc, cur) => cur.length < acc.length ? cur : acc, relevantPaths[0])
  }

  const pathToTest = findRelevantPath(id)
  const gateways = getGateways(pathToTest)
  const serviceCalls = pathToTest.filter((n: any) => n.type === 'serviceCall')
  const state = await handleSetup(config.args)
  const getTable = (key: string) =>
    config.scraped.find((n: any) => n.type === 'table' && `${n.id}: ${n.text}` === key)
  const args = { state, ...config.args, getTable, gateways }
  await Promise.all(
    serviceCalls.map((sc: any) =>
      handleServiceCall({ ...args, key: `${sc.id}: ${sc.text}` })
    )
  )
  await handleStart(args)
  for (const node of pathToTest) {
    if (node!.type === 'signalListen')
      await handleAction(
        { ...args, key: `${node!.id}: ${node!.text}` })
    else if (node!.id === id) {
      await handleTestNode(
        { ...args, key: `${node!.id}: ${node!.text}`, path: pathToTest.map((n: any) => n.text) }
      )
      if (!!node!.id) return
    }
  }
}

export const createTester = (scraped: any, rootId: string, handles: Handles) => {
  const allPathsUnfiltered = findAllPaths(scraped, rootId)
  const allPaths = handles.filterPaths ? handles.filterPaths(allPathsUnfiltered, scraped) : allPathsUnfiltered
  const testNode = (id: string, args?: any) => runTest({ allPaths, args, handles, scraped }, id)
  return { testNode }
}
