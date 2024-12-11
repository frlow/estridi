import { _, camelize } from '../../common/texts.js'
import { filterDuplicates, getTestableNodes } from './misc.js'

export const getGatewayNames = (scraped: Scraped): string[] => {
  const ret = scraped
    .filter((node) => node.type === 'gateway')
    .map((node) => node.text)
  return filterDuplicates(ret.map((g) => g.replace('*', '').trim()))
}

export const getServiceCallNames = (scraped: Scraped): { name: string, raw: string }[] =>
  scraped
    .filter((node) => node.type === 'serviceCall')
    .map((node) => ({ name: node.text, raw: node.raw }))

export const getActionNames = (scraped: Scraped): string[] =>
  scraped
    .filter((node) => node.type === 'userAction')
    .flatMap((a) => Object.values(a.actions))

export const getTestNames = (scraped: Scraped): string[] => {
  const ret = getTestableNodes(scraped)
    .map((node) => node.text)
  return filterDuplicates(ret.map((r) => r.replace('*', '')))
}

export const getServiceCallsCode = (scraped: Scraped) => {
  const serviceCallLines = getServiceCallNames(scraped).map(sc => `${_(1)}// ${sc.raw.replace(/\n/g, ' ')}
${_(1)}await handles.serviceCall_${camelize(sc.name)}(args)`)
  return `const handleServiceCalls = async (args: TestArgs<any, any>)=>{
${serviceCallLines.join('\n')}
}`
}

