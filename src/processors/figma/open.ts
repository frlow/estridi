import { getConnections, getTableMetadata, isNodeInside, sanitizeText } from './common.js'
import { NodeType } from '../index.js'

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

const isInLegend = (node: any) => {
  const legendSection = node.scraped.find((n: any) => n.name === 'Legend' && n.type === 'SECTION')
  return !!legendSection.children.some((c: any) => c.id === node.id)
}

export const getOpenNodeMetadata = (node: any) => {
  if (isInLegend(node)) return undefined
  const table = getTableMetadata(node)
  if (table) return table
  if (!node.fills) return undefined
  const type = getType(node)
  if (!type)
    return undefined
  const meta = {} as any
  if (type === 'userAction')
    meta.actions = node.scraped
      .filter((n: any) =>
        getType(n) === 'signalListen' &&
        isNodeInside(node.absoluteBoundingBox, n.absoluteBoundingBox))
      .map((n: any) => n.id)
  meta.connections = getConnections(node)
  meta.id = node.id
  meta.type = type
  meta.text = sanitizeText(node.name)
  return meta
}
