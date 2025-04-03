import { ProcessedNodes } from './tldraw'
import { Scraped, ScrapedSubprocess, ScrapedUserAction } from '../scraped'

export const afterProcess = (
  {
    scraped,
    nodes,
    getNext,
    findText,
    isSignalListenInside
  }: {
    scraped: Scraped,
    nodes: ProcessedNodes,
    getNext: (node: any)=>string|undefined
    findText: (node: any)=>string|undefined,
    isSignalListenInside: (host: any, child: any)=>boolean
  }
): Scraped => {
  const ret = structuredClone(scraped)

  // Map sub process links
  ret
    .filter((node) => node.type === 'subprocess')
    .forEach((sp: ScrapedSubprocess) => {
      const linkNode = ret.find((n) => n.type === 'start' && n.raw === sp.raw)
      sp.link = linkNode?.id
    })

  ret
    .filter((node) => node.type==="userAction")
    .forEach((ua: ScrapedUserAction) => {
      const uaNode = nodes[ua.id]
      const actions = Object.values(nodes).filter(
        (n) => isSignalListenInside(uaNode, n)
      )
      actions.forEach((a) => (ua.actions[getNext(a)] = findText(a)))
    })

  return ret
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
