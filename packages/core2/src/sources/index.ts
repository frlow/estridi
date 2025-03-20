import { GenerateTestFileConfig } from '../index'
import { Scraped } from '../scraped'
import { processFigma } from './figma'

export const loadScraped = async (
  config: GenerateTestFileConfig,
): Promise<Scraped> => {
  if (config.source === 'figma') return await processFigma(config)
  return []
}
