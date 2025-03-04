import { generateHandlesTypeCode } from './handlesTypes.js'
import { generateTest } from './common.js'
import { _ } from '../../common/texts.js'
import { getTestName } from './testScript.js'
import { Scraped, ScrapedNode } from '../../scraped'
import { Block, getTestableNodeTree } from '../testableNodeTree'
import { EstridiGeneratorOptions } from '../../index'

const generateTestBlock = (scraped: Scraped, tree: ReturnType<typeof getTestableNodeTree>, usedBlockNamesInParent: Record<string, number>, indentation: number = 0) => {
  const testableNodes = tree.nodes.filter(n => "id" in n && n.id) as ScrapedNode[]
  const subflows = tree.nodes.filter(n => "blockPath" in n &&  n.blockPath) as Block[]
  const usedNames = {}
  const usedBlockNames = {}
  return `${_(indentation)}test.describe('${getTestName(tree.name, usedBlockNamesInParent)}', ()=>{
${testableNodes.map(node => generateTest(scraped, node, tree.blockPath, usedNames)).join('\n')}
${subflows.map(subflow => generateTestBlock(scraped, subflow, usedBlockNames, indentation + 1)).join('\n')}
${_(indentation)}})`
}

export const generatePlaywright = async (name: string, scraped: Scraped, options: EstridiGeneratorOptions) => {
  const testableNodeTree = getTestableNodeTree(scraped)
  const handlesTypeCode = generateHandlesTypeCode(scraped, name, options.splitHandles)
  return `import { BrowserContext, Page, test, expect } from '@playwright/test'
import { handles } from './${name}.js'

${generateTestBlock(scraped, testableNodeTree, {})}

${handlesTypeCode}`
}


