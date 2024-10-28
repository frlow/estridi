import { ConnectorGenerator, DocumentType, getDocument, NodeGenerator, TableGenerator } from './documentGenerator.js'
import { type } from 'node:os'
import { text } from 'node:stream/consumers'

export const getBaseDrawIoNode = (children: any[]): any => {
  return {
    mxfile: { diagram: { mxGraphModel: { root: { mxCell: children } } } },
  }
}

export const drawIoNodes: NodeGenerator = {
  script({ id, text, type }) {
    return {
      '@_id': id || 'ScriptId',
      '@_type': type,
      '@_value': text || 'Script',
    }
  },
  serviceCall({ id, text }) {
    return {
      '@_id': id || 'ServiceCallId',
      '@_type': 'serviceCall',
      '@_value': text || 'Service Call',
    }
  },
  start({ id }) {
    return {
      '@_id': id || 'StartId',
      '@_type': 'start',
    }
  },
  gateway({ id, text }) {
    return {
      '@_id': id || 'GatewayId',
      '@_type': 'gateway',
      '@_value': text || 'Gateway',
    }
  },
  subprocess({ text, id }) {
    return {
      '@_id': id || 'SubprocessId',
      '@_type': 'subprocess',
      '@_value': text || 'Subprocess',
    }
  },
  userAction({ text, id, position }) {
    return {
      '@_id': id || 'UserActionId',
      '@_type': 'userAction',
      '@_value': text || 'User Action',
      mxGeometry: {
        '@_x': position.toString(),
        '@_y': '0',
        '@_width': '100',
        '@_height': '100',
      },
    }
  },
  signalListen({ position, id, text }) {
    return {
      '@_id': id || 'SignalListenId',
      '@_type': 'signalListen',
      '@_value': text || 'Signal Listen',
      mxGeometry: {
        '@_x': (position + 5).toString(),
        '@_y': '50',
        '@_width': '10',
        '@_height': '10',
      },
    }
  },
  other({ id, text }) {
    return {
      '@_id': id || 'OtherId',
      '@_value': text || 'Other',
    }
  },
  scriptGroupedText(args: { text?: string; id?: string }): any {
    throw "not implemented"
  },
}

export const drawIoTable: TableGenerator = ({ id, children }) => {
  const tableId = id || 'TableId'
  const table = {
    '@_id': tableId,
    '@_style': 'shape=table;',
  }
  const rows = children.map((_, i) => ({
    '@_id': `${tableId}_row${i}`,
    '@_style': 'shape=tableRow;',
    '@_parent': tableId,
  }))
  const values = children.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => ({
      '@_id': `${tableId}_row${rowIndex}_col${colIndex}`,
      '@_parent': `${tableId}_row${rowIndex}`,
      '@_value': value,
    })),
  )
  return [table, ...rows, ...values]
}

export const drawIoConnector: ConnectorGenerator = ({
                                                      text,
                                                      id,
                                                      dotted,
                                                      end,
                                                      start,
                                                    }) => {
  const _id = id || 'ConnectorId'
  const connector = {
    '@_id': _id,
    '@_source': start,
    '@_target': end || 'NextId',
    '@_style': dotted ? 'dashed' : undefined,
  }
  if (!text) return [connector]
  const textNode = {
    '@_id': `${_id}Text`,
    '@_value': text,
    '@_parent': _id,
  }
  return [connector, textNode]
}


export const getDrawIoDocument = (type: DocumentType): any =>
  getDocument({
    type,
    baseNodeFunc: getBaseDrawIoNode,
    nodeGenerator: drawIoNodes,
    tableGenerator: drawIoTable,
    connectorGenerator: drawIoConnector
  })
