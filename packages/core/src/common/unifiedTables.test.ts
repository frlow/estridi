import { describe, expect, test } from 'vitest'
import { getTestCase } from '../test/editorTestCases'
import { injectUnifiedTables } from './unifiedTables'
import { generatePlaywright } from '../targets/playwright'

describe('Unified tables', () => {
  test('replace linked table with gateways, playwright out', async () => {
    const testCase = await getTestCase('linked-table')
    const replacedTable = await injectUnifiedTables(testCase)
    const code = await generatePlaywright('linked-table', replacedTable, {})
    expect(code).toContain(`test('Validate Linked Table CCC', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Validate Linked Table': 'CCC'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_validateLinkedTableCcc
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })`)
  })
})
