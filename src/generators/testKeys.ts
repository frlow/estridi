import { Scraped, testedNodeTypes } from '../common.js'
import { getTestData } from '../utils/testData.js'

export const generateGatewayKeys = (testData: any[]) =>
  testData.filter(n => n.type === 'gateway')
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateServiceCallKeys = (testData: any[]) =>
  testData.filter(n => n.type === 'serviceCall')
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateActionKeys = (testData: any[]) =>
  testData.filter(n => n.type === 'signalListen')
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateTestNodeKeys = (testData: any[]) =>
  testData.filter(n => testedNodeTypes.includes(n.type) && !n.linked)
    .map(n => `  | '${n.id}: ${n.text}'`)

export const generateTableKeys = (scraped: Scraped) => scraped.filter((n) => n.type === 'table').map(n => `  | '${n.id}: ${n.text}'`)

export const generateTestKeys = (scraped: Scraped, rootId: string) => {
  const testData = getTestData(scraped, rootId)
  const gatewayKeys = generateGatewayKeys(testData)
  const serviceCallKeys = generateServiceCallKeys(testData)
  const actionKeys = generateActionKeys(testData)
  const testNodeKeys = generateTestNodeKeys(testData)
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
