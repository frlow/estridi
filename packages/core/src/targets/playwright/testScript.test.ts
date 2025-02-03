import { describe, expect, test } from 'vitest'
import { filterScraped } from '../../common/filter.js'
import { processFigma } from '../../sources/figma.js'
import { generateScriptTest } from './testScript.js'
import { getFigmaTestData } from '../../test/testCases'
import { ScrapedScript } from '../../scraped'

describe('generate test script', () => {
  test('Generate test for script', async () => {
    const scraped = filterScraped(await processFigma(getFigmaTestData()), 'main')
    const node: ScrapedScript = scraped.find(n => n.id === '6630:6359') as ScrapedScript
    const testScriptText = generateScriptTest(scraped, node, [], {})
    expect(testScriptText).toEqual(`  test('Go back to Payee', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    let testFunc = handles.test_goBackToPayee
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.action_mottagareFortsattClicked(args)
    expect(await testFunc(args)).toBeUndefined()
  })`)
  })

  test('Script with no actions', async () => {
    const scraped = filterScraped(await processFigma(getFigmaTestData()), 'main')
    const node: ScrapedScript = scraped.find(n => n.id === '3085:4080') as ScrapedScript
    const testScriptText = generateScriptTest(scraped, node, [], {})
    expect(testScriptText).toEqual(`  test('Could not load page', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)

    let testFunc = handles.test_couldNotLoadPage
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.start(args)
    expect(await testFunc(args)).toBeUndefined()
  })`)
  })
})
