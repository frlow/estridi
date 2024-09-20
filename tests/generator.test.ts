import {describe, test} from 'vitest'
import {createTester, Handles} from '../src/runner.js'
import {handles, State} from './generator.handles.js'
import {scraped} from './generator.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, () => testNode(id, {variant: v})))

describe('generator', () => {
  describe('Could not load config', t('22:2100'))
  describe('Show loaded config', t('22:2121'))
  describe('Could not load data', t('22:2150'))
  describe('Show loaded data', t('22:2167'))
  describe('Parse Nodes', t('22:2180'))
  describe('Parse Tables', t('22:2197'))
  describe('Show parsed nodes and tables', t('39:2363'))
  describe('Root node not found', t('57:466'))
  describe('Show using defined root', t('57:567'))
  describe('Default target playwright', t('58:707'))
  describe('Show filtered nodes connected to root', t('58:877'))
  describe('Write data file', t('50:315'))
  describe('Write Test file for selected target', t('53:434'))
  describe('Leave handles file unchanged', t('53:478'))
  describe('Write Handles file', t('53:465'))
  describe('Show target', t('58:734'))
  describe('Target not valid', t('58:1027'))
  describe('Document must contain exactly one root', t('57:503'))
  describe('Show using default root', t('57:599'))
})

export type GatewayKey =
    | '22:2092: Errors loading config'
    | '22:2142: Errors loading data'
    | '57:430: Root node specified'
    | '57:452: Does root exist'
    | '58:675: Target set'
    | '53:456: Does handles file exist'
    | '58:1014: Is target valid'
    | '57:489: Is there exactly one root'
export type ServiceCallKey =
    | '58:1051: Cli parameters'
    | '1:380: Config file'
    | '22:2042: Load Data'
export type ActionKey =
    | 'N/A'
export type TestNodeKey =
    | '22:2100: Could not load config'
    | '22:2121: Show loaded config'
    | '22:2150: Could not load data'
    | '22:2167: Show loaded data'
    | '22:2180: Parse Nodes'
    | '22:2197: Parse Tables'
    | '39:2363: Show parsed nodes and tables'
    | '57:466: Root node not found'
    | '57:567: Show using defined root'
    | '58:707: Default target playwright'
    | '58:877: Show filtered nodes connected to root'
    | '50:315: Write data file'
    | '53:434: Write Test file for selected target'
    | '53:478: Leave handles file unchanged'
    | '53:465: Write Handles file'
    | '58:734: Show target'
    | '58:1027: Target not valid'
    | '57:503: Document must contain exactly one root'
    | '57:599: Show using default root'
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
