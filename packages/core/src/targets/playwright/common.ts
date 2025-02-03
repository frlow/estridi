import { generateScriptTest } from './testScript.js'
import { generateSubprocessTableTest } from './subprocessTable.js'
import { Scraped, ScrapedNode } from '../../scraped'

export const generateTest = (
  scraped: Scraped,
  node: ScrapedNode,
  blockPath: any[],
  usedNames: Record<string, number>
): string => {
  if (node.type === 'script' || node.type === 'serviceCall') {
    return generateScriptTest(scraped, node, blockPath, usedNames)
  } else if (node.type === 'subprocess' && node.tableKey) {
    return generateSubprocessTableTest(scraped, node, blockPath)
  } else {
    debugger
  }
}
