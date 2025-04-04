import { ProcessedNodes } from './tldraw'
import { Scraped, ScrapedNode, ScrapedSubprocess } from '../scraped'

export const linkSubprocesses = (args: { scraped: Scraped }) => {
  const ret = structuredClone(args.scraped)
  ret
    .filter((node) => node.type === 'subprocess')
    .forEach((sp: ScrapedSubprocess) => {
      const linkNode = ret.find((n) => n.type === 'start' && n.raw === sp.raw)
      sp.link = linkNode?.id
    })
  return ret
}

export const mapActions = ({
  scraped,
  nodes,
  getNext,
  findText,
  isSignalListenInside,
}: {
  scraped: Scraped
  nodes: ProcessedNodes
  getNext: (node: any) => string | undefined
  findText: (node: any) => string | undefined
  isSignalListenInside: (host: any, child: any) => boolean
}) => {
  const ret = structuredClone(scraped)
  ret
    .filter((node) => ['userAction', 'subprocess'].includes(node.type))
    .forEach((ua: ScrapedNode) => {
      const uaNode = nodes[ua.id]
      const actions = Object.values(nodes).filter((n) =>
        isSignalListenInside(uaNode, n),
      )
      if (actions.length > 0) {
        actions.forEach((a) => {
          if (ua.type === 'userAction') {
            if (!ua.actions) ua.actions = {}
            ua.actions[getNext(a)] = findText(a)
          } else {
            if (!ua.special) ua.special = {}
            if (!ua.special.actions) ua.special.actions = {}
            ua.special.actions[getNext(a)] = findText(a)
          }
        })
      }
    })

  return ret
}

export const afterProcess = (args: {
  scraped: Scraped
  nodes: ProcessedNodes
  getNext: (node: any) => string | undefined
  findText: (node: any) => string | undefined
  isSignalListenInside: (host: any, child: any) => boolean
}): Scraped => {
  const linked = linkSubprocesses({ scraped: args.scraped })
  const withActions = mapActions({ ...args, scraped: linked })
  return withActions
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
