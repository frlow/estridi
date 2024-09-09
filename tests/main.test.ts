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
  describe('script: V List all loaded data, 1:741', t('1:741'))
  describe('script: V List all nodes, 1:803', t('1:803'))
  describe('script: V Do not show parsed table, 2:1466', t('2:1466'))
  describe('script: V Show parsed table, 1:853', t('1:853'))
  describe('script: V Parse Script Text Connections 0 1, 4:1524', t('4:1524'))
  describe('script: V Filter only connected nodes, 1:1133', t('1:1133'))
  describe('script: Scraped file should be written, 1:1071', t('1:1071'))
})

export type GatewayKey =
  | '1:569: Source type'
  | '1:674: Source type'
  | '1:845: Is node table'
  | '2:1420: Does table have dot first in name'
  | '1:897: Figma variant'
  | '4:1511: Node type'
export type ServiceCallKey =
  | '1:380: Config file'
  | '1:568: Load Figma Document'
export type ActionKey =
'N/A'
export type TestNodeKey =
  | '1:741: V List all loaded data'
  | '1:803: V List all nodes'
  | '2:1466: V Do not show parsed table'
  | '1:853: V Show parsed table'
  | '4:1524: V Parse Script Text Connections 0 1'
  | '1:1133: V Filter only connected nodes'
  | '1:1071: Scraped file should be written'
export type TableKeys =
  | '1:966: Node types'

export type MainHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  {},
  TableKeys
>
