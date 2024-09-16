import {Scraped, ScrapedGateway, ScrapedNode, ScrapedStart, ScrapedTable, ScrapedUserAction} from "./scraped";

export type HandleArgs<TState, TNodeTestArgs, TTableKeys> = TNodeTestArgs & {
  state: TState,
  getTable: (key: TTableKeys) => Table
  variant: Variant<any>
}

export type Variant<T> = {
  name: string,
  via?: T[],
  data?: any,
  customTest?: (config: any, id: string) => Promise<void>,
  extraAction?: (config: any) => Promise<void>
}

export type Table = {
  content: string[][],
  values: Record<string, string>[]
  headers: string[],
  id: string,
  text: string,
  signature: string
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
  handleSetup: (args: TNodeTestArgs & { variant: Variant<any> }) => Promise<TState>
  handleStart: (args: HandleArgs<TState, TNodeTestArgs, TTableKeys> & {
    gateways: Record<TGWKey, string>
  }) => Promise<void>
  handleServiceCall: (
      args: HandleArgs<TState, TNodeTestArgs, TTableKeys> & {
        key: TServiceCallKey,
        gateways: Record<TGWKey, string>
        inputs: string
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
        path: string[],
      }
  ) => Promise<void>
  filterPaths?: (args: {
    allPaths: string[][],
    scraped: Scraped
    getGateways: (currentPath: string[]) => { text: string, id: string, value: string }[]
  }) => string[][]
  variants?: (args: {
    id: string,
    // scraped: Scraped,
    matchId: (key: TNodeKey) => boolean
    getTable: (id: TTableKeys) => Table
  }) => Variant<TTableKeys | TActionKey | TNodeKey | TServiceCallKey | TGWKey>[] | undefined
  config?: {
    discouragedNodes?: (TActionKey | TNodeKey | TServiceCallKey | TGWKey)[]
  }
}
export const createTable = ({rows, id, text}: ScrapedTable): Table => {
  const headers = rows[0]
  const content = rows.slice(1)
  return {
    text,
    id,
    headers,
    content,
    get values() {
      return content.map(row => headers.slice(1).reduce((acc, cur) => {
        const index = headers.indexOf(cur)
        acc[cur] = row[index]
        return acc
      }, {Id: row[0]} as Record<string, string>))
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
            ...content.map((line) => line.map((v) => hashCode(v)).join('|'))
          ].join('\n') +
          '\n'
      )
    }
  }
}

const getRealKey = (key: string) => key.split(': ')[0]
export type LogEventType =
    | "allPaths"
    | "pathContainingNode"
    | "viaFilteredNodes"
    | "discouragedFilterNodes"
    | "shortestPath"
    | "testArgs"
export type LogFunc = (eventType: LogEventType, msg: any) => void
export const getKey = (node: ScrapedNode) => `${node.id}: ${node.text}`
export const createTester = <THandles extends Handles>(scraped: Scraped, handles: THandles, log?: LogFunc) => {


  async function runTest({handles, args}: { args: any; handles: THandles }, id: string) {
    const variant: Variant<any> = args.variant || {name: id}
    const getNode = (id: string) => scraped.find(n => n.id === id)
    const getTable = (key: string) =>
        createTable(scraped.find((n) => n.type === 'table' && `${n.id}: ${n.text}` === key) as ScrapedTable)

    function findRelevantPath() {
      const rootId = scraped.find((n: ScrapedStart) => n.isRoot).id
      const getNext = (node: any): string[] => [
        node.next,
        ...(Object.keys(node.options || {})),
        ...(Object.keys(node.actions || {})),
        node.link
      ].filter(n => n)
      const toProcess: string[][] = [[rootId]]
      const paths: string[][] = []
      while (toProcess.length > 0) {
        const currentPath = toProcess.pop()
        const currentNode = getNode(currentPath[currentPath.length - 1])
        const currentNext = getNext(currentNode)
        if (currentNext.length === 0) paths.push(currentPath)
        else {
          toProcess.push(...currentNext.map(c => ([...currentPath, c])))
        }
      }
      log && log("allPaths", paths)
      const pathsWithNode = paths.filter(p => p.includes(id))
      if (pathsWithNode.length === 0) throw `No paths containing node: ${id}`
      log && log("pathContainingNode", pathsWithNode)
      const via = variant?.via || []
      const viaFiltered = pathsWithNode.filter(p => via.every(v => p.includes(v)))
      if (viaFiltered.length === 0) throw `No paths containing all via nodes: ${via.join(", ")}`
      log && log("viaFilteredNodes", viaFiltered)
      const discouraged = (handles.config?.discouragedNodes || []).map(d => getRealKey(d))
      const encouragedPaths = viaFiltered.filter(p => discouraged.every(d => !p.includes(d)))
      const encouragedFiltered = encouragedPaths.length > 0 ? encouragedPaths : viaFiltered
      log && log("discouragedFilterNodes", encouragedFiltered)
      const shortestPath = encouragedFiltered.toSorted((a, b) => a.length > b.length ? 0 : 1)[0]
      log && log("shortestPath", shortestPath)
      return shortestPath
    }

    if (variant.customTest) {
      await variant.customTest({args}, id)
      return
    }
    const relevantPath = findRelevantPath()
    const nodePath = relevantPath.map(id => scraped.find(n => n.id === id))
    const gateways = nodePath.reduce((acc, cur: ScrapedGateway, i, arr) => {
      if (cur.options)
        acc[`${cur.id}: ${cur.text}`] = cur.options[arr[i + 1].id]
      return acc
    }, {})
    const testArgs = {variant, ...args, getTable, gateways}
    log && log("testArgs", testArgs)
    await handles.handleSetup(testArgs)
    const serviceCalls = nodePath.filter(n => n.type === "serviceCall")
    for (const serviceCall of serviceCalls)
      await handles.handleServiceCall({...testArgs, key: getKey(serviceCall)})
    await handles.handleStart(testArgs)
    const testNode = nodePath.find(n => n.id === id)
    const actions = nodePath.filter((n, i, arr) => i < arr.indexOf(testNode) && n.type === "userAction") as ScrapedUserAction[]
    for (const action of actions) {
      const next = nodePath[nodePath.indexOf(action) + 1]
      const actionTaken = action.actions[next.id]
      const key = `${action.id}: ${action.text} - ${actionTaken}`
      await handles.handleAction({...testArgs, key})
    }
    if (variant.extraAction) await variant.extraAction(testArgs)
    await handles.handleTestNode({...testArgs, key: getKey(testNode)})
  }

  function getTable(key: string) {
    return undefined;
  }

  const testNode = (id: string, args?: any) => runTest({args, handles}, id)

  const getVariants: (id: string) => Variant<any>[] = (id) =>
      handles.variants ? handles.variants({
        id,
        getTable: (key: string) => getTable(key),
        matchId: (key: string) => key.includes(id),
      }) || [{name: id}] : [{name: id}]
  return {testNode, getVariants}
}

// TODO: matchId
// TODO: getTable
