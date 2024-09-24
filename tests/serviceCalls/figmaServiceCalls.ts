import { FigmaDocument } from '../../src/processors/figma/index.js'
import {
  connectorNode,
  getBaseFigmaNode,
  table,
  teNodes,
} from './data/figmaBase.js'
import { figmaExampleTE } from './data/figmaExamples.js'

export const getFigmaDocument = (variant: any): FigmaDocument => {
  if (variant.data?.source?.Variant === 'TE' && variant.data?.node) {
    const type = variant.data?.node.Id
    const textExample = 'Some text'
    switch (type) {
      case 'message':
      case 'signalSend':
      case 'script':
        return getBaseFigmaNode([
          teNodes.script({ text: textExample, type }),
          connectorNode({ start: 'ScriptId' }),
        ])
      case 'serviceCall':
        return getBaseFigmaNode([
          teNodes.serviceCall({ text: textExample }),
          connectorNode({ start: 'ServiceCallId' }),
        ])
      case 'root':
        return getBaseFigmaNode([
          teNodes.start({}),
          connectorNode({ start: 'StartId', text: 'root:test' }),
        ])
      case 'start':
        return getBaseFigmaNode([
          teNodes.start({}),
          connectorNode({ start: 'StartId', text: textExample }),
        ])
      case 'gateway':
        return getBaseFigmaNode([
          teNodes.gateway({ text: textExample }),
          connectorNode({
            start: 'GatewayId',
            text: 'yes',
            end: 'YesId',
            id: 'ConnectorId1',
          }),
          connectorNode({
            start: 'GatewayId',
            text: 'no',
            end: 'NoId',
            id: 'ConnectorId2',
          }),
        ])
      case 'subprocess':
        return getBaseFigmaNode([
          teNodes.subprocess({ text: 'Next' }),
          teNodes.start({ id: 'LinkId' }),
          connectorNode({
            start: 'SubprocessId',
            id: 'ConnectorId1',
            end: 'NextId',
          }),
          connectorNode({ start: 'LinkId', text: 'Next', id: 'ConnectorId2' }),
        ])
      case 'userAction':
        return getBaseFigmaNode([
          teNodes.userAction({ text: textExample, position: 0 }),
          teNodes.signalListen({ text: 'Click', position: 0 }),
          connectorNode({ start: 'UserActionId', id: 'ConnectorId1' }),
          connectorNode({
            start: 'SignalListenId',
            id: 'ConnectorId2',
            end: 'ActionId',
          }),
        ])
      case 'other':
        return getBaseFigmaNode([
          teNodes.other({ id: 'AnyId', text: textExample }),
          connectorNode({
            start: 'AnyId',
            end: 'NextId',
          }),
        ])
      case 'end':
        return getBaseFigmaNode([
          teNodes.start({ id: 'EndId' }),
          connectorNode({ start: 'AnyId', end: 'EndId', text: textExample }),
        ])
      default:
        debugger
    }
  }
  if (variant.data?.tables) {
    return getBaseFigmaNode([
      table({
        children: [
          ['.My Table', 'Column1', 'Column2'],
          ['Line1', 'AAAA', 'BBBB'],
          ['Line2', 'CCCC', 'DDDD'],
        ],
      }),
    ])
  }
  return figmaExampleTE as any
}
