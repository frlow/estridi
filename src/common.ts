import { NodeMetadata } from './figma/nodes'
export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g

export type Scraped = Record<string, NodeMetadata & {
  connections?: Record<string, string>
  rows?: string[][]
}>
