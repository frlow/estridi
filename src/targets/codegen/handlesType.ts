import { _, camelize } from '../../common/texts.js'
import { filterDuplicates, getTestableNodes, validateDuplicates } from './misc.js'

// export const Gateways = [
//   ${getGatewayNames(scraped)
//     .map((text) => `  '${text}'`)
//       .join(',\n')}
// ] as const
// export type GatewayKey = (typeof Gateways)[number]
// export type GatewayCollection = Partial<Record<GatewayKey, string>>
//
// export type TestArgs<TState> = {
//   gateways: GatewayCollection
//   state: TState
//   page: Page
//   context: BrowserContext
//   tableRow?: Record<string,string>
// }
//
// export type TestOptions = {
//   actions?: string[]
// }
//
// export type ${name.charAt(0).toUpperCase() + name.substring(1)}<TState={}> = {
//   setup: (args: { gateways: GatewayCollection, page: Page, context: BrowserContext }) => Promise<TState>
//   ${getServiceCallNames(scraped)
//     .map(
//       (sc) =>
//         `  serviceCall_${camelize(sc)}: (args: TestArgs<TState>) => Promise<void>`,
//     )
//       .join('\n')}
//   start: (args: TestArgs<TState>) => Promise<void>
//   ${getActionNames(scraped)
//     .map(
//       (sc) =>
//         `  action_${camelize(sc)}: (args: TestArgs<TState>) => Promise<void>`,
//     )
//       .join('\n')}
//   ${getTestNames(scraped)
//     .map(
//       (sc) =>
//         `  test_${camelize(sc)}: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>`,
//     )
//       .join('\n')}
// }

export const getGatewayNames = (scraped: Scraped): string[] => {
  const ret = scraped
    .filter((node) => node.type === 'gateway')
    .map((node) => node.text)
  validateDuplicates(
    ret.filter((r) => !r.startsWith('*')),
    'gateway names'
  )
  return filterDuplicates(ret.map((g) => g.replace('*', '')))
}

export const getServiceCallNames = (scraped: Scraped): string[] => {
  const ret = scraped
    .filter((node) => node.type === 'serviceCall')
    .map((node) => node.text)
  validateDuplicates(ret, 'serviceCall names')
  return ret
}

export const getActionNames = (scraped: Scraped): string[] => {
  const ret = scraped
    .filter((node) => node.type === 'userAction')
    .flatMap((a) => Object.values(a.actions))
  validateDuplicates(ret, 'action names')
  return ret
}

export const getTestNames = (scraped: Scraped): string[] => {
  const ret = getTestableNodes(scraped)
    .map((node) => node.text)
  validateDuplicates(
    ret.filter((r) => !r.startsWith('*')),
    'test names'
  )
  return filterDuplicates(ret.map((r) => r.replace('*', '')))
}

export const getServiceCallsCode = (scraped: Scraped) => {
  const serviceCallLines = getServiceCallNames(scraped).map(sc => `${_(1)}await handles.serviceCall_${camelize(sc)}(args)`)
  return `const handleServiceCalls = async (args: TestArgs<any>)=>{
${serviceCallLines.join('\n')}
}`
}

