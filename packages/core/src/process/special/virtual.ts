import {
  Scraped,
  ScrapedGateway,
  ScrapedNode,
  ScrapedScript,
} from '../../scraped'
import { autoText } from '../../texts'

const getNodeConnections = (node: ScrapedNode): string[] => {
  const possibleConnections = [
    'next' in node && node.next,
    ...Object.keys(('options' in node && node.options) || {}),
    ...Object.keys(('actions' in node && node.actions) || {}),
  ]
  const definedConnections = possibleConnections.filter((c) => c)
  const uniqueConnections = definedConnections.filter((n, index, arr) => {
    return n && arr.indexOf(n) === index
  })
  return uniqueConnections
}

const findText = (
  scraped: Scraped,
  gw: ScrapedGateway,
  blockedPath: string,
): string => {
  const toProcess = getNodeConnections(gw)
  while (toProcess.length > 0) {
    const currentId = toProcess.shift()
    if (currentId === blockedPath) continue
    if (currentId.endsWith('-Virtual')) continue
    const currentNode = scraped.find((n) => n.id === currentId)
    if (currentNode.type !== 'gateway' && currentNode.raw)
      return currentNode.raw
    if (currentNode.type === 'connector')
      toProcess.push(...getNodeConnections(currentNode))
    else toProcess.unshift(...getNodeConnections(currentNode))
  }
}

export const hasVirtualNodeSlot = (
  node: ScrapedNode,
  scraped: Scraped,
): boolean => {
  if (!('options' in node)) return false
  if (node.variant !== 'gateway') return false
  return Object.keys(node.options).some(
    (key) => scraped.find((n) => n.id === key).type === 'connector',
  )
}

export const injectVirtualNodes = (
  node: ScrapedNode,
  scraped: Scraped,
): Scraped => {
  if (!('options' in node)) throw 'This should not happen!'
  const emptyPaths = Object.keys(node.options)
    .map((key) => scraped.find((n) => n.id === key))
    .filter((n) => n.type === 'connector')
  if (emptyPaths.length !== 1) return [node]
  const outId = emptyPaths[0].id
  const virtualId = `${node.id}-virtual`
  const gateway = structuredClone(node)
  delete gateway.options[outId]
  gateway.options[virtualId] = node.options[outId]
  const virtualNode: ScrapedScript = {
    type: 'script',
    variant: 'script',
    id: virtualId,
    ...autoText(`Negative: ${findText(scraped, node, outId)}`),
    next: outId,
  }
  return [gateway, virtualNode]
}
