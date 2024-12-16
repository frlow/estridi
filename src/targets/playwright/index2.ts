import { getNodeConnections } from '../../common/filter.js'
import { findShortestPathToNode } from '../../common/shotestPath.js'
import { generateHandlesTypeCode } from './handlesTypes.js'
import { generateTest, getRootNote } from './common.js'
import { _ } from '../../common/texts.js'

const fixIndent = (text: string, indent: number) => {

}

const generateTestBlock = (scraped: Scraped, tree: ReturnType<typeof getTestableNodeTree>, indentation: number = 0) => {
  const testableNodes = tree.nodes.filter(n => n.id)
  const subflows = tree.nodes.filter(n => n.blockPath)
  const usedNames = {}
  return `${_(indentation)}test.describe('${tree.name}', ()=>{
${testableNodes.map(node => generateTest(scraped, node, tree.blockPath, usedNames)).join('\n')}
${subflows.map(subflow => generateTestBlock(scraped, subflow, indentation + 1)).join('\n')}
${_(indentation)}})`
}

export const generatePlaywright2 = async (name: string, scraped: Scraped) => {
  const testableNodeTree = getTestableNodeTree(scraped)
  const handlesTypeCode = generateHandlesTypeCode(scraped, name)
  return `import { BrowserContext, Page, test } from '@playwright/test'
import { handles } from './${name}.js'
${getRootNote(scraped)}

${generateTestBlock(scraped, testableNodeTree)}

${handlesTypeCode}`
}


const getTestableNodeTree = (scraped: Scraped) => {
  const rootNode: ScrapedStart = scraped.find((n: ScrapedStart) => n.isRoot) as ScrapedStart
  const processBlock = (startNode: ScrapedStart, blockPath: any[]) => {
    const testableNodesInBlock: any[] = []
    const processNode = (node: any) => {
      const connections = getNodeConnections(node)
      connections.forEach(c => {
        const connectedNode: any = scraped.find(n => n.id === c)
        if (testableNodesInBlock.some(n => n.id === connectedNode.id)) return
        if (connectedNode.type === 'script' || (connectedNode.type === 'subprocess' && !connectedNode.link && connectedNode.tableKey) || connectedNode.type === 'serviceCall') {
          testableNodesInBlock.push(connectedNode)
        }
        if (connectedNode.link) {
          testableNodesInBlock.push(processBlock(scraped.find(n => n.id === connectedNode.link) as ScrapedStart, findShortestPathToNode(scraped, connectedNode.id)))
          if (connectedNode.next) processNode(scraped.find(n => n.id === connectedNode.next))
        } else
          processNode(connectedNode)
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
