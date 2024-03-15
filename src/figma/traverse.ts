import { getNodeMetadata } from './nodes'
import { Scraped } from '../common'

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


export const traverse2 = (node: any, nodes: Scraped = {}) => {
  const nodesToHandle = [node.id]
  while (nodesToHandle.length > 0) {
    const currentId = nodesToHandle.pop()
    const current = figma.getNodeById(currentId) as any
    if (!current) continue
    const meta = getNodeMetadata(current)
    if (!meta) continue
    const outboundConnections = current.attachedConnectors
      .filter((con: any) => con?.dashPattern?.length === 0 && con.connectorStart.endpointNodeId === current.id)
      .reduce((acc: any, cur: any) => ({ ...acc, [cur.connectorEnd.endpointNodeId]: cur.name || 'N/A' }), {})
    if (meta?.type === 'userAction')
      current.parent.children
        .filter((c: any) => isNodeInside(current, c) && c.name === 'Signal listen')
        .forEach((action: any) => outboundConnections[action.id] = 'Action')
    nodes[current.id] = { ...meta, connections: outboundConnections }
    nodesToHandle.push(...Object.keys(outboundConnections).filter(key => !nodes[key]))
  }
  return nodes
}

export const scrapeTable2 = (node: any, nodes: Scraped) => {
  const rows: string[][] = []
  node.children.forEach((c: any) => {
    if (!rows[c.rowIndex]) rows[c.rowIndex] = []
    rows[c.rowIndex].push(c.text.characters)
  })
  nodes[node.id] = {
    type: 'table',
    text: 'Table',
    rows: rows
  }
  return nodes
}
