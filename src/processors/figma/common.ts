import { Scraped } from '../../common.js'

export const processNode = (node: any, acc: Record<string, any>) => {
  if (acc[node.id]) return
  acc[node.id] = node
  const children = node.children || []
  children.forEach((c: any) => processNode(c, acc))
}

export const processFigmaDocument = (document: any, getNodeMetadata: (node: any)=>any): Scraped => {
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
