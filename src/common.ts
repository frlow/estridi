import { Mode } from './generators/index.js'
import { NodeType, ProcessorType } from './processors/index.js'

export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export type GenerationResult = { file: string, content: string, overwrite: boolean }
export type ScrapedNode = {
  id: string
  type: NodeType
  inputs?: string[]
  rootName?: string
  text: string
  connections?: Record<string, string>
  actions?: string[]
  headers?: string[]
  content?: string[][]
  linked?: string
}
export type Scraped = ScrapedNode[]
export const testedNodeTypes = ['message', 'script', 'subprocess', 'signalSend']
export const scrapedFile = 'scraped.json'
export type EstridiConfig = {
  mode: Mode,
  token?: string,
  fileId?: string,
  file?: string,
  processorType?: ProcessorType,
  rootNames?: string
}
