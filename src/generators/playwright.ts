import { GenerationResult, Scraped } from '../common.js'
import { getTestData } from '../utils/testData.js'
import * as path from 'node:path'
import { generateTestKeys } from './testKeys.js'

export const generatePlaywrightTests = (scraped: Scraped, dir: string, rootId: string, name: string): GenerationResult[] => {
  const testData = getTestData(scraped, rootId)
  const testedNodeTypes = ['message', 'script', 'subprocess']
  const testedNodes = testData.filter(node => testedNodeTypes.includes(node.type))
  const content = `import { test } from '@playwright/test'
import { testNode, testAllPaths, Handles } from 'estridi/playwright'
import { handles } from './${name}.handles.js'
const t =
  (id: string) =>
  async ({ page, context }: any) =>
    await testNode({ page, context, handles }, id)
test.describe('${name}', () => {
${testedNodes.map(n => `  test('${n.type}: ${n.text}, ${n.id}', t('${n.id}'))`).join('\n')}
  if (process.env.TEST_ALL_PATHS === 'true')
    test.describe('all', () => testAllPaths(handles, test))
})

${generateTestKeys(scraped, rootId)}
export type ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles = Handles<
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey
>`

  const indexFileContent = `import { findAllPaths, Handles } from 'estridi/playwright'
import type { ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles } from './${name}.spec.js'
import scraped from './scraped.json'

export const handles: ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles = {
  handleSetup: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleStart: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleServiceCall: async (key, gateways, args) => {
    switch (key) {
      default:
        debugger
        throw \`\${key} not implemented\`
    }
  },
  handleAction: async (key, gateways, args) => {
    switch (key) {
      default:
        debugger
        throw \`\${key} not implemented\`
    }
  },
  handleTestNode: async (key, paths, args) => {
    switch (key) {
      default:
        debugger
        throw \`\${key} not implemented\`
    }
  },
  scraped,
  allPaths: findAllPaths(scraped, "${rootId}")
}
`
  return [
    { content: content, overwrite: true, file: path.join(dir, `${name}.spec.ts`) },
    { content: indexFileContent, overwrite: false, file: path.join(dir, `${name}.handles.ts`) }
  ]
}
