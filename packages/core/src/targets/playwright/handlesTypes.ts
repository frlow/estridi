import {
  getActionNames,
  getGatewayNames,
  getServiceCallNames,
  getServiceCallsCode,
  getTestNames
} from '../codegen/handlesType.js'
import { _, camelize } from '../../common/texts.js'
import { Scraped } from '../../scraped'

export const generateHandlesTypeCode = (scraped: Scraped, name: string) => {
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

  const handlesObjectTypeCode = `export type ${name.charAt(0).toUpperCase() + camelize(name.substring(1))}<TState={}, TPageExtensions={}> = {
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
