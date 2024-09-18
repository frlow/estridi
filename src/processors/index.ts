import { EstridiConfig, LogFunc, Scraped } from '../index'
import { processFigma } from './figma'

export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export const sanitizeText = (text: string) =>
  text
    .replaceAll(allowedRegex, ' ')
    .replace(/\n/g, ' ')
    .replace(/ +/g, ' ')
    .trim()

export const process = async (
  config: EstridiConfig,
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  // Passing estridi object to simplify mocking.
  if (config.type === 'figma') return await processFigma(config, data, log)
  debugger
  throw `type: ${config.type} not implemented yet`
}

type Points = { x0: number; x1: number; y0: number; y1: number }
export const isNodeInside = (host: any, child: any) =>
  isInside(
    {
      x0: host.x,
      x1: host.x + host.width,
      y0: host.y,
      y1: host.y + host.height,
    },
    {
      x0: child.x,
      x1: child.x + child.width,
      y0: child.y,
      y1: child.y + child.height,
    },
  )
export const isInside = (host: Points, child: Points) => {
  const compare = (x: number, y: number) =>
    x > host.x0 && x < host.x1 && y > host.y0 && y < host.y1
  if (compare(child.x0, child.y0)) return true
  if (compare(child.x1, child.y0)) return true
  if (compare(child.x0, child.y1)) return true
  if (compare(child.x1, child.y1)) return true
  return false
}
