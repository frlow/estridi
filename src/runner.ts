import {
  Scraped,
  ScrapedGateway,
  ScrapedNode,
  ScrapedStart,
  ScrapedTable,
  ScrapedUserAction,
} from './scraped.js'

export * from './scraped.js'

export type HandleArgs<
  TState,
  TNodeTestArgs,
  TTableKeys,
  TGWKey extends string,
  TNodeKey extends string,
> = TNodeTestArgs & {
  state: TState
  getTable: (key: TTableKeys) => Table
  variant: Variant<any>
  gateways: Record<TGWKey, string>
  testNodeId: TNodeKey
  currentPath: string[]
}

export type Variant<T> = {
  name: string
  via?: T[]
  data?: any
  customTest?: (config: any, id: string) => Promise<void>
  extraAction?: (config: any) => Promise<void>
}

export type Table = {
  content: string[][]
  values: Record<string, string>[]
  headers: string[]
  id: string
  text: string
  signature: string
}

export type Handles<
  TState = any,
  TGWKey extends string = any,
  TServiceCallKey extends string = any,
  TNodeKey extends string = any,
  TActionKey extends string = any,
  TNodeTestArgs = any,
  TTableKeys extends string = any,
> = {
  handleSetup: (
    args: TNodeTestArgs & {
      variant: Variant<any>
      gateways: Record<TGWKey, string>
      testNodeId: TNodeKey
      currentPath: string[]
    },
  ) => Promise<TState>
  handleStart: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys, TGWKey, TNodeKey>,
  ) => Promise<void>
  handleServiceCall: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys, TGWKey, TNodeKey> & {
      key: TServiceCallKey
      inputs: string
    },
  ) => Promise<void>
  handleAction: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys, TGWKey, TNodeKey> & {
      key: TActionKey
    },
  ) => Promise<void>
  handleTestNode: (
    args: HandleArgs<TState, TNodeTestArgs, TTableKeys, TGWKey, TNodeKey> & {
      key: TNodeKey
      path: string[]
    },
  ) => Promise<void>
  filterPath?: (args: {
    hasConflict: (path: string[], gatewayText: string) => boolean
    path: string[]
  }) => boolean
  variants?: (args: {
    id: string
    matchId: (key: TNodeKey) => boolean
    getTable: (id: TTableKeys) => Table
    autoVariants: (
      id: string,
    ) => Variant<
      TTableKeys | TActionKey | TNodeKey | TServiceCallKey | TGWKey
    >[]
  }) =>
    | Variant<TTableKeys | TActionKey | TNodeKey | TServiceCallKey | TGWKey>[]
    | undefined
  config?: {
    discouragedNodes?: (TActionKey | TNodeKey | TServiceCallKey | TGWKey)[]
  }
}
export const createTable = ({ rows, id, text }: ScrapedTable): Table => {
  const headers = rows[0]
  const content = rows.slice(1)
  return {
    text,
    id,
    headers,
    content,
    get values() {
      return content.map((row) =>
        headers.slice(1).reduce(
          (acc, cur) => {
            const index = headers.indexOf(cur)
            acc[cur] = row[index]
            return acc
          },
          { Id: row[0] } as Record<string, string>,
        ),
      )
    },
    get signature() {
      function hashCode(str: string) {
        let hash = 0
        for (let i = 0, len = str.length; i < len; i++) {
          let chr = str.charCodeAt(i)
          hash = (hash << 5) - hash + chr
          hash |= 0 // Convert to 32bit integer
        }
        return Math.abs(hash).toString().substring(0, 4).padStart(4, '0')
      }

      return (
        '\n' +
        [
          headers.map((h) => hashCode(h)).join('|'),
          ...content.map((line) => line.map((v) => hashCode(v)).join('|')),
        ].join('\n') +
        '\n'
      )
    },
  }
}

const getRealKey = (key: string) => key.split(': ')[0]
export type LogEventType =
  | 'allPaths'
  | 'pathContainingNode'
  | 'viaFilteredNodes'
  | 'discouragedFilterNodes'
  | 'pathsWithEndNode'
  | 'shortestPath'
  | 'testArgs'
export type LogFunc = (eventType: LogEventType, msg: any) => void
export const getKey = (node: ScrapedNode) => `${node.id}: ${node.text}`
export const createTester = <THandles extends Handles>(
  scraped: Scraped,
  handles: THandles,
  log?: LogFunc,
) => {
  const getNode = (id: string) => scraped.find((n) => n.id === id)

  function findRelevantPath(id: string, via: string[]) {
    const possiblePaths = findPossiblePaths(id, via)
    // Find the shortest path remaining
    const shortestPath = possiblePaths.reduce(
      (acc, cur) => (!acc || cur.length < acc.length ? cur : acc),
      undefined,
    )
    log && log('shortestPath', shortestPath)
    return shortestPath
  }

  function findPossiblePaths(id: string, via: string[]) {
    const rootId = scraped.find((n: ScrapedStart) => n.isRoot).id
    const getNext = (node: any): string[] =>
      [
        node.next,
        ...Object.keys(node.options || {}),
        ...Object.keys(node.actions || {}),
        node.link,
      ].filter((n) => n)
    const toProcess: string[][] = [[rootId]]

    // Find all paths
    const paths: string[][] = []
    while (toProcess.length > 0) {
      const currentPath = toProcess.pop()
      const currentNode = getNode(currentPath[currentPath.length - 1])
      const currentNext = getNext(currentNode).filter(
        (id) => !currentPath.includes(id),
      )
      if (currentNext.length === 0) paths.push(currentPath)
      else {
        toProcess.push(...currentNext.map((c) => [...currentPath, c]))
      }
    }
    log && log('allPaths', paths)

    // Filter paths using filterPaths function
    const hasConflict = (path: string[], gatewayText: string): boolean => {
      const gateways = path
        .map((id) => getNode(id))
        .filter((node) => node.type === 'gateway' && node.text === gatewayText)
      if (gateways.length === 0) return false
      const values = gateways.map(
        (gw: ScrapedGateway) => gw.options[path[path.indexOf(gw.id) + 1]],
      )
      return values.some((value) => value !== values[0])
    }
    const manuallyFilteredPaths = handles.filterPath
      ? paths.filter((p) => handles.filterPath({ path: p, hasConflict }))
      : paths

    // Find all paths containing current id
    const pathsWithNode = manuallyFilteredPaths.filter((p) => p.includes(id))
    if (pathsWithNode.length === 0) throw `No paths containing node: ${id}`
    log && log('pathContainingNode', pathsWithNode)

    // Find all paths containing all via nodes from variant
    // const via = variant?.via || []
    const viaFiltered = pathsWithNode.filter((p) =>
      via.every((v) => p.includes(getRealKey(v))),
    )
    if (viaFiltered.length === 0)
      throw `No paths containing all via nodes: ${via.join(', ')}`
    log && log('viaFilteredNodes', viaFiltered)

    // Find all paths that does not include any of the discouraged nodes
    // If no such paths exist include discouraged nodes
    const discouraged = (handles.config?.discouragedNodes || []).map((d) =>
      getRealKey(d),
    )
    const encouragedPaths = viaFiltered.filter((p) =>
      discouraged.every((d) => !p.includes(d)),
    )
    const encouragedFiltered =
      encouragedPaths.length > 0 ? encouragedPaths : viaFiltered
    log && log('discouragedFilterNodes', encouragedFiltered)

    // Filter paths containing end nodes
    // If no such paths exist include paths without end nodes
    const pathsWithEndNode = encouragedFiltered
      .map((path) => path.map((id) => getNode(id)))
      .filter((path) => path.some((n) => n.type === 'end'))
      .map((path) => path.map((n) => n.id))
    const pathsWithEndNodeFiltered =
      pathsWithEndNode.length > 0 ? pathsWithEndNode : encouragedFiltered
    log && log('pathsWithEndNode', pathsWithEndNodeFiltered)
    return pathsWithEndNodeFiltered
  }

  async function runTest(
    { handles, args }: { args: any; handles: THandles },
    id: string,
  ) {
    const variant: Variant<any> = args.variant || { name: id }
    const getTable = (key: string) =>
      createTable(
        scraped.find(
          (n) => n.type === 'table' && `${n.id}: ${n.text}` === key,
        ) as ScrapedTable,
      )

    if (variant.customTest) {
      await variant.customTest({ args }, id)
      return
    }
    const relevantPath = findRelevantPath(id, variant?.via || [])
    const nodePath = relevantPath.map((id) => scraped.find((n) => n.id === id))
    const gateways = nodePath.reduce((acc, cur: ScrapedGateway, i, arr) => {
      if (cur.options)
        acc[`${cur.id}: ${cur.text}`] = cur.options[arr[i + 1].id]
      return acc
    }, {})
    const testArgs = {
      variant,
      ...args,
      getTable,
      gateways,
      currentPath: relevantPath,
      testNodeId: id,
    }
    log && log('testArgs', testArgs)
    const state = await handles.handleSetup(testArgs)
    const serviceCalls = nodePath.filter((n) => n.type === 'serviceCall')
    for (const serviceCall of serviceCalls)
      await handles.handleServiceCall({
        ...testArgs,
        key: getKey(serviceCall),
        state,
      })
    await handles.handleStart({ ...testArgs, state })
    const testNode = nodePath.find((n) => n.id === id)
    const actions = nodePath.filter(
      (n, i, arr) => i < arr.indexOf(testNode) && n.type === 'userAction',
    ) as ScrapedUserAction[]
    for (const action of actions) {
      const next = nodePath[nodePath.indexOf(action) + 1]
      const actionTaken = action.actions[next.id]
      const key = `${action.id}: ${action.text} - ${actionTaken}`
      await handles.handleAction({ ...testArgs, key, state })
    }
    if (variant.extraAction) await variant.extraAction({ ...testArgs, state })
    await handles.handleTestNode({ ...testArgs, key: getKey(testNode), state })
  }

  const getTable = (key: string) =>
    createTable(
      scraped.find(
        (n: any) => n.type === 'table' && `${n.id}: ${n.text}` === key,
      ) as ScrapedTable,
    )
  const testNode = (id: string, args?: any) => runTest({ args, handles }, id)

  const getVariants: (id: string) => Variant<any>[] = (id) => {
    const autoVariants = (id: string): Variant<any>[] => {
      const paths = Object.keys(
        findPossiblePaths(id, [])
          .map((path) => path.slice(0, path.indexOf(id)).join(','))
          .reduce((acc, cur) => ({ ...acc, [cur]: true }), {}),
      ).map((path) => path.split(','))
      return paths.map((path, i) => ({ name: `Auto: ${i}`, via: path }))
    }
    //
    return handles.variants
      ? handles.variants({
          id,
          getTable: (key: string) => getTable(key),
          matchId: (key: string) => key.includes(id),
          autoVariants,
        }) || [{ name: id }]
      : [{ name: id }]
  }

  return { testNode, getVariants, getTable }
}
