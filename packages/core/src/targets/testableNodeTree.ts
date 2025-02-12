import { Scraped, ScrapedStart } from '../scraped'
import { getNodeConnections } from '../common/filter'
import { findShortestPathToNode } from '../common/shotestPath'
import { autoText } from '../common/texts'

export const getTestableNodeTree = (scraped: Scraped) => {
  const rootNode: ScrapedStart = scraped.find((n: ScrapedStart) => n.type === 'root') as ScrapedStart
  const processBlock = (startNode: ScrapedStart, blockPath: any[]) => {
    const testableNodesInBlock: any[] = []
    const touchedNodesInBlock: any[] = []
    const processNode = (node: any) => {
      const connections = getNodeConnections(node)
      connections.forEach(c => {
        const connectedNode: any = scraped.find(n => n.id === c)
        if (touchedNodesInBlock.some(n => n.id === connectedNode.id)) return
        touchedNodesInBlock.push(connectedNode)
        if (connectedNode.type === 'script' || (connectedNode.type === 'subprocess' && !connectedNode.link && connectedNode.tableKey) || connectedNode.type === 'serviceCall') {
          testableNodesInBlock.push(connectedNode)
        }
        if (connectedNode.link) {
          if (blockPath.some(n => n.id === connectedNode.link)) return
          const blockNode = processBlock(scraped.find(n => n.id === connectedNode.link) as ScrapedStart, findShortestPathToNode(scraped, connectedNode.id))
          testableNodesInBlock.push(blockNode)
          if (connectedNode.next) processNode(scraped.find(n => n.id === connectedNode.next))
        } else {
          processNode(connectedNode)
        }
      })
    }
    processNode(startNode)
    return {
      name: startNode.text,
      nodes: testableNodesInBlock,
      blockPath
    }
  }
  const testableNodeTree = processBlock(rootNode, [])
  return testableNodeTree
}
