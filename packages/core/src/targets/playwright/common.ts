import { generateScriptTest } from './testScript.js'
import { Scraped, ScrapedNode } from '../../scraped'

export const generateTest = (
  scraped: Scraped,
  node: ScrapedNode,
  blockPath: any[],
  usedNames: Record<string, number>
): string => {
  if (node.type === 'script' || node.type === 'serviceCall') {
    return generateScriptTest(scraped, node, blockPath, usedNames)
  } else {
    debugger
  }
}
