import { Scraped } from '../common'
import { GenerationResult } from './index'
import { getTestData } from './utils/testData'
import * as path from 'node:path'

export const generatePlaywrightTests = (scraped: Scraped, dir: string, name: string): GenerationResult => {
  const testData = getTestData(scraped)
  const messages = testData.filter(node => node.type === 'message')
  const scripts = testData.filter(node => node.type === 'script')
  const content = `import { test } from '@playwright/test'
import { testNode } from './utils'
import { handles } from './index'

test.describe('${name}', () => {
${[...messages, ...scripts].map(n => `  test('${n.type}: ${n.text}, ${n.id}', async ({ page, context }) => await testNode({ page, context, handles }, '${n.id}'))`).join('\n')}
})`
  return { content: content, overwrite: true, file: path.join(dir, `${name}.test.ts`) }
}
