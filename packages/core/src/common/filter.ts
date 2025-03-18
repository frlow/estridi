import { Scraped, ScrapedNode, ScrapedStart, ScrapedSubprocess } from '../scraped'

export const getNodeConnections = (node: any, ignoreLinks?: boolean): string[] => {
  const possibleConnections = [
    node.next,
    ...Object.keys(node.options || {}),
    ...Object.keys(node.actions || {}),
    (ignoreLinks ? undefined : node.link)
  ]
  const definedConnections = possibleConnections.filter(c=>c)
  const uniqueConnections = definedConnections.filter(((n, index, arr) => {
    return n && arr.indexOf(n) === index
  }))
  return uniqueConnections
}

export const processNode = ({ distance = 0, node, scraped, acc = {}, ignoreLinks }: {
  node: ScrapedNode,
  distance?: number,
  scraped: Scraped,
  acc?: Record<string, ScrapedNode>,
  ignoreLinks?: boolean
}): Record<string, ScrapedNode> => {
  if (!node) return
  if (acc[node.id]) return
  node.distance = distance
  acc[node.id] = node
  const connections = getNodeConnections(node, ignoreLinks)
  connections.forEach(c => processNode({
    scraped,
    node: scraped.find(n => n.id === c),
    distance: distance + 1,
    acc,
    ignoreLinks
  }))
  if ((node as ScrapedSubprocess).tableKey) {
    const table = scraped.find(n => n.type === 'table' && n.text === (node as ScrapedSubprocess).tableKey)
    if (table && !acc[table.id]) acc[table.id] = table
  }
  return acc
}

export const filterScraped = (scraped: Scraped, rootName: string): Scraped => {
  const root = scraped.find(
    (r: ScrapedStart) => r.type === 'root' && r.raw === rootName
  )
  const processed = processNode({ node: root, scraped })
  // scraped.filter((s) => s.type === 'table').forEach((t) => (acc[t.id] = t))
  return Object.values(processed)
}
