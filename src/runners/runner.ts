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
}

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
  variant: string
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
  handleSetup: (args: TNodeTestArgs & { variant: string }) => Promise<TState>
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
      path: string[],
    }
  ) => Promise<void>
  filterPaths?: (args: {
    allPaths: string[][],
    scraped: any[]
    getGateways: (currentPath: string[]) => { text: string, id: string, value: string }[]
  }) => string[][]
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
  const getTable = (key: string) => createTable(config.scraped.find((n: any) => n.type === 'table' && `${n.id}: ${n.text}` === key))
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
  return { testNode }
}

export const loadScraped: () => Scraped = () => JSON.parse(fs.readFileSync(`./tests/${scrapedFile}`, 'utf8'))
