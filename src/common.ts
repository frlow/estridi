import { Mode } from './generators/index.js'
import { ProcessorType } from './processors/index.js'

export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export type GenerationResult = { file: string, content: string, overwrite: boolean }
export type Scraped = {
  type: string
  inputs?: string[]
  text: string
  connections: Record<string, string>
  id: string
  actions?: string[]
  headers?: string[]
  content?: string[][]
  linked?: string
}[]
export const testedNodeTypes = ['message', 'script', 'subprocess', 'signalSend']
export const scrapedFile = 'scraped.json'
export type EstridiConfig = { mode: Mode, token: string, fileId: string, processorType?: ProcessorType }
