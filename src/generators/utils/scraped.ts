import { Scraped } from '../../common'
import { getPrettyLabel } from '../index'
import { allowedRegex } from '../../figma/common'

export const allKeysInFeature = (scraped: Scraped, feature: string): {
  key: string,
  values?: string[],
  type?: string
}[] => {
  const startPoints = Object.values(scraped).filter(s => s.type === 'start' && s.text === feature)
  const toProcess = [...startPoints]
  const keys: Record<string, any> = {}
  const visited: string[] = []
  while (toProcess.length > 0) {
    const current = toProcess.pop()
    if (current?.text && getPrettyLabel(current.type)) {
      keys[`${getPrettyLabel(current.type)}: ${current.text}`] = null
    } else if (
      current?.type === 'gateway' &&
      !Object.keys(current.connections || {}).some((connectionId: any) => visited.includes(connectionId)))
      keys[`Given ${current.text}`] = { values: Object.values(current.connections || {}), type: 'gateway' }
    Object.keys(current?.connections || {}).forEach(id => {
      if (visited.includes(id)) return
      toProcess.push(scraped[id])
      visited.push(id)
    })
  }
  const tables = Object.values(scraped).filter(s => s.type === 'table' && s.text === feature)
  tables.forEach(table =>
    table.rows!.slice(1).forEach(row =>
      keys[`Validate ${row[0]}: ${row.slice(1).map(v => v.replace(allowedRegex, '')).join(', ')}`] = { type: 'table' }
    )
  )

  const ret = Object.entries(keys).map(([key, value]) => {
    const values = value?.values
    values?.sort()
    return ({ key, values, type: value?.type })
  })
  ret.sort((a, b) => a.key.localeCompare(b.key))
  return ret
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

export const testsInFeature = (scraped: Scraped, feature: string) => {
  const startPoints = Object.entries(scraped).filter(s => s[1].type === 'start' && s[1].text === feature).map(s => ({
    ...s[1],
    id: s[0]
  }))
  const processed = []
  const toProcess: any = startPoints.map(s => ([s]))
  while (toProcess.length > 0) {
    const log = toProcess.pop()
    const current = log[log.length - 1]
    if (!current.connections || Object.keys(current.connections).length === 0) {
      processed.push(log)
      continue
    }
    if (current.type === 'gateway' && Object.keys(current.connections || {})
      .some((con: any) => log.some((l: any) => l.id === con))) {
      const newLog = clone(log)
      newLog[newLog.length - 1].type = 'gatewayLoopEnd'
      const id = Object.keys(current.connections || {})
        .find((con: any) => !log.some((l: any) => l.id === con)) || ''
      const meta = scraped[id]
      if (!meta) continue
      toProcess.push([...newLog, { ...meta, id }])
      continue
    }
    for (const connection of Object.entries(current.connections || {})) {
      // Check if connection points back in loop
      if (log.some((l: any) => l.id === connection[0])) continue
      const newLog = clone(log)
      if (current.type === 'gateway')
        newLog[newLog.length - 1].value = connection[1]
      toProcess.push([...newLog, { ...scraped[connection[0]], id: connection[0] }])
    }
  }
  return processed.map(current => {
    const testNodes = ['serviceCall', 'message', 'subprocess', 'script', 'signalListen', 'signalSend']
    const gateways = current.filter((p: any) => p.type === 'gateway')
    const nodes = current.filter((p: any) => testNodes.includes(p.type))
    return {
      label: `${current.filter((p: any) => testNodes
        .includes(p.type))
        .map((p: any) => p.text).join(' ')} - ${current
        .filter((p: any) => p.type === 'gateway')
        .map((p: any) => p.value).join(' ')}`,
      gateways,
      nodes
    }
  })
}

export const validationsInFeature = (scraped: Scraped, feature: string) => {
  const tables = Object.entries(scraped).filter(s => s[1].type === 'table' && s[1].text === feature).map(s => ({
    ...s[1],
    id: s[0]
  }))
  const ret: { label: string, step: string }[] = []
  tables.forEach(table => {
    const rows = table.rows!.slice(1)
    rows.sort((a, b) => a[0].localeCompare(b[0]))
    rows.forEach(row => {
      ret.push({
        label: `Validate ${row[0]}`,
        step: `Validate ${row[0]}: ${row.slice(1).map(v => v.replace(allowedRegex, '')).join(', ')}`
      })
    })
  })
  return ret
}

