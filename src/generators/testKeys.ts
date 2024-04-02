import { Scraped, testedNodeTypes } from '../common.js'
import { getTestData } from '../utils/testData.js'

export const generateGatewayKeys = (testData: any[], rootId: string) =>
  testData.filter(n => n.type === 'gateway')
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateServiceCallKeys = (testData: any[], rootId: string) =>
  testData.filter(n => n.type === 'serviceCall')
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateActionKeys = (testData: any[], rootId: string) =>
  testData.filter(n => n.type === 'signalListen')
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateTestNodeKeys = (testData: any[], rootId: string) =>
  testData.filter(n => testedNodeTypes.includes(n.type))
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateTableKeys = (scraped: Scraped) => scraped.filter((n) => n.type === 'table').map(n => `  | '${n.id}: ${n.text}'`)

export const generateTestKeys = (scraped: Scraped, rootId: string) => {
  const testData = getTestData(scraped, rootId, {})
  const gatewayKeys = generateGatewayKeys(testData, rootId)
  const serviceCallKeys = generateServiceCallKeys(testData, rootId)
  const actionKeys = generateActionKeys(testData, rootId)
  const testNodeKeys = generateTestNodeKeys(testData, rootId)
  const tableKeys = generateTableKeys(scraped)
  return `export type GatewayKey = 
${gatewayKeys.join('\n')}
export type ServiceCallKey = 
${serviceCallKeys.join('\n')}
export type ActionKey = 
${actionKeys.join('\n')}
export type TestNodeKey = 
${testNodeKeys.join('\n')}
export type TableKeys = 
${tableKeys.join('\n')}
`
}
