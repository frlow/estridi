import {
  Scraped,
  ScrapedConnector,
  ScrapedGateway,
  ScrapedScript,
  ScrapedStart,
  ScrapedSubprocess,
  ScrapedTable,
} from '../../scraped'
import { autoText } from '../../texts'

export const injectLinkedTable = (
  node: ScrapedSubprocess,
  scraped: Scraped,
): Scraped => {
  const table = scraped.find(
    (n) => n.type === 'table' && n.raw === node.tableKey,
  ) as ScrapedTable
  if (!table) return [node]
  const base = structuredClone(node)
  delete base.tableKey
  const outId = `${base.id}-out`
  const gatewayId = `${base.id}-gateway`
  const startId = `${base.id}-start`
  base.link = startId
  const start: ScrapedStart = {
    type: 'start',
    ...autoText(node.raw),
    id: startId,
    next: gatewayId,
  }
  const gateway: ScrapedGateway = {
    type: 'gateway',
    ...autoText(node.raw),
    id: gatewayId,
    variant: 'gateway',
    options: {
      [outId]: 'default',
    },
  }
  const tests = table.rows.slice(1).map((row) => {
    const testId = `${base.id}-${row[0]}`
    const test: ScrapedScript = {
      id: testId,
      ...autoText(`${node.raw} ${row[0]}`),
      variant: 'script',
      type: 'script',
      next: outId,
    }
    gateway.options[testId] = row[0]
    return test
  })
  const out: ScrapedConnector = {
    id: outId,
    ...autoText(''),
    type: 'connector',
  }
  return [base, start, gateway, out, ...tests]
}
