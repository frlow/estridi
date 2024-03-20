import { GenerationResult, Scraped } from '../common.js'
import { getTestData } from '../utils/testData.js'
import * as path from 'node:path'

export const generatePlaywrightTests = (scraped: Scraped, dir: string, rootId: string, name: string): GenerationResult[] => {
  const testData = getTestData(scraped, rootId)
  const testedNodeTypes = ['message', 'script', 'subprocess']
  const testedNodes = testData.filter(node => testedNodeTypes.includes(node.type))
  const content = `import { test } from '@playwright/test'
import { testNode } from 'estridi/playwright'
import { handles } from './${name}.handles.js'

test.describe('${name}', () => {
${testedNodes.map(n => `  test('${n.type}: ${n.text}, ${n.id}', async ({ page, context }) => await testNode({ page, context, handles }, '${n.id}'))`).join('\n')}
})`

  const indexFileContent = `import { findAllPaths, Handles } from 'estridi/playwright'
import { ActionKey, GatewayKey, scraped, ServiceCallKey, TestNodeKey } from './${name}.scraped.js'

export const handles: Handles<
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey
> = {
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
