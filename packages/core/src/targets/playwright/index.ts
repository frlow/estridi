import { getNodeConnections } from '../../common/filter.js'
import { findShortestPathToNode } from '../../common/shotestPath.js'
import { generateHandlesTypeCode } from './handlesTypes.js'
import { generateTest } from './common.js'
import { _ } from '../../common/texts.js'
import { getTestName } from './testScript.js'
import { Scraped, ScrapedStart } from '../../scraped'

const generateTestBlock = (scraped: Scraped, tree: ReturnType<typeof getTestableNodeTree>, usedBlockNamesInParent: Record<string, number>, indentation: number = 0) => {
  const testableNodes = tree.nodes.filter(n => n.id)
  const subflows = tree.nodes.filter(n => n.blockPath)
  const usedNames = {}
  const usedBlockNames = {}
  return `${_(indentation)}test.describe('${getTestName(tree.name, usedBlockNamesInParent)}', ()=>{
${testableNodes.map(node => generateTest(scraped, node, tree.blockPath, usedNames)).join('\n')}
${subflows.map(subflow => generateTestBlock(scraped, subflow, usedBlockNames, indentation + 1)).join('\n')}
${_(indentation)}})`
}

export const generatePlaywright = async (name: string, scraped: Scraped) => {
  const testableNodeTree = getTestableNodeTree(scraped)
  const handlesTypeCode = generateHandlesTypeCode(scraped, name)
  return `import { BrowserContext, Page, test, expect } from '@playwright/test'
import { handles } from './${name}.js'

${generateTestBlock(scraped, testableNodeTree, {})}

${handlesTypeCode}`
}


const getTestableNodeTree = (scraped: Scraped) => {
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
