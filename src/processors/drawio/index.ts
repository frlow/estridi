import { DrawIoConfig, LogFunc, Scraped, ScrapedTable } from '../../index.js'
import fs from 'fs'
import { XMLParser } from 'fast-xml-parser'
import { processTeDrawIo } from './te.js'

export const loadDrawIoDocument = (config: DrawIoConfig): any => {
  const content = fs.readFileSync(config.drawIoFile, 'utf8')
  return new XMLParser({ ignoreAttributes: false }).parse(content)
}

const discoverVariant = (data: any): 'TE' => {
  return 'TE'
}

export const processDrawIo = async (
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  const variant = discoverVariant(data)
  switch (variant) {
    case 'TE':
      return await processTeDrawIo(data, log)
    default:
      throw `${variant} not implemented yet`
  }
}

export const drawIoHelper = (rawNodes: any[]) => {
  const getTableMetadata = (node: any, log: LogFunc) => {
    if (node['@_style'] && node['@_style'].includes('shape=table;')) {
      const rowIds = rawNodes
        .filter(
          (n) =>
            n['@_style'] &&
            n['@_style'].includes('shape=tableRow;') &&
            n['@_parent'] === node['@_id'],
        )
        .map((r) => r['@_id'])
      const values = rowIds.map((rId) =>
        rawNodes.filter((n) => n['@_parent'] === rId).map((v) => v['@_value']),
      )
      const text: string = values[0][0]
      const isConnected = text.startsWith('.')
      if (isConnected) {
        const table: ScrapedTable = {
          type: 'table',
          id: node['@_id'],
          text: text.substring(1),
          rows: values,
        }
        log && log('parsedTable', table)
        return table
      }
    }
    return undefined
  }

  const getConnections = (
    node: any,
  ): { target: string; text: string | undefined }[] => {
    const getConnectionText = (id: string) => {
      const connectionText = rawNodes.find((n) => n['@_parent'] === id)
      return connectionText ? connectionText['@_value'] : undefined
    }
    const connectionNodes = rawNodes.filter(
      (n: any) =>
        n['@_source'] === node['@_id'] && !n['@_style']?.includes('dashed'),
    )
    return connectionNodes.map((c: any) => ({
      target: c['@_target'],
      text: getConnectionText(c['@_id']),
    }))
  }
  const getNext = (node: any) => {
    const connection = getConnections(node)[0]
    return connection?.target
  }

  return { getConnections, getNext, getTableMetadata }
}
