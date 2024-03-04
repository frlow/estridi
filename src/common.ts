import { NodeMetadata } from './figma/nodes'

export type Scraped = Record<string, NodeMetadata & {
  connections?: Record<string, string>
  rows?: string[][]
}>
