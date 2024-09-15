import {Scraped} from "./scraped";

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

function getTable(id: any, scraped: Scraped): Table {
  debugger
  throw "Not implemented"
}

export const createTester = <THandles extends Handles>(scraped: Scraped, handles: THandles) => {
  function runTest({handles, args}: { args: any; handles: THandles }, id: string) {
    const relevantPath = []
    debugger
    throw "Not implemented!"
  }

  const testNode = (id: string, args?: any) => runTest({args, handles}, id)

  const getVariants: (id: string) => Variant<any>[] = (id) =>
      handles.variants ? handles.variants({
        id,
        getTable: (key: string) => getTable(key, scraped),
        matchId: (key: string) => key.includes(id),
      }) || [{name: id}] : [{name: id}]
  return {testNode, getVariants}
}

// TODO: matchId
// TODO: getTable
