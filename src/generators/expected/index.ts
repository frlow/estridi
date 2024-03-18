import type { BrowserContext, Page } from '@playwright/test'
import scraped from './scraped.json'
import { findAllPaths } from '../utils/paths'

const allPaths = findAllPaths(scraped)


const getGateways = (pathToTest: any[]) =>
  pathToTest.reduce((acc, cur, i, arr) => {
    if (cur!.type !== 'gateway') return acc
    const next = arr[i + 1]
    const value: string = (cur!.connections as any)![next!.id as any]!
    acc.push({ id: cur!.id, text: cur!.text, value })
    return acc
  }, [] as { id: string, text: string, value: string }[])

type NodeTestArgs = {
  page: Page,
  context: BrowserContext
}
export const testNode = async (args: NodeTestArgs, id: string) => {
  const relevantPaths = allPaths.filter(paths => paths.includes(id)).map(path => path.map(id => scraped.find(s => s.id === id)))
  const pathToTest = relevantPaths[0]
  const gateways = getGateways(pathToTest)
  const serviceCalls = pathToTest.filter((n: any) => n.type === 'serviceCall')
  await Promise.all(serviceCalls.map(sc => handleServiceCall(sc, gateways, args)))
  await handleStart(args)
  for (const node of pathToTest) {
    if (node!.type === 'signalListen')
      await handleAction(args, node!.id)
    else if (node!.id === id)
      await handleTestNode(args, id)
  }
}

export const handleStart = async (args: NodeTestArgs) => {
  console.log('start')
}

export const handleServiceCall = async (serviceCall: any, gateways: any[], args: NodeTestArgs) => {
  console.log(serviceCall, gateways)
}

export const handleAction = async (args: NodeTestArgs, id: string) => {
  debugger
}

export const handleTestNode = async (args: NodeTestArgs, id: string) => {
  debugger
}
