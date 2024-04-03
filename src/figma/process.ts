import { getNodeMetadata } from './nodes.js'

const processNode = (node: any, acc: Record<string, any>) => {
  if (acc[node.id]) return
  acc[node.id] = node
  const children = node.children || []
  children.forEach((c: any) => processNode(c, acc))
}

export const processFigmaDocument = (document: any) => {
  const acc: Record<string, any> = {}
  processNode(document, acc)
  const nodes = Object.values(acc)
  nodes.forEach(n => n.scraped = nodes)
  const mappedNodes = nodes.map(node => getNodeMetadata(node)).filter(n => n)
  mappedNodes.filter(node => node.type === 'subprocess').forEach(node => {
    const link = mappedNodes.find(n => n.type === 'start' && n.text === node.text)
    if (link) node.linked = true
  })
  return mappedNodes
}
