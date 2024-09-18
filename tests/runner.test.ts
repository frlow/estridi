import {describe, test} from 'vitest'
import {createTester, Handles} from '../src/runner.js'
import {handles, State} from './runner.handles.js'
import {scraped} from './runner.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, () => testNode(id, {variant: v})))

describe('runner', () => {
  describe('Return Variants for node', t('76:1189'))
  describe('Return default variant', t('94:2126'))
  describe('List all paths', t('109:2256'))
  describe('Filter all paths containing node', t('76:1241'))
  describe('Don t filter nodes by via', t('108:2187'))
  describe('Filter encouraged paths', t('77:1609'))
  describe('Keep paths without end', t('136:833'))
  describe('Use shortest path', t('76:1484'))
  describe('Show args testLib args getTable gateways variant', t('78:1739'))
  describe('Call setup args', t('78:1749'))
  describe('Call serviceCalls args serviceCallKey state', t('78:1766'))
  describe('Call start args state', t('78:1798'))
  describe('Call actions before tested node args actionKey state', t('78:1843'))
  describe('Call extraAction args state', t('78:1923'))
  describe('Call testNode args testNodeKey state Including scripts messages and unlinked subprocesses', t('78:1865'))
  describe('Call custom test', t('87:2080'))
  describe('Only paths with end', t('136:823'))
  describe('Include discouraged paths', t('77:1635'))
  describe('Don t filter discouraged', t('108:2237'))
  describe('Filter paths containing all via nodes', t('76:1322'))
  describe('No paths containing all via nodes', t('110:2327'))
  describe('No paths containing node', t('110:2303'))
})

export type GatewayKey =
    | '94:2102: Node has any variants'
    | '110:2290: Any paths containing node'
    | '76:1261: Node has variant'
    | '76:1304: Variant has via'
    | '76:1372: Any discouraged nodes'
    | '77:1572: Any suggested paths left'
    | '136:809: Any paths containing end'
    | '87:2067: Variant has custom test'
    | '78:1892: Variant has extra action'
    | '110:2342: Any path containing all via nodes'
export type ServiceCallKey =
    | '104:2156: Load handles'
    | '76:1168: Load scraped data'
export type ActionKey =
    | '76:1110: action - Get variants'
    | '76:1110: action - Test node'
export type TestNodeKey =
    | '76:1189: Return Variants for node'
    | '94:2126: Return default variant'
    | '109:2256: List all paths'
    | '76:1241: Filter all paths containing node'
    | '108:2187: Don t filter nodes by via'
    | '77:1609: Filter encouraged paths'
    | '136:833: Keep paths without end'
    | '76:1484: Use shortest path'
    | '78:1739: Show args testLib args getTable gateways variant'
    | '78:1749: Call setup args'
    | '78:1766: Call serviceCalls args serviceCallKey state'
    | '78:1798: Call start args state'
    | '78:1843: Call actions before tested node args actionKey state'
    | '78:1923: Call extraAction args state'
    | '78:1865: Call testNode args testNodeKey state Including scripts messages and unlinked subprocesses'
    | '87:2080: Call custom test'
    | '136:823: Only paths with end'
    | '77:1635: Include discouraged paths'
    | '108:2237: Don t filter discouraged'
    | '76:1322: Filter paths containing all via nodes'
    | '110:2327: No paths containing all via nodes'
    | '110:2303: No paths containing node'
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
