import {
  ConnectorGenerator,
  NodeGenerator,
  TableGenerator,
} from '../documentGenerator.js'
import { loadDrawIoDocument } from '../../../src/processors/drawio/index.js'
// import { drawIoTeStyles } from '../../../src/processors/drawio/te.js'

export const getBaseDrawIoNode = (children: any[]): any => {
  return {
    mxfile: { diagram: { mxGraphModel: { root: { mxCell: children } } } },
  }
}

const getExample = () =>
  loadDrawIoDocument({
    drawIoFile: 'tests/serviceCalls/data/drawio.drawio',
  }).mxfile.diagram.mxGraphModel.root.mxCell

export const drawIoTeNodes: NodeGenerator = {
  script({ id, text, type }) {
    return {
      '@_id': id || 'ScriptId',
      '@_type': type,
      '@_value': text || 'Script',
    }
  },
  serviceCall({ id, text }) {
    // const example = getExample()
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
  other({ id, text }) {
    return {
      '@_id': id || 'OtherId',
      '@_value': text || 'Other',
    }
  },
}

export const drawIoTable: TableGenerator = ({ id, children }) => {
  debugger
  throw 'Table here!'
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
  }
  if (!text) return [connector]
  const textNode = {
    '@_id': `${_id}Text`,
    '@_value': text,
    '@_parent': _id,
  }
  return [connector, textNode]
}
