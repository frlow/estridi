import { Scraped, ScrapedNode, ScrapedStart } from './scraped.js'

export const filterScraped = (scraped: Scraped, rootName: string): Scraped => {
  const processNode = (node: any) => {
    if (!node) return
    if (acc[node.id]) return
    acc[node.id] = node
    if (node.next) processNode(scraped.find((n) => n.id === node.next))
    if (node.options)
      Object.keys(node.options).forEach((o) =>
        processNode(scraped.find((n) => n.id === o)),
      )
    if (node.actions)
      Object.keys(node.actions).forEach((a) =>
        processNode(scraped.find((n) => n.id === a)),
      )
    if (node.link) processNode(scraped.find((n) => n.id === node.link))
  }
  const acc: Record<string, ScrapedNode> = {}
  const root = scraped.find(
    (r: ScrapedStart) => r.isRoot && r.text === rootName,
  )
  processNode(root)
  // const rootNodes = scraped.filter((node: ScrapedStart) => node.isRoot)
  // rootNodes.forEach(n => processNode(n))
  scraped.filter((s) => s.type === 'table').forEach((t) => (acc[t.id] = t))
  return Object.values(acc)
}
