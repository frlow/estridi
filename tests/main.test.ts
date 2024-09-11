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
  describe('subprocess: Parse Tables, 22:2197', t('22:2197'))
  describe('message: Show parsed nodes and tables, 39:2363', t('39:2363'))
  describe('script: Write scraped json file only nodes connected to root, 50:315', t('50:315'))
  describe('message: Show gateway keys, 51:342', t('51:342'))
  describe('message: Show service call keys, 51:352', t('51:352'))
  describe('message: Show action keys, 51:362', t('51:362'))
  describe('message: Show test node keys, 51:372', t('51:372'))
  describe('message: Show table keys, 51:382', t('51:382'))
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
  | '22:2197: Parse Tables'
  | '39:2363: Show parsed nodes and tables'
  | '50:315: Write scraped json file only nodes connected to root'
  | '51:342: Show gateway keys'
  | '51:352: Show service call keys'
  | '51:362: Show action keys'
  | '51:372: Show test node keys'
  | '51:382: Show table keys'
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
