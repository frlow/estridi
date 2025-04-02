import { Scraped } from '../../scraped'
import { injectLinkedTable } from './table'
import { hasVirtualNodeSlot, injectVirtualNodes } from './virtual'

export const injectSpecialCases = (scraped: Scraped): Scraped => {
  const ret: Scraped = []
  scraped.forEach((n) => {
    if ('tableKey' in n && n.tableKey)
      ret.push(...injectLinkedTable(n, scraped))
    else if (hasVirtualNodeSlot(n, scraped)) ret.push(...injectVirtualNodes(n, scraped))
    else ret.push(n)
  })
  return ret
}
