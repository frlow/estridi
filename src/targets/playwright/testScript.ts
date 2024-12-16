import { findShortestPathToNode } from '../../common/shotestPath.js'
import { getActionsForPath, getPathGatewayValuesForPath } from '../codegen/misc.js'
import { _, camelize } from '../../common/texts.js'
import { rawCommentBlock } from './common.js'

export const generateScriptTest = (scraped: Scraped, node: ScrapedScript | ScrapedServiceCall, blockPath: any[], usedNames: Record<string, number>) => {
  const getTestName = (name: string): string => {
    usedNames[name] = usedNames[name] !== undefined ? usedNames[name] + 1 : 0
    if (usedNames[name]) return `${name} ${usedNames[name]}`
    return name
  }
  const _node = { customTest: undefined, ...node }
  const shortestPath = findShortestPathToNode(scraped, node.id, blockPath)
  const gatewayValues = getPathGatewayValuesForPath(shortestPath)
  const actions = getActionsForPath(shortestPath)
  const testText = `    await handles.test_${camelize(node.text.replace('*', ''))}(args${_node.customTest ? ', { actions }' : ''})`
  const actionsText = _node.customTest
    ? `    const actions = [
${actions.map((a) => `      '${a}'`).join(',\n')}
    ]`
    : actions.map((a) => `    await handles.${a}(args)`).join('\n')
  return `  test('${getTestName(node.text)}', async ({ page, context }) => {
${rawCommentBlock(node.raw)}
    const gateways: GatewayCollection = ${JSON.stringify(gatewayValues, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(2)}`)}
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    ${_node.customTest ? '// manually implement start in test' : `await handles.start(args)`}
${actionsText}
${testText}
  })`
}
