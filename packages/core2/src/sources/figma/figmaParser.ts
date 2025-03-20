import { loadFromFigma } from './figmaAccessor'
import { Scraped } from '../../scraped'
import { processFigma } from 'core'

export const parseFigma = async (
  data: Awaited<ReturnType<typeof loadFromFigma>>,
): Promise<Scraped> => {
  return await processFigma(data)
}
