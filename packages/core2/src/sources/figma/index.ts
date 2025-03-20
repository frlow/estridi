import { FigmaConfig } from '../../index'
import { Scraped } from '../../scraped'
import { loadFromFigma } from './figmaAccessor'
import { parseFigma } from './figmaParser'

export const processFigma = async (config: FigmaConfig): Promise<Scraped> => {
  const data = await loadFromFigma(config)
  return await parseFigma(data)
}
