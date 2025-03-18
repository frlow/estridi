import { Scraped, ScrapedNode, ScrapedStart } from '../scraped'
import { getNodeConnections } from './filter'

const findBlockRoot = (
  scraped: Scraped,
  blockPath: any[],
): ScrapedStart | undefined => {
  if (blockPath.length === 0) return undefined
  return scraped.find(
    (n) => n.id === blockPath[blockPath.length - 1].link,
  ) as ScrapedStart
}

export const findShortestPathToNode = (
  scraped: Scraped,
  nodeId: string,
  blockPath: any[] = [],
) => {
  const root =
    findBlockRoot(scraped, blockPath) ||
    scraped.find((n: ScrapedStart) => n.type === 'root')
  if (nodeId === root.id) return []
  let crawled = [[root]]
  let max = 100000

  const validateGateways = (path: ScrapedNode[]) => {
    const gatewayValues = path
      .filter((n) => n.type === 'gateway')
      .map((n) => ({
        name: n.text,
        value: n.options[path[path.indexOf(n) + 1]?.id],
      }))
      .reduce(
        (acc, cur) => ({
          ...acc,
          [cur.name]: [...(acc[cur.name] || []), cur.value],
        }),
        {},
      )
    // Filter out gateway values that are linked but have differing values
    const tested = Object.entries(gatewayValues).map(
      ([key, value]: [string, string[]]) => {
        const different = value.filter((v, i, arr) => arr.indexOf(v) !== i)
        return different || []
      },
    )
    return !tested.some((t) => t.length > 0)
  }
  while (true) {
    const temp: ScrapedNode[][] = []
    for (const path of crawled) {
      const lastNode = path[path.length - 1] as any
      const nodeIds = getNodeConnections(lastNode)
      for (const id of nodeIds) {
        const current: any[] = [scraped.find((n) => n.id === id)]
        if (current[0].variant === 'virtual')
          current.push(scraped.find((n) => n.id === current[0].next))
        const newPath = [...path, ...current]
        if (!validateGateways(newPath)) continue
        if (id === nodeId) {
          return [...blockPath, ...newPath]
        }
        temp.push(newPath)
      }
      crawled = temp
      if (max-- === 0) {
        const problemNode = scraped.find((n) => n.id === nodeId)
        debugger
        throw `Unable to find a valid path to node: ${problemNode.id}: ${problemNode.text}
Check if there are conflicting gateways with the same name in the path. `
      }
    }
  }
}
