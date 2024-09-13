import { test, describe } from 'vitest'
import { createTester, Handles, loadScraped } from 'estridi'
import { handles, State } from './runner.handles.js'
export type RootId = '58:945'
const scraped = loadScraped()
const { testNode, getVariants } = createTester(scraped, '58:945', handles)
const t = (id: string) => () => {
  for (const variant of getVariants(id))
    test(variant.name, () =>
      testNode(id, { variant })
    )
}
describe('runner', () => {
  describe('script: Return default variant, 94:2126', t('94:2126'))
  describe('script: Return Variants for node, 76:1189', t('76:1189'))
  describe('message: Filter all paths containing node, 76:1241', t('76:1241'))
  describe('message: Filter paths containing all via nodes, 76:1322', t('76:1322'))
  describe('message: Don t filter discouraged paths, 77:1635', t('77:1635'))
  describe('message: Use shortest path, 76:1484', t('76:1484'))
  describe('message: Filter discouraged paths, 77:1609', t('77:1609'))
  describe('script: Call custom test, 87:2080', t('87:2080'))
  describe('message: Show args testLib args getTable gateways variant, 78:1739', t('78:1739'))
  describe('script: Call setup args, 78:1749', t('78:1749'))
  describe('script: Call serviceCalls args serviceCallKey state, 78:1766', t('78:1766'))
  describe('script: Call start args state, 78:1798', t('78:1798'))
  describe('script: Call actions before tested node args actionKey state, 78:1843', t('78:1843'))
  describe('script: Call extraAction args state, 78:1923', t('78:1923'))
  describe('script: Call testNode args testNodeKey state, 78:1865', t('78:1865'))
})

export type GatewayKey =
  | '94:2102: Node has any variants'
  | '76:1261: Node has variant'
  | '76:1304: Variant has via'
  | '76:1372: Any discouraged nodes'
  | '77:1572: Any suggested paths left'
  | '87:2067: Variant has custom test'
  | '78:1892: Variant has extra action'
export type ServiceCallKey =
  | '76:1168: Load scraped data'
export type ActionKey =
  | '76:1153: Test node'
  | '76:1143: Get variants'
export type TestNodeKey =
  | '94:2126: Return default variant'
  | '76:1189: Return Variants for node'
  | '76:1241: Filter all paths containing node'
  | '76:1322: Filter paths containing all via nodes'
  | '77:1635: Don t filter discouraged paths'
  | '76:1484: Use shortest path'
  | '77:1609: Filter discouraged paths'
  | '87:2080: Call custom test'
  | '78:1739: Show args testLib args getTable gateways variant'
  | '78:1749: Call setup args'
  | '78:1766: Call serviceCalls args serviceCallKey state'
  | '78:1798: Call start args state'
  | '78:1843: Call actions before tested node args actionKey state'
  | '78:1923: Call extraAction args state'
  | '78:1865: Call testNode args testNodeKey state'
export type TableKeys =
  | '1:966: Node types'
  | '16:1764: Source types'
  | '51:412: Generation targets'

export type RunnerHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  {},
  TableKeys
>
