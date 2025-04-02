import fs from 'node:fs'
import { processTldraw } from '../sources/tldraw'
import path from 'node:path'
import {
  Scraped,
  ScrapedNode,
  ScrapedStart,
  ScrapedSubprocess,
} from '../scraped'

export const getNodeConnections = (
  node: any,
  ignoreLinks?: boolean,
): string[] => {
  const possibleConnections = [
    node.next,
    ...Object.keys(node.options || {}),
    ...Object.keys(node.actions || {}),
    ignoreLinks ? undefined : node.link,
  ]
  const definedConnections = possibleConnections.filter((c) => c)
  const uniqueConnections = definedConnections.filter((n, index, arr) => {
    return n && arr.indexOf(n) === index
  })
  return uniqueConnections
}

export const processNode = ({
  node,
  scraped,
  acc = {},
  ignoreLinks,
}: {
  node: ScrapedNode
  scraped: Scraped
  acc?: Record<string, ScrapedNode>
  ignoreLinks?: boolean
}): Record<string, ScrapedNode> => {
  if (!node) return
  if (acc[node.id]) return
  acc[node.id] = node
  const connections = getNodeConnections(node, ignoreLinks)
  connections.forEach((c) =>
    processNode({
      scraped,
      node: scraped.find((n) => n.id === c),
      acc,
      ignoreLinks,
    }),
  )
  if ((node as ScrapedSubprocess).tableKey) {
    const table = scraped.find(
      (n) =>
        n.type === 'table' && n.raw === (node as ScrapedSubprocess).tableKey,
    )
    if (table && !acc[table.id]) acc[table.id] = table
  }
  return acc
}

export const filterScraped = (scraped: Scraped, rootName: string): Scraped => {
  const root = scraped.find(
    (r: ScrapedStart) => r.type === 'root' && r.raw === rootName,
  )
  const processed = processNode({ node: root, scraped })
  return Object.values(processed)
}

export const getTestCase = async (name?: string) => {
  const raw = fs.readFileSync(path.join(__dirname, 's3d.json'), 'utf8')
  const data = JSON.parse(raw)

  const scraped = await processTldraw(data)
  return name ? filterScraped(scraped, name) : scraped
}
