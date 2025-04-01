export type NodeId = string

export type BaseNode = {
  id: NodeId
  text: string
  raw: string
  extra?: {
    target?: string
    testDir?: string
    width?: number
    height?: number
    x?: number
    y?: number
  }
}

export type ScrapedNodeTypes =
  | 'table'
  | 'other'
  | 'script'
  | 'message'
  | 'signalSend'
  | 'serviceCall'
  | 'start'
  | 'root'
  | 'end'
  | 'gateway'
  | 'subprocess'
  | 'userAction'
  | 'connector'
export type ScrapedNodeType<T extends ScrapedNodeTypes> = T

export type ScrapedOther = {
  type: ScrapedNodeType<'other'>
  next?: NodeId
  data?: any
} & BaseNode

export type ScrapedConnector = {
  type: ScrapedNodeType<'connector'>
  next?: NodeId
} & BaseNode

export type ScrapedTable = {
  type: ScrapedNodeType<'table'>
  rows: string[][]
} & BaseNode

export type ScrapedScript = {
  type: ScrapedNodeType<'script'>
  variant: 'script' | 'message' | 'signalSend'
  next?: NodeId
} & BaseNode

export type ScrapedServiceCall = {
  type: ScrapedNodeType<'serviceCall'>
  next?: NodeId
} & BaseNode

export type ScrapedStart = {
  type: ScrapedNodeType<'start' | 'root' | 'end'>
  next?: NodeId
} & BaseNode

export type ScrapedGateway = {
  type: ScrapedNodeType<'gateway'>
  variant: 'gateway' | 'loop' | 'parallel'
  options: Record<NodeId, string>
} & BaseNode

export type ScrapedSubprocess = {
  type: ScrapedNodeType<'subprocess'>
  next?: NodeId
  link?: string
  tableKey?: string
} & BaseNode

export type ScrapedUserAction = {
  type: ScrapedNodeType<'userAction'>
  next?: NodeId
  actions?: Record<NodeId, string>
  variant: 'userAction' | 'subprocess'
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
  | ScrapedConnector
export type Scraped = ScrapedNode[]

export type FigmaConfig = {
  token: string
  fileId: string
}

export type FileConfig = {
  file: string
}
export type EstridiConfig = FigmaConfig | FileConfig
