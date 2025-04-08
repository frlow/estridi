import {
  Scraped,
  ScrapedConnector,
  ScrapedGateway,
  ScrapedNode,
  ScrapedScript,
  ScrapedStart,
  ScrapedTable,
} from '../../scraped'

const getTableKey = (
  node: ScrapedNode,
  scraped: Scraped,
): string | undefined => {
  if (node.raw.includes(':')) {
    return scraped.find(
      (n) => n.type === 'table' && n.raw === node.raw.split(':')[1].trim(),
    )?.id
  }
  return undefined
}

export const injectLinkedTable = (
  node: ScrapedNode,
  scraped: Scraped,
): Scraped | undefined => {
  if (node.type !== 'subprocess') return undefined
  if (node.link) return undefined
  const tableKey = getTableKey(node, scraped)
  if (!tableKey) return undefined
  const table = scraped.find((n) => n.id === tableKey) as ScrapedTable
  if (!table) return undefined
  const base = structuredClone(node)
  const gatewayId = `${base.id}-gateway`
  const startId = `${base.id}-start`
  base.link = startId
  const start: ScrapedStart = {
    type: 'start',
    raw: node.raw,
    id: startId,
    next: gatewayId,
  }
  const gateway: ScrapedGateway = {
    type: 'gateway',
    raw: node.raw,
    id: gatewayId,
    options: {},
  }
  const tests = table.rows.slice(1).map((row) => {
    const testId = `${base.id}-${row[0]}`
    const test: ScrapedScript = {
      id: testId,
      raw: `${node.raw} ${row[0]}`,
      type: 'script',
    }
    gateway.options[testId] = row.join("|")
    return test
  })
  return [base, start, gateway, ...tests]
}
