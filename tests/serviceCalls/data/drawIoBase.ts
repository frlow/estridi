import {
  ConnectorGenerator,
  NodeGenerator,
  TableGenerator,
} from '../documentGenerator.js'
import { loadDrawIoDocument } from '../../../src/processors/drawio/index.js'
import { drawIoTeStyles } from '../../../src/processors/drawio/te.js'

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
    let style: string
    switch (type) {
      case 'script':
        style = drawIoTeStyles.script
        break
      case 'message':
        style = drawIoTeStyles.message
        break
      case 'signalSend':
        style = drawIoTeStyles.signalSend
        break
      default:
        debugger
        throw `${type} not implemented`
    }
    return {
      '@_id': id || 'ScriptId',
      '@_style': style,
      '@_value': text || 'Script',
    }
  },
  serviceCall({ id, text }) {
    // const example = getExample()
    return {
      '@_id': id || 'ServiceCallId',
      '@_style': drawIoTeStyles.serviceCall,
      '@_value': text || 'Service Call',
    }
  },
  start({ id }) {
    return {
      '@_id': id || 'StartId',
      '@_style': drawIoTeStyles.start,
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
    '@_style':
      'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;',
    '@_source': start,
    '@_target': end || 'NextId',
  }
  if (!text) return [connector]
  const textNode = {
    '@_id': `${_id}Text`,
    '@_style':
      'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.018;entryY=0.559;entryDx=0;entryDy=0;entryPerimeter=0;',
    '@_value': text,
    '@_parent': _id,
  }
  return [connector, textNode]
}
