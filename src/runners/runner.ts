import { findAllPaths } from '../utils/paths.js'
import * as fs from 'node:fs'
import { scrapedFile } from '../common.js'

export type Scraped = {
  type: string
  text: string
  connections: Record<string, string>
  id: string
  actions?: string[]
  linked?: string
  headers?: string[]
  content?: string[][]
}[]

export type Table = {
  content: string[][],
  values: Record<string, string>[]
  headers: string[],
  id: string,
  text: string,
  signature: string
}

export type HandleArgs<TState, TNodeTestArgs, TTableKeys> = TNodeTestArgs & {
  state: TState,
  getTable: (key: TTableKeys) => Table
  variant: Variant<any>
}

export type Variant<T> = {
  name: string,
  via?: T[],
  data?: any,
  skipped?: boolean,
  customTest?: (config: any, id: string) => Promise<void>,
  extraAction?: (config: any) => Promise<void>
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
  handleStart: (args: HandleArgs<TState, TNodeTestArgs, TTableKeys>) => Promise<void>
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
    scraped: Scraped,
    matchId: (key: TNodeKey) => boolean
    getTable: (id: TTableKeys) => Table
  }) => Variant<TTableKeys | TActionKey | TNodeKey | TServiceCallKey | TGWKey>[] | undefined
  config?: {
    discouragedNodes?: (TActionKey | TNodeKey | TServiceCallKey | TGWKey)[]
  }
}

const getGateways = (pathToTest: any[]) =>
  pathToTest.reduce((acc, cur, i, arr) => {
    if (cur!.type !== 'gateway') return acc
    const next = arr[i + 1]
    const value: string = (cur!.connections as any)![next!.id as any]!
    acc[`${cur.id}: ${cur.text}`] = value
    return acc
  }, {} as Record<string, string>)

export const createTable = (rawTable: Omit<Table, 'values' | 'signature'>): Table => {
  return {
    ...rawTable,
    get values() {
      return rawTable.content.map(row => rawTable.headers.slice(1).reduce((acc, cur) => {
        const index = rawTable.headers.indexOf(cur)
        acc[cur] = row[index]
        return acc
      }, { Id: row[0] } as Record<string, string>))
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
          rawTable.headers.map((h) => hashCode(h)).join('|'),
          ...rawTable.content.map((line) => line.map((v) => hashCode(v)).join('|'))
        ].join('\n') +
        '\n'
      )
    }
  }
}

export const getTable = (key: string, scraped: any) => createTable(scraped.find((n: any) => n.type === 'table' && `${n.id}: ${n.text}` === key))
const getRealKey = (key: string) => key.split(': ')[0]
type Config = { args: any, handles: Handles, allPaths: string[][], scraped: any }
const findRelevantPath = (ids: string[], config: Config) => {
  const relevantPaths = config.allPaths
    .filter((path) => ids.every((id) => {
      return path.includes(id);
    }))
    .map((path) => path.map((id) => config.scraped.find((s: any) => s.id === id)));
  const discouragedIds = (config.handles.config?.discouragedNodes || []).map(d=>getRealKey(d))
  const encouraged = relevantPaths.filter(rp=>!rp.some(p=>{
    return discouragedIds.includes(p.id)
  }))
  const temp = encouraged.length > 0 ? encouraged : relevantPaths
  return temp.reduce((acc, cur) => cur.length < acc.length ? cur : acc, temp[0]);
}

export const runTest = async (
  config: Config,
  id: string
) => {
  const {
    handleTestNode,
    handleAction,
    handleStart,
    handleServiceCall,
    handleSetup
  } = config.handles
  if (config.args.variant.skipped) return
  if (config.args.variant.customTest) {
    await config.args.variant.customTest(config, id)
    return
  }

  const viaKeys = (config.args.variant.via || []).map((via: string) => getRealKey(via))
  const pathToTest = findRelevantPath([id, ...viaKeys], config)
  if (!pathToTest) throw 'No possible path found that satisfies \'id\' and \'via\''
  const gateways = getGateways(pathToTest)

  // Running setup step
  const state = await handleSetup(config.args)

  const args = { state, ...config.args, getTable: (key: string) => getTable(key, config.scraped), gateways }

  const serviceCalls = pathToTest.filter((n: any) => n.type === 'serviceCall')
  await Promise.all(
    serviceCalls.map((sc: any) =>
      // Mocking service calls
      handleServiceCall({ ...args, key: `${sc.id}: ${sc.text}`, inputs: sc.inputs.join(' ') })
    )
  )

  // Running start step
  await handleStart(args)

  for (const node of pathToTest) {
    if (node!.type === 'signalListen')
      // Handle Action
      await handleAction(
        { ...args, key: `${node!.id}: ${node!.text}` })
    else if (node!.id === id) {
      // Handle Node Test
      if (config.args.variant.extraAction)
        await config.args.variant.extraAction(config)
      await handleTestNode(
        { ...args, key: `${node!.id}: ${node!.text}`, path: pathToTest.map((n: any) => n.text) }
      )
      if (!!node!.id) return state
    }
  }
  return state
}

export const createTester = <THandles extends Handles>(scraped: any, rootId: string, handles: THandles) => {
  const allPathsUnfiltered = findAllPaths(scraped, rootId)
  const getGateways: (currentPath: string[]) => {
    text: string,
    id: string,
    value: string
  }[] = (currentPath) => currentPath.map((id) => scraped.find((n: any) => n.id === id))
    .reduce((acc, n, index, arr) => {
      if (n.type !== 'gateway') return acc
      return [...acc, {
        text: n.text,
        id: n.id,
        value: n.connections[arr[index + 1].id]
      }]
    }, [])
  const allPaths = handles.filterPaths ? handles.filterPaths({
    allPaths: allPathsUnfiltered,
    scraped,
    getGateways
  }) : allPathsUnfiltered
  const testNode = (id: string, args?: any) => runTest({ allPaths, args, handles, scraped }, id)
  const getVariants: (id: string) => Variant<any>[] = (id) =>
    handles.variants ? handles.variants({
      scraped,
      id,
      matchId: (key: string) => key.includes(id),
      getTable: (id: string) => getTable(id, scraped)
    }) || [{ name: id }] : [{ name: id }]
  return { testNode, getVariants }
}

export const loadScraped: () => Scraped = () => JSON.parse(fs.readFileSync(`./tests/${scrapedFile}`, 'utf8'))
