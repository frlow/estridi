import { Scraped, ScrapedNode, ScrapedStart, ScrapedSubprocess } from '../scraped'

export const getNodeConnections = (node: any): string[] => {
  return [node.next, ...Object.keys(node.options || {}), ...Object.keys(node.actions || {}), node.link].filter(((n, index, array) => n && array.indexOf(n) === index))
}

export const filterScraped = (scraped: Scraped, rootName: string): Scraped => {
  const processNode = (node: ScrapedNode, distance: number) => {
    if (!node) return
    if (acc[node.id]) return
    node.distance = distance
    acc[node.id] = node
    const connections = getNodeConnections(node)
    connections.forEach(c => processNode(scraped.find(n => n.id === c), distance + 1))
    if ((node as ScrapedSubprocess).tableKey) {
      const table = scraped.find(n => n.type === 'table' && n.text === (node as ScrapedSubprocess).tableKey)
      if (table && !acc[table.id]) acc[table.id] = table
    }
  }
  const acc: Record<string, ScrapedNode> = {}
  const root = scraped.find(
    (r: ScrapedStart) => r.type === 'root' && r.raw === rootName
  )
  processNode(root, 0)
  // scraped.filter((s) => s.type === 'table').forEach((t) => (acc[t.id] = t))
  return Object.values(acc)
}
