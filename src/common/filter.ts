export const filterScraped = (scraped: Scraped, rootName: string): Scraped => {
  const processNode = (node: any, distance: number) => {
    if (!node) return
    if (acc[node.id]) return
    node.distance = distance
    acc[node.id] = node
    if (node.next) processNode(scraped.find((n) => n.id === node.next), distance + 1)
    if (node.options)
      Object.keys(node.options).forEach((o) =>
        processNode(scraped.find((n) => n.id === o), distance + 1)
      )
    if (node.actions)
      Object.keys(node.actions).forEach((a) =>
        processNode(scraped.find((n) => n.id === a), distance + 1)
      )
    if (node.link) processNode(scraped.find((n) => n.id === node.link), distance + 1)
  }
  const acc: Record<string, ScrapedNode> = {}
  const root = scraped.find(
    (r: ScrapedStart) => r.isRoot && r.raw === rootName
  )
  processNode(root, 0)
  // const rootNodes = scraped.filter((node: ScrapedStart) => node.isRoot)
  // rootNodes.forEach(n => processNode(n))
  scraped.filter((s) => s.type === 'table').forEach((t) => (acc[t.id] = t))
  return Object.values(acc)
}
