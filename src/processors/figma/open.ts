import { getTableMetadata } from './common.js'

const colors: Record<string, string> = {
  '1-0.7803921699523926-0.7607843279838562-1': 'script',
  '0.686274528503418-0.95686274766922-0.7764706015586853-1': 'serviceCall',
  '0.8941176533699036-0.800000011920929-1-1': 'action',
  '1-0.8039215803146362-0.16078431904315948-1': 'start',
  '0.11764705926179886-0.11764705926179886-0.11764705926179886-1': 'end',
  '0.7411764860153198-0.8901960849761963-1-1': 'gateway',
  '1-0.9098039269447327-0.6392157077789307-1': 'subprocess'
}

export const getOpenNodeMetadata = (node: any) => {
  const table = getTableMetadata(node)
  if (table) return table
  if (!node.fills) return undefined
  const color = node.fills[0].color
  const colorKey = `${color.r}-${color.g}-${color.b}-${color.a}`
  const type = colors[colorKey]
  if (!type)
    return undefined
  const meta = {} as any
  meta.connections = node.scraped
    .filter((n: any) =>
      n.type === 'CONNECTOR' &&
      !n.strokeDashes &&
      n.connectorStart.endpointNodeId === node.id)
    .reduce((acc: any, cur: any) => ({ ...acc, [cur.connectorEnd.endpointNodeId]: cur.name || 'N/A' }), {})
  meta.id = node.id
  meta.type = type
  meta.text = node.name
  return meta
}
