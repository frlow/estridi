import { EstridiConfig, Scraped } from '../common.js'
import { loadDocumentFromFigma } from './figma/client.js'
import { processFigmaDocument } from './figma/te.js'

export enum ProcessorType { 'FigJamTE' }

export const process = async (config: EstridiConfig): Promise<Scraped> => {
  const processorType = config.processorType || ProcessorType.FigJamTE
  switch (processorType) {
    case ProcessorType.FigJamTE: {
      const document = await loadDocumentFromFigma(config)
      return processFigmaDocument(document)
    }
    default:
      throw 'N/A'
  }
}
