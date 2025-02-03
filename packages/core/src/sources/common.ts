import { ProcessedNodes } from './tldraw'
import { Scraped, ScrapedSubprocess, ScrapedUserAction } from '../scraped'

export const getTableKey = (text: string) => {
  const splitResult = text.split(':')
  if (splitResult.length !== 2) return undefined
  return splitResult[1].trim()
}


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
      const linkNode = ret.find((n) => n.type === 'start' && n.text === sp.text)
      sp.link = linkNode?.id
    })

  // Map actions for userAction and special cases for external subprocesses
  ret
    .filter((node) => ['userAction', 'subprocess'].includes(node.type))
    .forEach((ua: ScrapedUserAction) => {
      const uaNode = nodes[ua.id]
      const actions = Object.values(nodes).filter(
        (n) => isSignalListenInside(uaNode, n)
      )
      if ((ua.type as any) === 'subprocess' && actions.length > 0) {
        delete (ua as any).link
        delete (ua as any).tableKey
        ua.type = 'userAction'
        ua.variant = 'subprocess'
        ua.actions = {}
      }
      actions.forEach((a) => (ua.actions[getNext(a)] = findText(a)))
    })

  return ret
}
