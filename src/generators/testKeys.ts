import { Scraped, testedNodeTypes } from '../common.js'
import { getTestData } from '../utils/testData.js'

export const generateTestKeys = (scraped: Scraped, rootId: string) => {
  const testData = getTestData(scraped, rootId)
  const gatewayKeys = testData.filter(n => n.type === 'gateway')
    .map(n => `  | '${n.id}: ${n.text}'`)
  const serviceCallKeys = testData.filter(n => n.type === 'serviceCall')
    .map(n => `  | '${n.id}: ${n.text}'`)
  const actionKeys = testData.filter(n => n.type === 'signalListen')
    .map(n => `  | '${n.id}: ${n.text}'`)
  const testNodeKeys = testData.filter(n => testedNodeTypes.includes(n.type))
    .map(n => `  | '${n.id}: ${n.text}'`)
  return `export type GatewayKey = 
${gatewayKeys.join('\n')}
export type ServiceCallKey = 
${serviceCallKeys.join('\n')}
export type ActionKey = 
${actionKeys.join('\n')}
export type TestNodeKey = 
${testNodeKeys.join('\n')}
`
}
