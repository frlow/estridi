import { describe, expect, test } from 'vitest'
import { filterScraped } from '../../common/filter.js'
import { processFigma } from '../../sources/figma.js'
import { generateSubprocessTableTest } from './subprocessTable.js'
import { getFigmaTestData } from '../../test/testCases'
import { ScrapedSubprocess } from '../../scraped'

describe('generate test script for table', () => {
  test('Generate test for script', async () => {
    const scraped = filterScraped(await processFigma(getFigmaTestData()), 'main')
    const node: ScrapedSubprocess = scraped.find(n => n.id === '3229:5714') as ScrapedSubprocess
    const testScriptText = generateSubprocessTableTest(scraped, node, [])
    expect(testScriptText).toEqual(`  test.describe("Validate fields Payment data", ()=>{
    const testNode = async ({tableRow, context, page}: {tableRow: Record<string,string>, page: Page, context: BrowserContext}) => {
      const gateways: GatewayCollection = {
        'Any errors loading data': 'no',
        'empty array from getAccounts': 'no',
        'Is Konto selected': 'yes',
        'Any validation errors from mottagare': 'no'
      }
      const state = await handles.setup({ gateways, page, context, tableRow } as any)
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
      await handles.start(args)
      await handles.action_franFortsattClicked(args)
      await handles.action_mottagareFortsattClicked(args)
      let testFunc = handles.test_validateFieldsPaymentData
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
      await handles.action_signeraMottagreLaggTillButtonClicked(args)
      expect(await testFunc(args)).toBeUndefined()
    }
    
    test("Valuta", async ({ page, context }) => {
      const tableRow = {
        "Id": "Valuta",
        "Component type": "DropdownInputSelect",
        "Properties": "Required",
        "Specific requirements": "Default value “Välj land”"
      }
      await testNode({tableRow, page, context})
    })

    test("Belopp", async ({ page, context }) => {
      const tableRow = {
        "Id": "Belopp",
        "Component type": "Input field",
        "Properties": "Required\\nDecimal [Format: 1-14 integers, 0-2 decimals]",
        "Specific requirements": ""
      }
      await testNode({tableRow, page, context})
    })

    test("Betala i SEK", async ({ page, context }) => {
      const tableRow = {
        "Id": "Betala i SEK",
        "Component type": "Checkbox",
        "Properties": "Optional",
        "Specific requirements": ""
      }
      await testNode({tableRow, page, context})
    })

    test("Avgift", async ({ page, context }) => {
      const tableRow = {
        "Id": "Avgift",
        "Component type": "Radio button",
        "Properties": "Required if shown",
        "Specific requirements": "Preselect “Jag betalar samtliga avgifter”"
      }
      await testNode({tableRow, page, context})
    })

    test("Meddelande till mottagaren", async ({ page, context }) => {
      const tableRow = {
        "Id": "Meddelande till mottagaren",
        "Component type": "textarea",
        "Properties": "Optional \\nString [Format: 1-140 characters]",
        "Specific requirements": ""
      }
      await testNode({tableRow, page, context})
    })

    test("Betalningsreferens", async ({ page, context }) => {
      const tableRow = {
        "Id": "Betalningsreferens",
        "Component type": "Input field",
        "Properties": "Optional\\nString [Format: 1-35 characters]",
        "Specific requirements": ""
      }
      await testNode({tableRow, page, context})
    })
  })`)
  })
})
