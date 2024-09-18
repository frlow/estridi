export type BaseNode = { id: string }

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
  text?: string
} & BaseNode

export type ScrapedTable = {
  type: ScrapedNodeType<'table'>
  rows: string[][]
  text: string
} & BaseNode

export type ScrapedScript = {
  type: ScrapedNodeType<'script'>
  text: string
  next?: string
} & BaseNode

export type ScrapedServiceCall = {
  type: ScrapedNodeType<'serviceCall'>
  text: string
  next?: string
} & BaseNode

export type ScrapedStart = {
  type: ScrapedNodeType<'start' | 'root' | 'end'>
  text: string
  next?: string
  isRoot?: boolean
} & BaseNode

export type ScrapedGateway = {
  type: ScrapedNodeType<'gateway'>
  text: string
  options: Record<string, string>
} & BaseNode

export type ScrapedSubprocess = {
  type: ScrapedNodeType<'subprocess'>
  text: string
  next?: string
  link?: string
} & BaseNode

export type ScrapedUserAction = {
  type: ScrapedNodeType<'userAction'>
  text: string
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
