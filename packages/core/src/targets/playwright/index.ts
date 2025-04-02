import { NodeBranch, NodeLeaf, NodeTree } from '../../process/testableNodeTree'
import {
  camelize,
  capitalCamel,
  sanitizeAllProps,
  sanitizeText,
} from '../../texts'
import { TargetGenerator } from '../TargetGenerator'

const generateTest = (leaf: NodeLeaf) => {
  const actions = [
    'start',
    ...leaf.actions.map((action) => `action_${sanitizeText(camelize(action))}`),
  ]
  const lastAction = actions.splice(actions.length - 1, 1)[0]
  return `test('${sanitizeText(leaf.name)}${leaf.index > 0 ? ` ${leaf.index}` : ''}', async ({page, context})=>{
    const gateways: GatewayCollection = ${JSON.stringify(sanitizeAllProps(leaf.gateways), null, 2)}
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    ${actions.map((action) => `await handles.${action}(args)`).join('\n')}
    let testFunc = handles.test_${camelize(sanitizeText(leaf.name))}
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any
    await handles.${lastAction}(args)
    expect(await testFunc(args)).toBeUndefined()
  })`
}

const generateTestBlock = (branch: NodeBranch) => {
  const blocks = branch.children.map((c) => {
    if ('children' in c) return generateTestBlock(c)
    else if ('gateways' in c) return generateTest(c)
    debugger
    throw 'Not implemented'
  })
  return `test.describe('${sanitizeText(branch.name)}', ()=>{
  ${blocks.join('\n')}
  })`
}

const getSubprocessTypes = (nodeTree: NodeTree) => {
  return Object.entries(nodeTree.subprocesses).map(([key, value]) => {
    const typeLines = [
      ...value.serviceCalls.map(
        (sc) =>
          `serviceCall_${camelize(sanitizeText(sc))}: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`,
      ),
      ...value.actions.map(
        (a) =>
          `action_${camelize(sanitizeText(a))}: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`,
      ),
      ...value.tests.map(
        (t) =>
          `test_${camelize(sanitizeText(t))}: TestFunction<TState, TPageExtensions>`,
      ),
    ]
    return `export type ${capitalCamel(`${sanitizeText(nodeTree.name)}-${sanitizeText(key)}`)}<TState=HandlesGenerics[0], TPageExtensions=HandlesGenerics[1]> = {
${typeLines.join('\n')}
}`
  })
}

const getHandlesObjectTypeCode = (nodeTree: NodeTree) => {
  const setupCode = [
    `setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>`,
    `start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`,
  ]

  const typeBlocks = Object.keys(nodeTree.subprocesses)

  return `export type ${capitalCamel(nodeTree.name)}<TState={}, TPageExtensions={}> = {
${setupCode.join('\n')}
} & ${typeBlocks.map((tb) => `${capitalCamel(sanitizeText(nodeTree.name) + '-' + sanitizeText(tb))}<TState, TPageExtensions>`).join(' & ')}

export type HandlesGenerics<U = typeof handles> = U extends ${capitalCamel(nodeTree.name)}<infer A,infer B> ? [A, B] : never

${getSubprocessTypes(nodeTree).join('\n\n')}`
}

const generateHandlesTypeCode = (nodeTree: NodeTree) => {
  const gatewayNameLines = nodeTree.allGateways!.map(
    (text) => `'${sanitizeText(text)}'`,
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
}

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined
) => Promise<void | (() => Promise<void>)>
`

  const handlesObjectTypeCode = getHandlesObjectTypeCode(nodeTree)

  const serviceCallCode = `const handleServiceCalls = async (args: TestArgs<any, any>)=>{
${nodeTree.allServiceCalls.map((sc) => `await handles.serviceCall_${camelize(sanitizeText(sc))}(args)`)}
}`

  const handlesTypeCode = `${typeDefCode}

${serviceCallCode}

${handlesObjectTypeCode}`
  return handlesTypeCode
}

export const generatePlaywright: TargetGenerator = async (nodeTree) => {
  return `import { test, expect } from '@playwright/test'
import type { BrowserContext, Page } from '@playwright/test'
import { handles } from './${nodeTree.name}.js'

${generateTestBlock(nodeTree)}

${generateHandlesTypeCode(nodeTree)}`
}
