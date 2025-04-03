import fs from 'node:fs'
import { processTldraw } from '../sources/tldraw'
import path from 'node:path'
import { Scraped, ScrapedNode, ScrapedStart } from '../scraped'
import { loadFigmaDocument, processFigma } from '../sources/figma'

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
  return acc
}

export const filterScraped = (scraped: Scraped, rootName: string): Scraped => {
  const root = scraped.find(
    (r: ScrapedStart) => r.type === 'root' && r.raw === rootName,
  )
  const processed = processNode({ node: root, scraped })
  const filtered = Object.values(processed)
  filtered.push(...scraped.filter((n) => n.type === 'table'))
  return filtered
}

export const getTestCase = async (name?: string) => {
  const raw = fs.readFileSync(path.join(__dirname, 's3d.json'), 'utf8')
  const data = JSON.parse(raw)

  const scraped = await processTldraw(data)
  return name ? filterScraped(scraped, name) : scraped
}

export const getFigmaData = async () => {
  const configPath = path.join(__dirname, 'estridi.json')
  const figmaDataPath = path.join(__dirname, 'figma.json')
  const estridiConfig = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : undefined
  const data = estridiConfig
    ? await loadFigmaDocument(estridiConfig)
    : JSON.parse(fs.readFileSync(figmaDataPath, 'utf8'))
  if (estridiConfig)
    fs.writeFileSync(figmaDataPath, JSON.stringify(data, null, 2), 'utf8')
  return await processFigma(data)
}
