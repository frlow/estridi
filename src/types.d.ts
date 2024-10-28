declare global {
  type BaseNode = { id: string }

  type ScrapedNodeTypes =
    | 'table'
    | 'other'
    | 'script'
    | 'script-group'
    | 'serviceCall'
    | 'start'
    | 'root'
    | 'end'
    | 'gateway'
    | 'subprocess'
    | 'userAction'
  type ScrapedNodeType<T extends ScrapedNodeTypes> = T

  type ScrapedOther = {
    type: ScrapedNodeType<'other'>
    next?: string
    data?: any
    text?: string
  } & BaseNode

  type ScrapedTable = {
    type: ScrapedNodeType<'table'>
    rows: string[][]
    text: string
  } & BaseNode

  type ScrapedScript = {
    type: ScrapedNodeType<'script'>
    text: string
    next?: string
    customTest?: boolean
  } & BaseNode

  type ScrapedServiceCall = {
    type: ScrapedNodeType<'serviceCall'>
    text: string
    next?: string
  } & BaseNode

  type ScrapedStart = {
    type: ScrapedNodeType<'start' | 'root' | 'end'>
    text: string
    next?: string
    isRoot?: boolean
  } & BaseNode

  type ScrapedGateway = {
    type: ScrapedNodeType<'gateway'>
    text: string
    options: Record<string, string>
  } & BaseNode

  type ScrapedSubprocess = {
    type: ScrapedNodeType<'subprocess'>
    text: string
    next?: string
    link?: string
    tableKey?: string
  } & BaseNode

  type ScrapedUserAction = {
    type: ScrapedNodeType<'userAction'>
    text: string
    next?: string
    actions?: Record<string, string>
  } & BaseNode

  type ScrapedNode =
    | ScrapedGateway
    | ScrapedScript
    | ScrapedTable
    | ScrapedOther
    | ScrapedServiceCall
    | ScrapedStart
    | ScrapedSubprocess
    | ScrapedUserAction
  type Scraped = ScrapedNode[]

  export type FigmaConfig = {
    token: string
    fileId: string
  }
  export type EstridiConfig = FigmaConfig
}

export {}
