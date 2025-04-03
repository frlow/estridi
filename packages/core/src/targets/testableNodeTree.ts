import { Scraped, ScrapedNode, ScrapedStart } from '../scraped'
import { getNodeConnections } from '../common/filter'
import { findShortestPathToNode } from '../common/shotestPath'

export type Block = { touched: string[], nodes: (ScrapedNode | Block)[], name: string, blockPath: ScrapedNode[] }
export const getTestableNodeTree = (scraped: Scraped) => {
  const rootNode: ScrapedStart = scraped.find((n: ScrapedStart) => n.type === 'root') as ScrapedStart
  type TreeNode = ScrapedNode & { block: Block }
  const rootBlock: Block = { touched: [], nodes: [], name: rootNode.text, blockPath: [] }
  const toProcess: TreeNode[] = [{ ...rootNode, block: rootBlock }]
  let limit = 100000
  while (toProcess.length > 0) {
    if (limit-- === 0) throw 'Caught in loop'
    const current = toProcess.shift()
    if (current.block.touched.some(n => n === current.id)) continue
    current.block.touched.push(current.id)
    if (current.type === 'script' || 
        (current.type === 'subprocess' && !current.link && current.tableKey) || 
        current.type === 'serviceCall') {
      const { block: _, ...temp } = current
      current.block.nodes.push(temp)
    }
    const connections = getNodeConnections(current, true)
    toProcess.push(...connections.map(c => ({ ...scraped.find(n => n.id === c), block: current.block })))
    if ('link' in current && current.link) {
      const linked = scraped.find(n => n.id === current.link)
      const newBlock = {
        touched: [...current.block.touched],
        nodes: [],
        name: linked.text,
        blockPath: findShortestPathToNode(scraped, current.id)
      }
      toProcess.push({ ...linked, block: newBlock })
      current.block.nodes.push(newBlock)
    }
  }

  function removeTouched(obj) {
    for (const prop in obj) {
      if (prop === 'touched')
        delete obj[prop]
      else if (typeof obj[prop] === 'object')
        removeTouched(obj[prop])
    }
  }

  removeTouched(rootBlock)
  return rootBlock
}
