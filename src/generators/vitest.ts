import { GenerationResult, Scraped, scrapedFile, testedNodeTypes } from '../common.js'
import { getTestData } from '../utils/testData.js'
import * as path from 'node:path'
import { generateTestKeys } from './testKeys.js'
import { handlesContent, handlesKeys } from './handles.js'

export const generateVitestTests = (scraped: Scraped, dir: string, rootId: string, name: string): GenerationResult[] => {
  const testData = getTestData(scraped, rootId)

  const testedNodes = testData.filter(node => testedNodeTypes.includes(node.type) && !node.linked)
  const content = `import { test, describe } from 'vitest'
import { createTester, Handles, loadScraped } from 'estridi'
import { handles, State } from './${name}.handles.js'
export type RootId = '${rootId}'
const scraped = loadScraped()
const { testNode, getVariants } = createTester(scraped, '${rootId}', handles)
const t = (id: string) => () => {
  for (const variant of getVariants(id))
    test(variant.name, () =>
      testNode(id, { variant })
    )
}
describe('${name}', () => {
${testedNodes.map(n => `  describe('${n.type}: ${n.text}, ${n.id}', t('${n.id}'))`).join('\n')}
})

${generateTestKeys(scraped, rootId)}
${handlesKeys(name, '{}')}
`

  const handles = handlesContent(name, `${name}.test.js`)
  return [
    { content: content, overwrite: true, file: path.join(dir, `${name}.test.ts`) },
    { content: handles, overwrite: false, file: path.join(dir, `${name}.handles.ts`) }
  ]
}
