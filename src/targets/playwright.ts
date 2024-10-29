import { _, camelize, sanitizeText } from '../common/texts.js'
import {
  getActionNames,
  getGatewayNames,
  getServiceCallNames,
  getServiceCallsCode,
  getTestNames
} from './codegen/handlesType.js'
import { findShortestPathToNode } from '../common/shotestPath.js'
import { getTestableNodes } from './codegen/misc.js'
import { createTable } from '../common/table.js'

const getPathGatewayValuesForPath = (path: ScrapedNode[]) =>
  path
    .filter((n) => n.type === 'gateway')
    .reduce(
      (acc, cur) => ({
        ...acc,
        [cur.text.replace('*', '')]:
          cur.options[path[path.indexOf(cur) + 1].id]
      }),
      {}
    )

const getActionsForPath = (path: ScrapedNode[]) => {
  return path
    .filter((n) => n.type === 'userAction')
    .filter((a) => {
      const nextId = path[path.indexOf(a) + 1].id
      return a.next !== nextId
    })
    .map((a) => {
      const nextText = a.actions[path[path.indexOf(a) + 1].id]
      return `action_${camelize(nextText)}`
    })
}

const usedNames: Record<string, number> = {}
const getTestName = (name: string): string => {
  usedNames[name] = usedNames[name] !== undefined ? usedNames[name] + 1 : 0
  if (usedNames[name]) return `${name} ${usedNames[name]}`
  return name
}


const generateScriptTest = (scraped: Scraped, node: ScrapedScript) => {
  const shortestPath = findShortestPathToNode(scraped, node.id)
  const gatewayValues = getPathGatewayValuesForPath(shortestPath)
  const actions = getActionsForPath(shortestPath)
  const testText = `    await handles.test_${camelize(node.text.replace('*', ''))}(args${node.customTest ? ', { actions }' : ''})`
  const actionsText = node.customTest
    ? `    const actions = [
${actions.map((a) => `      '${a}'`).join(',\n')}
    ]`
    : actions.map((a) => `    await handles.${a}(args)`).join('\n')
  return `  test('${getTestName(node.text)}', async ({ page, context }) => {
    const gateways: GatewayCollection = ${JSON.stringify(gatewayValues, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(2)}`)}
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
${actionsText}
${testText}
  })`
}

const generateSubprocessTableTest = (scraped: Scraped, node: ScrapedSubprocess) => {
  const table: ScrapedTable = scraped.find(n => n.type === 'table' && n.text === node.tableKey) as ScrapedTable
  if (!table) return `// table ${node.tableKey} not found!`
  const shortestPath = findShortestPathToNode(scraped, node.id)
  const gatewayValues = getPathGatewayValuesForPath(shortestPath)
  const actions = getActionsForPath(shortestPath)
  const actionsText = actions.map((a) => `${_(3)}await handles.${a}(args)`).join('\n')
  const testText = `${_(3)}await handles.test_${camelize(node.text.replace('*', ''))}(args)`
  const rowTests = createTable(table).values.map(row => {
    const rowCode = `${_(2)}test("${sanitizeText(row.Id)}", async ({ page, context }) => {
      const tableRow = ${JSON.stringify(row, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(3)}`)}
      await testNode({tableRow, page, context})
    })`
    return rowCode
  })
  const code = `${_(1)}test.describe("${node.text}", ()=>{
    const testNode = async ({tableRow, context, page}: {tableRow: Record<string,string>, page: Page, context: BrowserContext}) => {
      const gateways: GatewayCollection = ${JSON.stringify(gatewayValues, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(3)}`)}
      const state = await handles.setup({ gateways, page, context, tableRow })
      const args = { gateways, state, page, context, tableRow }
      await handleServiceCalls(args)
      await handles.start(args)
${actionsText}
${testText}
    }
    
${rowTests.join('\n\n')}
  })`
  return code
}

const generateTest = (scraped: Scraped, node: ScrapedNode): string => {
  if (node.type === 'script') {
    return generateScriptTest(scraped, node)
  } else if (node.type === 'subprocess' && node.tableKey) {
    return generateSubprocessTableTest(scraped, node)

  } else {
    debugger
  }
}

export const generatePlaywright = async (name: string, scraped: Scraped) => {
  const testableNodes = getTestableNodes(scraped)

  const handlesTypeCode = generateHandlesTypeCode(scraped, name)
  return `import { BrowserContext, Page, test } from '@playwright/test'
import { handles } from './${name}.js'

test.describe('${name}', () => {
${testableNodes
    .map((node) => generateTest(scraped, node))
    .join('\n')}
})

${handlesTypeCode}`
}

const generateHandlesTypeCode = (scraped: Scraped, name: string) => {
  const gatewayNameLines = getGatewayNames(scraped).map(
    (text) => `${_(1)}'${text}'`
  )
  const typeDefCode = `export const Gateways = [
${gatewayNameLines.join(',\n')}
] as const

export type GatewayKey = (typeof Gateways)[number]
export type GatewayCollection = Partial<Record<GatewayKey, string>>

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection
  state: TState
  page: Page & TPageExtensions
  context: BrowserContext
  tableRow?: Record<string,string>
}

export type TestOptions = {
  actions?: string[]
}`

  const serviceCallLines = getServiceCallNames(scraped)
    .map(
      (sc) =>
        `${_(1)}serviceCall_${camelize(sc)}: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`
    )
  const actionsLines = getActionNames(scraped)
    .map(
      (sc) =>
        `  action_${camelize(sc)}: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`
    )
  const testLines = getTestNames(scraped)
    .map(
      (sc) =>
        `  test_${camelize(sc)}: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>`
    )

  const handlesObjectTypeCode = `export type ${name.charAt(0).toUpperCase() + name.substring(1)}<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
${serviceCallLines.join('\n')}
${actionsLines.join('\n')}
${testLines.join('\n')}
}
`

  const handlesTypeCode = `${typeDefCode}

${getServiceCallsCode(scraped)}

${handlesObjectTypeCode}`
  return handlesTypeCode
}
