export const getRootName = (scraped: Scraped, name: string | undefined): string | undefined => {
  const rootNodes: ScrapedStart[] = scraped.filter((node: ScrapedStart) => node.isRoot) as ScrapedStart[]
  if (!name && rootNodes.length === 1) return rootNodes[0].text
  if (name && rootNodes.find(n => n.text === name)) return rootNodes.find(n => n.text === name).text
  return undefined
}
