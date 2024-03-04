import { getNodeMetadata, NodeMetadata } from './nodes'
import { allowedRegex } from './common'

type Points = { x0: number, x1: number, y0: number, y1: number }
export const isNodeInside = (host: any, child: any) => isInside({
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

export type TraversedNode = { id: string, meta: NodeMetadata, next: TraversedNode[] }
export const traverse = (node: any, visited: string[] = []): TraversedNode => {
  if (visited.includes(node.id)) return { id: node.id, next: [], meta: undefined }
  const connectors = node?.attachedConnectors.filter(
    (c: any) =>
      c?.dashPattern?.length === 0 &&
      c?.connectorStart?.endpointNodeId === node.id
  )
  const meta = getNodeMetadata(node)
  const nextNodes =
    meta?.type === 'gateway'
      ? connectors?.map((c: any) => {
        return {
          id: c.id,
          meta: {
            type: 'connector',
            text: meta.text.replace(allowedRegex, ''),
            value: c.name || 'unknown'
          },
          next: [
            traverse(figma.getNodeById(c?.connectorEnd?.endpointNodeId), [
              ...visited,
              node.id
            ])
          ]
        }
      })
      : meta?.type === 'userAction' ? (() => {
          const standard = connectors?.map((c: any) => figma.getNodeById(c?.connectorEnd?.endpointNodeId))
          const actions = node.parent.children.filter((c: any) => isNodeInside(node, c))
          return [...standard, ...actions].map(n => traverse(n, [...visited, node.id]))
        })() :
        connectors?.map((c: any) => {
          const nextNode = figma.getNodeById(c?.connectorEnd?.endpointNodeId)
          return traverse(nextNode, [...visited, node.id])
        })

  return {
    id: node.id,
    meta: getNodeMetadata(node),
    next: nextNodes
  }
}
