import { EstridiConfig, Scraped } from '../common.js'
import { loadDocumentFromFigma } from './figma/client.js'
import { processFigmaDocument } from './figma/common.js'
import { getTeNodeMetadata } from './figma/te.js'
import { getOpenNodeMetadata } from './figma/open.js'

export enum ProcessorType {
  'FigJamTE' = 'FigJamTE',
  'FigJamOpen' = 'FigJamOpen'
}

export const process = async (config: EstridiConfig): Promise<Scraped> => {
  const processorType = config.processorType || ProcessorType.FigJamTE
  switch (processorType) {
    case ProcessorType.FigJamTE:
      return processFigmaDocument(await loadDocumentFromFigma(config), getTeNodeMetadata)
    case ProcessorType.FigJamOpen:
      return processFigmaDocument(await loadDocumentFromFigma(config), getOpenNodeMetadata)
    default:
      throw 'N/A'
  }
}
