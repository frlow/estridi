import { GenerationResult, Scraped, scrapedFile, testedNodeTypes } from '../common.js'
import { getTestData } from '../utils/testData.js'
import * as path from 'node:path'
import { generateTestKeys } from './testKeys.js'
import { handlesContent, handlesKeys } from './handles.js'

export const generateVitestTests = (scraped: Scraped, dir: string, rootId: string, name: string): GenerationResult[] => {
  const testData = getTestData(scraped, rootId)

  const testedNodes = testData.filter(node => testedNodeTypes.includes(node.type) && !node.linked)
  const content = `import { test, describe } from 'vitest'
import { createTester, Handles } from 'estridi'
import scraped from './${scrapedFile}'
import { handles, State } from './${name}.handles.js'
const { testNode } = createTester(scraped, '${rootId}', handles)
const t = (id: string) => () => testNode(id)
describe('${name}', () => {
${testedNodes.map(n => `  test('${n.type}: ${n.text}, ${n.id}', t('${n.id}'))`).join('\n')}
})

${generateTestKeys(scraped, rootId)}
${handlesKeys(name, 'void')}
`

  const handles = handlesContent(name, `${name}.test.js`)
  return [
    { content: content, overwrite: true, file: path.join(dir, `${name}.test.ts`) },
    { content: handles, overwrite: false, file: path.join(dir, `${name}.handles.ts`) }
  ]
}
