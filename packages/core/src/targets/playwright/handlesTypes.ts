import {
  getActionNames,
  getGatewayNames,
  getServiceCallNames,
  getServiceCallsCode,
  getTestNames
} from '../codegen/handlesType.js'
import { _, camelize } from '../../common/texts.js'
import { Scraped } from '../../scraped'
import { processNode } from '../../common/filter'

export type HandlesTypesExtended = 'extended' | 'extended-internal' | 'normal'
export const getHandlesObjectTypeCode = (name: string, scraped: Scraped, extended: HandlesTypesExtended) => {
  const setupCode = [
    `${_(1)}setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>`,
    `${_(1)}start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`]
  if (extended !== 'extended') {
    const serviceCallLines = getServiceCallNames(scraped)
      .map(
        (sc) =>
          `${_(1)}serviceCall_${camelize(sc.name)}: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`
      )
    const actionsLines = getActionNames(scraped)
      .map(
        (sc) =>
          `  action_${camelize(sc)}: (args: TestArgs<TState, TPageExtensions>) => Promise<void>`
      )
    const testLines = getTestNames(scraped)
      .map(
        (sc) =>
          `  test_${camelize(sc)}: TestFunction<TState, TPageExtensions>`
      )

    const lines = [
      ...(extended === 'normal' ? setupCode : []),
      ...serviceCallLines,
      ...actionsLines,
      ...testLines
    ]
    let code = `export type ${name.charAt(0).toUpperCase() + camelize(name.substring(1))}<TState={}, TPageExtensions={}> = {
${lines.join('\n')}
}
`
    return code
  } else {
    const startNodes = scraped.filter(n => ['start', 'root'].includes(n.type))
    const filtered = startNodes.map(n => Object.values(processNode({ node: n, scraped, ignoreLinks: true })))
    const codeBlocks = filtered.map(sc => {
      const blockName = sc[0].type === 'root' ? 'root' : sc[0].text
      const typeName = `${name}-${blockName}`
      return { block: getHandlesObjectTypeCode(typeName, sc, 'extended-internal'), name: typeName }
    })
    return `export type ${name.charAt(0).toUpperCase() + camelize(name.substring(1))}<TState={}, TPageExtensions={}> = {
${setupCode.join('\n')}
} & ${codeBlocks.map(block => {
      return `${block.name.charAt(0).toUpperCase() + camelize(block.name.substring(1))}<TState, TPageExtensions>`
    }).join(' & ')
    }

${codeBlocks.map(block => block.block).join('\n\n')}`
  }
}

export const generateHandlesTypeCode = (scraped: Scraped, name: string, extended: HandlesTypesExtended = 'normal') => {
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

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined
) => Promise<void | (() => Promise<void>)>
`


  const handlesObjectTypeCode = getHandlesObjectTypeCode(name, scraped, extended)

  const handlesTypeCode = `${typeDefCode}

${getServiceCallsCode(scraped)}

${handlesObjectTypeCode}`
  return handlesTypeCode
}
