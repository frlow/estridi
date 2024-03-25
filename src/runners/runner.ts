import { findAllPaths } from '../utils/paths.js'
import { testedNodeTypes } from '../common.js'

export type Handles<
  TState = any,
  TGWKey extends string = any,
  TServceCallKey extends string = any,
  TNodeKey extends string = any,
  TActionKey extends string = any,
  TNodeTestArgs = any
> = {
  handleSetup: (args: TNodeTestArgs) => Promise<TState>
  handleStart: (args: TNodeTestArgs & { state: TState }) => Promise<void>
  handleServiceCall: (
    key: TServceCallKey,
    gateways: Record<TGWKey, string>,
    args: TNodeTestArgs & { state: TState }
  ) => Promise<void>
  handleAction: (
    key: TActionKey,
    gateways: Record<TGWKey, string>,
    args: TNodeTestArgs & { state: TState }
  ) => Promise<void>
  handleTestNode: (
    key: TNodeKey,
    paths: string[],
    args: TNodeTestArgs & { state: TState }
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
  await handleSetup(config.args)
  await Promise.all(
    serviceCalls.map((sc: any) =>
      handleServiceCall(`${sc.id}: ${sc.text}`, gateways, config.args)
    )
  )
  await handleStart(config.args)
  for (const node of pathToTest) {
    if (node!.type === 'signalListen')
      await handleAction(
        `${node!.id}: ${node!.text}`,
        gateways,
        config.args
      )
    else if (node!.id === id || (path && testedNodeTypes.includes(node.type)))
      await handleTestNode(
        `${node!.id}: ${node!.text}`,
        pathToTest.map((n: any) => n.text),
        config.args
      )
  }
}

export const createTester = (scraped: any, rootId: string, handles: Handles) => {
  const allPaths = findAllPaths(scraped, rootId)
  const testNode = (id: string, args?: any) => runTest({ allPaths, args, handles, scraped }, id)
  const testPath = (path: string[], args?: any) => runTest({ allPaths, args, handles, scraped }, undefined, path)
  return { allPaths, testNode, testPath }
}
