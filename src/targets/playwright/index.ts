import { getTestableNodes } from '../codegen/misc.js'
import { generateHandlesTypeCode } from './handlesTypes.js'
import { generateTest, getRootNote } from './common.js'

export const generatePlaywright = async (name: string, scraped: Scraped) => {
  const testableNodes = getTestableNodes(scraped)
  testableNodes.sort((a, b) => a.distance > b.distance ? 1 : -1)
  const usedNames = {}
  const handlesTypeCode = generateHandlesTypeCode(scraped, name)
  return `import { BrowserContext, Page, test } from '@playwright/test'
import { handles } from './${name}.js'
${getRootNote(scraped)}
test.describe('${name}', () => {
${testableNodes
    .map((node) => generateTest(scraped, node, [], usedNames))
    .join('\n')}
})

${handlesTypeCode}`
}
