import { GenerationResult, Scraped, scrapedFile, testedNodeTypes } from '../common.js'
import { getTestData } from '../utils/testData.js'
import * as path from 'node:path'
import { generateTestKeys } from './testKeys.js'
import { handlesContent, handlesKeys } from './handles.js'

export const generatePlaywrightTests = (scraped: Scraped, dir: string, rootId: string, name: string, missingSubProcesses: Record<string, null>): GenerationResult[] => {
  const testData = getTestData(scraped, rootId, missingSubProcesses)

  const testedNodes = testData.filter(node => testedNodeTypes.includes(node.type))
  const content = `import { test, Page, BrowserContext } from '@playwright/test'
import { createTester, Handles } from 'estridi'
import scraped from './${scrapedFile}'
import { handles, State } from './${name}.handles.js'
const { allPaths, testNode, testPath } = createTester(scraped, '${rootId}', handles)
const t = (id: string) => ({context, page}: {context: BrowserContext, page: Page}) => testNode(id, {context, page})
test.describe('${name}', () => {
${testedNodes.map(n => `  test('${n.type}: ${n.text}, ${n.id}', t('${n.id}'))`).join('\n')}
  if (process.env.TEST_ALL_PATHS === 'true')
    test.describe('all paths', () => {
      for (const path of allPaths) {
        test(path.join(', '), ({ context, page }) => testPath(path, { context, page }))
      }
    })
})

${generateTestKeys(scraped, rootId)}
${handlesKeys(name, '{page: Page, context: BrowserContext}')}`

  const handles = handlesContent(name, `${name}.spec.js`)
  return [
    { content: content, overwrite: true, file: path.join(dir, `${name}.spec.ts`) },
    { content: handles, overwrite: false, file: path.join(dir, `${name}.handles.ts`) }
  ]
}
