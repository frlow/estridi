import {Scraped, ScrapedStart} from "./scraped";

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
const getRealKey = (key: string) => key.split(': ')[0]
export type LogEventType =
    | "allPaths"
    | "pathContainingNode"
    | "viaFilteredNodes"
    | "discouragedFilterNodes"
    | "shortestPath"
export type LogFunc = (eventType: LogEventType, msg: any) => void
export const createTester = <THandles extends Handles>(scraped: Scraped, handles: THandles, log?: LogFunc) => {


  async function runTest({handles, args}: { args: any; handles: THandles }, id: string) {
    function findRelevantPath() {
      const getNode = (id: string) => scraped.find(n => n.id === id)
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
      log && log("pathContainingNode", pathsWithNode)
      const variant: Variant<any> = args.variant || {name: id}
      const via = variant?.via || []
      const viaFiltered = pathsWithNode.filter(p => via.every(v => p.includes(v)))
      log && log("viaFilteredNodes", viaFiltered)
      const discouraged = (handles.config?.discouragedNodes || []).map(d => getRealKey(d))
      const encouragedPaths = viaFiltered.filter(p => discouraged.every(d => !p.includes(d)))
      const encouragedFiltered = encouragedPaths.length > 0 ? encouragedPaths : viaFiltered
      log && log("discouragedFilterNodes", encouragedFiltered)
      const shortestPath = encouragedFiltered.toSorted((a, b) => a.length > b.length ? 0 : 1)[0]
      log && log("shortestPath", shortestPath)
      return shortestPath
    }

    const relevantPath = findRelevantPath()
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
