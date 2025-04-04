import { Scraped } from '../../scraped'
import { injectVirtualNodes } from './virtual'
import { injectLinkedTable } from './table'
import { injectSubprocessWithActions } from './subprocess'

export const injectSpecialCases = (scraped: Scraped): Scraped => {
  const ret: Scraped = []
  scraped.forEach((n) => {
    const injected =
      injectVirtualNodes(n, scraped) ||
      injectLinkedTable(n, scraped) ||
      injectSubprocessWithActions(n)
    ret.push(...(injected || [n]))
  })
  return ret
}
