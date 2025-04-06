import { z } from 'zod'

const nodeIdValidator = z.string()
export type NodeId = z.infer<typeof nodeIdValidator>

const baseNodeValidator = z.object({
  id: nodeIdValidator,
  raw: z.string(),
  special: z.optional(
    z.object({
      actions: z.optional(z.record(nodeIdValidator, z.string())),
    }),
  ),
  // extra: z.any(),
})

export type BaseNode = z.infer<typeof baseNodeValidator>

export const scrapedNodeTypes = [
  'table',
  'other',
  'script',
  'message',
  'signalSend',
  'serviceCall',
  'start',
  'root',
  'end',
  'gateway',
  'loop',
  'parallel',
  'subprocess',
  'userAction',
  'connector',
] as const
const scrapedNodeTypesValidator = z.enum(scrapedNodeTypes)
export type ScrapedNodeTypes = z.infer<typeof scrapedNodeTypesValidator>

export type ScrapedNodeType<T extends ScrapedNodeTypes> = T

export type ScrapedOther = {
  type: ScrapedNodeType<'other'>
  next?: NodeId
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
  options: Record<NodeId, string>
} & BaseNode

export type ScrapedLoop = {
  type: ScrapedNodeType<'loop'>
  next?: NodeId
} & BaseNode

export type ScrapedParallel = {
  type: ScrapedNodeType<'parallel'>
  options?: Record<NodeId, null>
} & BaseNode

export type ScrapedSubprocess = {
  type: ScrapedNodeType<'subprocess'>
  next?: NodeId
  link?: string
} & BaseNode

export type ScrapedUserAction = {
  type: ScrapedNodeType<'userAction'>
  next?: NodeId
  actions?: Record<NodeId, string>
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
  | ScrapedLoop
  | ScrapedParallel
export type Scraped = ScrapedNode[]

export type FigmaConfig = {
  token: string
  fileId: string
}
