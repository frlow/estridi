import { test, describe } from 'vitest'
import { createTester, Handles, loadScraped } from 'estridi'
import { handles, State } from './generator.handles.js'
export type RootId = '1:373'
const scraped = loadScraped()
const { testNode, getVariants } = createTester(scraped, '1:373', handles)
const t = (id: string) => () => {
  for (const variant of getVariants(id))
    test(variant.name, () =>
      testNode(id, { variant })
    )
}
describe('generator', () => {
  describe('message: Show loaded config, 22:2121', t('22:2121'))
  describe('message: Could not load config, 22:2100', t('22:2100'))
  describe('message: Show loaded data, 22:2167', t('22:2167'))
  describe('message: Could not load data, 22:2150', t('22:2150'))
  describe('subprocess: Parse Nodes, 22:2180', t('22:2180'))
  describe('subprocess: Parse Tables, 22:2197', t('22:2197'))
  describe('message: Show parsed nodes and tables, 39:2363', t('39:2363'))
  describe('message: Show using default root, 57:599', t('57:599'))
  describe('message: Document must contain exactly one root, 57:503', t('57:503'))
  describe('message: Show using defined root, 57:567', t('57:567'))
  describe('message: Root node not found, 57:466', t('57:466'))
  describe('message: Default target playwright, 58:707', t('58:707'))
  describe('message: Show target, 58:734', t('58:734'))
  describe('message: Target not valid, 58:1027', t('58:1027'))
  describe('message: Show filtered nodes connected to root, 58:877', t('58:877'))
  describe('script: Write data file, 50:315', t('50:315'))
  describe('message: Done No target, 58:803', t('58:803'))
  describe('script: Write Test file for selected target, 53:434', t('53:434'))
  describe('script: Write Handles file, 53:465', t('53:465'))
  describe('script: Leave handles file unchanged, 53:478', t('53:478'))
  describe('message: Done Tests written, 58:916', t('58:916'))
})

export type GatewayKey =
  | '22:2092: Errors loading config'
  | '22:2142: Errors loading data'
  | '57:430: Root node specified'
  | '57:489: Is there exactly one root'
  | '57:452: Does root exist'
  | '58:675: Target set'
  | '58:1014: Is target valid'
  | '58:781: Is target set'
  | '53:456: Does handles file exist'
export type ServiceCallKey =
  | '58:1051: Cli parameters'
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
  | '57:599: Show using default root'
  | '57:503: Document must contain exactly one root'
  | '57:567: Show using defined root'
  | '57:466: Root node not found'
  | '58:707: Default target playwright'
  | '58:734: Show target'
  | '58:1027: Target not valid'
  | '58:877: Show filtered nodes connected to root'
  | '50:315: Write data file'
  | '58:803: Done No target'
  | '53:434: Write Test file for selected target'
  | '53:465: Write Handles file'
  | '53:478: Leave handles file unchanged'
  | '58:916: Done Tests written'
export type TableKeys =
  | '1:966: Node types'
  | '16:1764: Source types'
  | '51:412: Generation targets'

export type GeneratorHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  {},
  TableKeys
>
