import { Scraped, ScrapedStart } from '../scraped'

export const getRootName =
  (scraped: Scraped, name: string | undefined): string | undefined => {
    const rootNodes: ScrapedStart[] = scraped
      .filter((node: ScrapedStart) => node.type === 'root') as ScrapedStart[]
    if (!name && rootNodes.length === 1) return rootNodes[0].raw
    if (name && rootNodes.find(n => n.raw === name))
      return rootNodes.find(n => n.raw === name).raw
    return undefined
  }
