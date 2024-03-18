import type { BrowserContext, Page } from '@playwright/test'
import scraped from './scraped.json'
import { findAllPaths } from '../utils/paths'

export type Handles = {
  handleStart: (args: NodeTestArgs) => Promise<void>,
  handleServiceCall: (serviceCallKey: string, gateways: any[], args: NodeTestArgs) => Promise<void>,
  handleAction: (args: NodeTestArgs, actionKey: string) => Promise<void>,
  handleTestNode: (args: NodeTestArgs, testNodeKey: string) => Promise<void>
}
const allPaths = findAllPaths(scraped)
const getGateways = (pathToTest: any[]) =>
  pathToTest.reduce((acc, cur, i, arr) => {
    if (cur!.type !== 'gateway') return acc
    const next = arr[i + 1]
    const value: string = (cur!.connections as any)![next!.id as any]!
    acc.push({ id: cur!.id, text: cur!.text, value })
    return acc
  }, [] as { id: string, text: string, value: string }[])

export type NodeTestArgs = {
  page: Page,
  context: BrowserContext
}
export const testNode = async (args: NodeTestArgs & { handles: Handles }, id: string) => {
  const { handleTestNode, handleAction, handleStart, handleServiceCall } = args.handles
  const relevantPaths = allPaths.filter(paths => paths.includes(id)).map(path => path.map(id => scraped.find(s => s.id === id)))
  const pathToTest = relevantPaths[0]
  const gateways = getGateways(pathToTest)
  const serviceCalls = pathToTest.filter((n: any) => n.type === 'serviceCall')
  await Promise.all(serviceCalls.map((sc: any) => handleServiceCall(`${sc.id}: ${sc.text}`, gateways, args)))
  await handleStart(args)
  for (const node of pathToTest) {
    if (node!.type === 'signalListen')
      await handleAction(args, `${node!.id}: ${node!.text}`)
    else if (node!.id === id)
      await handleTestNode(args, `${node!.id}: ${node!.text}`)
  }
}
