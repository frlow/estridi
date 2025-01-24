export { loadScrapedFromSource } from './index.js'

export type BaseNode = { id: string, text: string, raw: string, note?: string, distance?: number }

export type ScrapedNodeTypes =
  | 'table'
  | 'other'
  | 'script'
  | 'serviceCall'
  | 'start'
  | 'root'
  | 'end'
  | 'gateway'
  | 'subprocess'
  | 'userAction'
export type ScrapedNodeType<T extends ScrapedNodeTypes> = T

export type ScrapedOther = {
  type: ScrapedNodeType<'other'>
  next?: string
  data?: any
} & BaseNode

export type ScrapedTable = {
  type: ScrapedNodeType<'table'>
  rows: string[][]
} & BaseNode

export type ScrapedScript = {
  type: ScrapedNodeType<'script'>
  next?: string
} & BaseNode

export type ScrapedServiceCall = {
  type: ScrapedNodeType<'serviceCall'>
  next?: string
} & BaseNode

export type ScrapedStart = {
  type: ScrapedNodeType<'start' | 'root' | 'end'>
  next?: string
  isRoot?: boolean
} & BaseNode

export type ScrapedGateway = {
  type: ScrapedNodeType<'gateway'>
  variant: 'gateway' | 'loop' | 'parallel'
  options: Record<string, string>
} & BaseNode

export type ScrapedSubprocess = {
  type: ScrapedNodeType<'subprocess'>
  next?: string
  link?: string
  tableKey?: string
} & BaseNode

export type ScrapedUserAction = {
  type: ScrapedNodeType<'userAction'>
  next?: string
  actions?: Record<string, string>
} & BaseNode

export type ScrapedNode =
  | ScrapedGateway
  | ScrapedScript
  | ScrapedTable
  | ScrapedOther
  | ScrapedServiceCall
  | ScrapedStart
  | ScrapedSubprocess
  | ScrapedUserAction
export type Scraped = ScrapedNode[]

export type FigmaConfig = {
  token: string
  fileId: string
}

export type FileConfig = {
  file: string
}
export type EstridiConfig = FigmaConfig | FileConfig
