import { EstridiConfig, Scraped } from '../common.js'
import { loadDocumentFromFigma } from './figma/client.js'
import { processFigmaDocument } from './figma/common.js'
import { getTeNodeMetadata } from './figma/te.js'
import { getOpenNodeMetadata } from './figma/open.js'
import { processMermaid } from './mermaid/index.js'

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
  'signalListen'

export const process = async (config: EstridiConfig): Promise<Scraped> => {
  const processorType = config.processorType || ProcessorType.FigJamTE
  switch (processorType) {
    case ProcessorType.FigJamTE:
      return processFigmaDocument(await loadDocumentFromFigma(config), getTeNodeMetadata)
    case ProcessorType.FigJamOpen:
      return processFigmaDocument(await loadDocumentFromFigma(config), getOpenNodeMetadata)
    case ProcessorType.Mermaid:
      return await processMermaid(config)
    default:
      throw 'N/A'
  }
}
