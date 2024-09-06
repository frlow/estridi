import { EstridiConfig, Scraped } from '../common.js'
import { loadDocumentFromFigma } from './figma/client.js'
import { processFigmaDocument } from './figma/common.js'
import { getTeNodeMetadata } from './figma/te.js'
import { getOpenNodeMetadata } from './figma/open.js'
import { cleanScraped } from './normalizer.js'

export enum ProcessorType {
  'FigJamTE' = 'FigJamTE',
  'FigJamOpen' = 'FigJamOpen',
  'Mermaid' = 'Mermaid'
}

export type NodeType =
  'script' |
  'serviceCall' |
  'userAction' |
  'start' |
  'end' |
  'gateway' |
  'subprocess' |
  'signalListen' |
  'table'

export const process = async (config: EstridiConfig): Promise<Scraped> => {
  const processorType = config.processorType || ProcessorType.FigJamTE
  let raw: Scraped
  switch (processorType) {
    case ProcessorType.FigJamTE:
      raw = processFigmaDocument(await loadDocumentFromFigma(config), getTeNodeMetadata)
      break
    case ProcessorType.FigJamOpen:
      raw = processFigmaDocument(await loadDocumentFromFigma(config), getOpenNodeMetadata)
      break
    // case ProcessorType.Mermaid:
    //   return await processMermaid(config)
    default:
      throw 'N/A'
  }
  return cleanScraped(raw)
}
