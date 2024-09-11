import {Scraped, ScrapedNode, ScrapedStart} from "./scraped";
import {RootsConfig} from "./index";

export const filterScraped = (scraped: Scraped, roots: RootsConfig): Scraped => {
  const processNode = (node: any) => {
    if (!node) return
    if (acc[node.id]) return
    acc[node.id] = node
    if (node.next) processNode(scraped.find(n => n.id === node.next))
    if (node.options) Object.keys(node.options).forEach(o => processNode(scraped.find(n => n.id === o)))
    if (node.actions)
      Object.keys(node.actions).forEach(a => processNode(scraped.find(n => n.id === a)))
    if (node.link) processNode(scraped.find(n => n.id === node.link))
  }
  const acc: Record<string, ScrapedNode> = {}
  const rootNodes = scraped.filter((node: ScrapedStart) => node.isRoot)
  rootNodes.forEach(n => processNode(n))
  return Object.values(acc)
}
