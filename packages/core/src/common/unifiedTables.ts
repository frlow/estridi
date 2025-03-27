import {
  Scraped,
  ScrapedGateway,
  ScrapedScript,
  ScrapedStart,
  ScrapedTable,
} from '../scraped'
import { autoText } from './texts'

export const injectUnifiedTables = async (scraped: Scraped) => {
  const subprocessesWithTables = scraped.filter(
    (n) => n.type === 'subprocess' && n.tableKey,
  )
  subprocessesWithTables.forEach((sp: any) => {
    const table = scraped.find(
      (n) => n.type === 'table' && n.raw === sp.tableKey,
    ) as ScrapedTable
    if (!table) return
    sp.link = `${sp.id}-start`
    delete sp.tableKey
    const startNode: ScrapedStart = {
      type: 'start',
      ...autoText(sp.raw),
      id: sp.link,
      next: `${sp.id}-gateway`,
    }
    const options = table.rows.slice(1).map((r) => r[0])
    const gatewayNode: ScrapedGateway = {
      id: `${sp.id}-gateway`,
      type: 'gateway',
      variant: 'gateway',
      ...autoText(sp.raw),
      options: options.reduce(
        (acc, cur) => ({ ...acc, [`${sp.id}-message-${cur}`]: cur }),
        {},
      ),
    }
    const testNodes = options.map(
      (o) =>
        ({
          ...autoText(`${sp.raw}: ${o}`),
          variant: 'script',
          id: `${sp.id}-message-${o}`,
          type: 'script',
        }) as ScrapedScript,
    )
    scraped.push(startNode, gatewayNode, ...testNodes)
  })
  return scraped
}
