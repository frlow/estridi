import { findShortestPathToNode } from '../../common/shotestPath.js'
import { getActionsForPath, getPathGatewayValuesForPath } from '../codegen/misc.js'
import { _, camelize } from '../../common/texts.js'

export const getTestName = (name: string, usedNames: Record<string, number>): string => {
  usedNames[name] = usedNames[name] !== undefined ? usedNames[name] + 1 : 0
  if (usedNames[name]) return `${name} ${usedNames[name]}`
  return name
}

export const generateScriptTest = (scraped: Scraped, node: ScrapedScript | ScrapedServiceCall, blockPath: any[], usedNames: Record<string, number>) => {

  const shortestPath = findShortestPathToNode(scraped, node.id, blockPath)
  const gatewayValues = getPathGatewayValuesForPath(shortestPath)
  const actions = getActionsForPath(shortestPath)
  const gatewayText = `    const gateways: GatewayCollection = ${JSON.stringify(gatewayValues, null, 2).replace(/"/g, '\'').replace(/\n/g, `\n${_(2)}`)}`
  const actionLines = [
    '    await handles.start(args)',
    ...actions.map((a) => `    await handles.${a}(args)`)]
  return `  test('${getTestName(node.text, usedNames)}', async ({ page, context }) => {
${gatewayText}
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
${actionLines.slice(0,-1).join('\n')}
    let testFunc = handles.test_${camelize(node.text)}
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
${actionLines.slice(-1)}
    expect(await testFunc(args)).toBeUndefined()
  })`
}
