import { findShortestPathToNode } from '../../common/shotestPath.js'
import { getActionsForPath, getPathGatewayValuesForPath } from '../codegen/misc.js'
import { _, camelize, sanitizeText } from '../../common/texts.js'
import { createTable } from '../../common/table.js'

export const generateSubprocessTableTest = (scraped: Scraped, node: ScrapedSubprocess, blockPath: any[]) => {
  const table: ScrapedTable = scraped.find(n => n.type === 'table' && n.text === node.tableKey) as ScrapedTable
  if (!table) return `// table ${node.tableKey} not found!`
  const shortestPath = findShortestPathToNode(scraped, node.id)
  const gatewayValues = getPathGatewayValuesForPath(shortestPath)
  const actions = getActionsForPath(shortestPath)
  const gatewayText = `      const gateways: GatewayCollection = ${JSON.stringify(gatewayValues, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(3)}`)}`
  const actionLines = [
    '      await handles.start(args)',
    ...actions.map((a) => `      await handles.${a}(args)`)]
  const rowTests = createTable(table).values.map(row => {
    const rowCode = `${_(2)}test("${sanitizeText(row.Id)}", async ({ page, context }) => {
      const tableRow = ${JSON.stringify(row, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(3)}`)}
      await testNode({tableRow, page, context})
    })`
    return rowCode
  })

  return `${_(1)}test.describe("${node.text}", ()=>{
    const testNode = async ({tableRow, context, page}: {tableRow: Record<string,string>, page: Page, context: BrowserContext}) => {
${gatewayText}
      const state = await handles.setup({ gateways, page, context, tableRow } as any)
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
${actionLines.slice(0,-1).join('\n')}
      let testFunc = handles.test_${camelize(node.text)}
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
${actionLines.slice(-1)}
      expect(await testFunc(args)).toBeUndefined()
    }
    
${rowTests.join('\n\n')}
  })`
}
