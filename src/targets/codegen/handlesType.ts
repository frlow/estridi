import { _, camelize } from '../../common/texts.js'
import { filterDuplicates, getTestableNodes, validateDuplicates } from './misc.js'

export const getGatewayNames = (scraped: Scraped): string[] => {
  const ret = scraped
    .filter((node) => node.type === 'gateway')
    .map((node) => node.text)
  validateDuplicates(
    ret.filter((r) => !r.startsWith('*')),
    'gateway names'
  )
  return filterDuplicates(ret.map((g) => g.replace('*', '').trim()))
}

export const getServiceCallNames = (scraped: Scraped): { name: string, raw: string }[] => {
  const ret = scraped
    .filter((node) => node.type === 'serviceCall')
    .map((node) => ({ name: node.text, raw: node.raw }))
  validateDuplicates(ret.map(n => n.name), 'serviceCall names')
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
  const serviceCallLines = getServiceCallNames(scraped).map(sc => `${_(1)}// ${sc.raw.replace(/\n/g, ' ')}
${_(1)}await handles.serviceCall_${camelize(sc.name)}(args)`)
  return `const handleServiceCalls = async (args: TestArgs<any, any>)=>{
${serviceCallLines.join('\n')}
}`
}

