import { GenerationResult, Scraped } from '../common.js'
import * as path from 'node:path'
import { getTestData } from '../utils/testData.js'

export const generateScrapedTs = (scraped: Scraped, dir: string): GenerationResult => {
  const testData = getTestData(scraped)
  const gatewayKeys = testData.filter(n => n.type === 'gateway')
    .map(n => `  | '${n.id}: ${n.text}'`)
  const serviceCallKeys = testData.filter(n => n.type === 'serviceCall')
    .map(n => `  | '${n.id}: ${n.text}'`)
  const actionKeys = testData.filter(n => n.type === 'signalListen')
    .map(n => `  | '${n.id}: ${n.text}'`)
  const testNodeKeys = testData.filter(n => ['message', 'script', 'subprocess'].includes(n.type))
    .map(n => `  | '${n.id}: ${n.text}'`)
  const content = `export const scraped: {
  type: string,
  text: string,
  connections: Record<string, string>,
  id: string,
  actions?: string[]
}[] = ${JSON.stringify(scraped, null, 2)}
export type GatewayKey = 
${gatewayKeys.join('\n')}
export type ServiceCallKey = 
${serviceCallKeys.join('\n')}
export type ActionKey = 
${actionKeys.join('\n')}
export type TestNodeKey = 
${testNodeKeys.join('\n')}
`
  return {
    content,
    file: path.join(dir, 'scraped.ts'),
    overwrite: true
  }
}
