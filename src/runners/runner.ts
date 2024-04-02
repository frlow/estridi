import { findAllPaths } from '../utils/paths.js'
import { testedNodeTypes } from '../common.js'

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
    key: TServiceCallKey,
    gateways: Record<TGWKey, string>,
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys>
  ) => Promise<void>
  handleAction: (
    key: TActionKey,
    gateways: Record<TGWKey, string>,
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys>
  ) => Promise<void>
  handleTestNode: (
    key: TNodeKey,
    paths: string[],
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys>
  ) => Promise<void>
}

const getGateways = (pathToTest: any[]) =>
  pathToTest.reduce((acc, cur, i, arr) => {
    if (cur!.type !== 'gateway') return acc
    const next = arr[i + 1]
    const value: string = (cur!.connections as any)![next!.id as any]!
    acc[`${cur.id}: ${cur.text}`] = value
    return acc
  }, {} as Record<string, string>)

const runTest = async <TNodeTestArgs>(
  config: { args: TNodeTestArgs, handles: Handles, allPaths: string[][], scraped: any },
  id?: string,
  path?: string[]
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
    return relevantPaths[0]
  }

  const pathToTest = id ? findRelevantPath(id) : (path || [])
  const gateways = getGateways(pathToTest)
  const serviceCalls = pathToTest.filter((n: any) => n.type === 'serviceCall')
  const state = await handleSetup(config.args)
  const getTable = (key: string) =>
    config.scraped.find((n: any) => n.type === 'table' && `${n.id}: ${n.text}` === key)
  const args = { state, ...config.args, getTable }
  await Promise.all(
    serviceCalls.map((sc: any) =>
      handleServiceCall(`${sc.id}: ${sc.text}`, gateways, args)
    )
  )
  await handleStart(args)
  for (const node of pathToTest) {
    if (node!.type === 'signalListen')
      await handleAction(
        `${node!.id}: ${node!.text}`,
        gateways,
        args
      )
    else if (node!.id === id || (path && testedNodeTypes.includes(node.type)))
      await handleTestNode(
        `${node!.id}: ${node!.text}`,
        pathToTest.map((n: any) => n.text),
        args
      )
  }
}

export const createTester = (scraped: any, rootId: string, handles: Handles) => {
  const allPaths = findAllPaths(scraped, rootId, {})
  const testNode = (id: string, args?: any) => runTest({ allPaths, args, handles, scraped }, id)
  const testPath = (path: string[], args?: any) => runTest({ allPaths, args, handles, scraped }, undefined, path)
  return { allPaths, testNode, testPath }
}
