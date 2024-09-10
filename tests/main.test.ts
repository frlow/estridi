import { test, describe } from 'vitest'
import { createTester, Handles, loadScraped } from 'estridi'
import { handles, State } from './main.handles.js'
export type RootId = '1:373'
const scraped = loadScraped()
const { testNode, getVariants } = createTester(scraped, '1:373', handles)
const t = (id: string) => () => {
  for (const variant of getVariants(id))
    test(variant.name, () =>
      testNode(id, { variant })
    )
}
describe('main', () => {
  describe('message: Show loaded config, 22:2121', t('22:2121'))
  describe('message: Could not load config, 22:2100', t('22:2100'))
  describe('message: Show loaded data, 22:2167', t('22:2167'))
  describe('message: Could not load data, 22:2150', t('22:2150'))
  describe('subprocess: Parse Nodes, 22:2180', t('22:2180'))
  describe('message: Show parsed nodes, 22:2210', t('22:2210'))
  describe('subprocess: Parse Tables, 22:2197', t('22:2197'))
  describe('message: Show parsed tables, 22:2232', t('22:2232'))
  describe('script: Write scraped file, 22:2245', t('22:2245'))
  describe('subprocess: Generate Tests, 22:2278', t('22:2278'))
})

export type GatewayKey =
  | '22:2092: Errors loading config'
  | '22:2142: Errors loading data'
export type ServiceCallKey =
  | '1:380: Config file'
  | '22:2042: Load Data'
export type ActionKey =
'N/A'
export type TestNodeKey =
  | '22:2121: Show loaded config'
  | '22:2100: Could not load config'
  | '22:2167: Show loaded data'
  | '22:2150: Could not load data'
  | '22:2180: Parse Nodes'
  | '22:2210: Show parsed nodes'
  | '22:2197: Parse Tables'
  | '22:2232: Show parsed tables'
  | '22:2245: Write scraped file'
  | '22:2278: Generate Tests'
export type TableKeys =
  | '1:966: Node types'
  | '16:1764: Source types'

export type MainHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  {},
  TableKeys
>
