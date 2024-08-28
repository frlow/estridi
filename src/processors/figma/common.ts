import { Scraped } from '../../common.js'

export const processNode = (node: any, acc: Record<string, any>) => {
  if (acc[node.id]) return
  acc[node.id] = node
  const children = node.children || []
  children.forEach((c: any) => processNode(c, acc))
}

export const processFigmaDocument = (document: any, getNodeMetadata: (node: any) => any): Scraped => {
  const acc: Record<string, any> = {}
  processNode(document, acc)
  const nodes = Object.values(acc)
  nodes.forEach(n => n.scraped = nodes)
  const mappedNodes = nodes.map(node => getNodeMetadata(node)).filter(n => n)
  mappedNodes.filter(node => node.type === 'subprocess').forEach(node => {
    const link = mappedNodes.find(n => n.type === 'start' && n.text === node.text)
    if (link) node.linked = link.id
  })
  return mappedNodes
}

export function getConnections(node: any) {
  return node.scraped
    .filter((n: any) =>
      n.type === 'CONNECTOR' &&
      !n.strokeDashes &&
      n.connectorStart.endpointNodeId === node.id)
    .reduce((acc: any, cur: any) => ({ ...acc, [cur.connectorEnd.endpointNodeId]: cur.name || 'N/A' }), {})
}

export const getTableMetadata = (node: any) => {
  if (node.type !== 'TABLE') return undefined
  const rows: string[][] = Object.values(node.children.reduce((acc: Record<string, string[]>, cur: any) => ({
    ...acc,
    [cur.absoluteBoundingBox.y]: [...(acc[cur.absoluteBoundingBox.y] || []), cur.characters]
  }), {}))
  const headers = rows[0]
  const corner = rows[0][0]
  if (!corner.startsWith('.')) return undefined
  const content = rows.slice(1)
  return {
    type: 'table',
    text: corner.substring(1),
    headers,
    content,
    id: node.id
  }
}

type Points = { x0: number, x1: number, y0: number, y1: number }
export const isNodeInside = (host: any, child: any) =>
  isInside({
    x0: host.x,
    x1: host.x + host.width,
    y0: host.y,
    y1: host.y + host.height
  }, {
    x0: child.x,
    x1: child.x + child.width,
    y0: child.y,
    y1: child.y + child.height
  })
export const isInside = (host: Points, child: Points) => {
  const compare = (x: number, y: number) => x > host.x0 && x < host.x1 && y > host.y0 && y < host.y1
  if (compare(child.x0, child.y0)) return true
  if (compare(child.x1, child.y0)) return true
  if (compare(child.x0, child.y1)) return true
  if (compare(child.x1, child.y1)) return true
  return false
}

export type NodeType =
  'script' |
  'serviceCall' |
  'userAction' |
  'start' |
  'end' |
  'gateway' |
  'subprocess' |
  'signalListen'

export type NodeMetadata = {
  type: NodeType
}
