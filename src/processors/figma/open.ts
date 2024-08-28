import { getConnections, getTableMetadata, isNodeInside, NodeType } from './common.js'

let legend: Record<string, NodeType>
const getLegend = (node: any) => {
  if (!legend) {
    legend = {}
    const legendSection = node.scraped.find((n: any) => n.name === 'Legend' && n.type === 'SECTION')
    const items = legendSection.children.map((c: any) => ({
      name: c.name,
      colorKey: getColorKey(c)
    })).filter((n: any) => n.colorKey)
    items.forEach((item: any) => legend[item.colorKey] = item.name)
  }
  return legend
}

const getColorKey = (node: any) => {
  const fills = node?.fills
  if (!fills) return undefined
  const fill = fills[0]
  if (!fill) return undefined
  const color = fill.color
  return `${color.r}-${color.g}-${color.b}-${color.a}`
}

const getType = (node: any) => getLegend(node)[getColorKey(node)!]

export const getOpenNodeMetadata = (node: any) => {
  const table = getTableMetadata(node)
  if (table) return table
  if (!node.fills) return undefined
  const type = getType(node)
  if (!type)
    return undefined
  const meta = {} as any
  meta.connections = getConnections(node)
  if (type === 'userAction')
    meta.actions = node.scraped
      .filter((n: any) =>
        getType(n) === 'signalListen' &&
        isNodeInside(node.absoluteBoundingBox, n.absoluteBoundingBox))
      .map((n: any) => n.id)
  meta.id = node.id
  meta.type = type
  meta.text = node.name
  return meta
}
