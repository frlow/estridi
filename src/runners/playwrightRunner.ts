import { findAllPaths } from '../utils/paths.js'

export type Scraped = any[]
export type Handles<
  TGWKey extends string = any,
  TServceCallKey extends string = any,
  TNodeKey extends string = any,
  TActionKey extends string = any
> = {
  handleSetup: (args: NodeTestArgs) => Promise<void>
  handleStart: (args: NodeTestArgs) => Promise<void>
  handleServiceCall: (
    key: TServceCallKey,
    gateways: Record<TGWKey, string>,
    args: NodeTestArgs
  ) => Promise<void>
  handleAction: (
    key: TActionKey,
    gateways: Record<TGWKey, string>,
    args: NodeTestArgs
  ) => Promise<void>
  handleTestNode: (
    key: TNodeKey,
    paths: string[],
    args: NodeTestArgs
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

export type NodeTestArgs = {
  page: any
  context: any
}

export const testAllPaths = (handles: Handles, test: (name: string, testFunc: (args: any) => Promise<void>) => void, scraped: any, rootId: string) => {
  const { handleTestNode, handleAction, handleStart, handleServiceCall, handleSetup } = handles
  const allPaths = findAllPaths(scraped, rootId)
  for (const path of allPaths) {
    test(
      path.map((id) => scraped.find((s: any) => s.id === id).text).join(', '),
      async ({ page, context }) => {
        const pathToTest = path.map((id) => scraped.find((s: any) => s.id === id))

        const gateways = getGateways(pathToTest)
        const serviceCalls = pathToTest.filter(
          (n: any) => n.type === 'serviceCall'
        )
        await handleSetup({ page, context })
        await Promise.all(
          serviceCalls.map((sc: any) =>
            handleServiceCall(`${sc.id}: ${sc.text}`, gateways, {
              context,
              page
            })
          )
        )
        await handleStart({ context, page })
        for (const node of pathToTest) {
          if (node!.type === 'signalListen')
            await handleAction(`${node!.id}: ${node!.text}`, gateways, { page, context })
          else if (['message', 'script', 'subprocess'].includes(node.type))
            await handleTestNode(
              `${node!.id}: ${node!.text}`,
              pathToTest.map((n: any) => n.text),
              { page, context }
            )
        }
      }
    )
  }
}

export const testNode = async (
  args: NodeTestArgs & { handles: Handles, allPaths: string[][], scraped: any },
  id: string
) => {
  const {
    handleTestNode,
    handleAction,
    handleStart,
    handleServiceCall,
    handleSetup
  } = args.handles
  const relevantPaths = args.allPaths
    .filter((paths) => paths.includes(id))
    .map((path) =>
      path.map((id) => args.scraped.find((s: any) => s.id === id))
    )
  const pathToTest = relevantPaths[0]
  const gateways = getGateways(pathToTest)
  const serviceCalls = pathToTest.filter((n: any) => n.type === 'serviceCall')
  await handleSetup(args)
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
    else if (node!.id === id)
      await handleTestNode(
        `${node!.id}: ${node!.text}`,
        pathToTest.map((n: any) => n.text),
        args
      )
  }
}

export const createTester = (handles: Handles, scraped: any, rootId: string) => {
  const allPaths = findAllPaths(scraped, rootId)
  const t = (id: string) =>
    async ({ page, context }: any) =>
      await testNode({ page, context, handles, scraped, allPaths }, id)
  const all = (testFunc: Parameters<typeof testAllPaths>[1]) => testAllPaths(handles, testFunc, scraped, rootId)
  return { t, all }
}
