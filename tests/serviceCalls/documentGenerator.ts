import { FigmaDocument } from '../../src/processors/figma/index.js'
import {
  figmaConnectorNode,
  figmaTable,
  figmaTeNodes,
  getBaseFigmaNode,
} from './data/figmaBase.js'
import { figmaExampleTE } from './data/figmaExamples.js'
import {
  drawIoConnector,
  drawIoTable,
  drawIoTeNodes,
  getBaseDrawIoNode,
} from './data/drawIoBase.js'

export type NodeGenerator = {
  script: (args: {
    text?: string
    id?: string
    type: 'script' | 'message' | 'signalSend'
  }) => any
  serviceCall: (args: { text?: string; id?: string }) => any
  start: (args: { id?: string }) => any
  gateway: (args: { id?: string; text?: string }) => any
  subprocess: (args: { id?: string; text?: string }) => any
  userAction: (args: { id?: string; text?: string; position: number }) => any
  signalListen: (args: { id?: string; text?: string; position: number }) => any
  other: (args: { text?: string; id?: string }) => any
}

export type TableGenerator = (args: {
  id?: string
  children: string[][]
}) => any

export type GetDocumentArgs = {
  type?: string
  variant?: 'TE'
  isTable?: boolean
}

export type ConnectorGenerator = (args: {
  id?: string
  start: string
  end?: string
  text?: string
  dotted?: boolean
}) => any[]

export const getFigmaDocument = (args: GetDocumentArgs): FigmaDocument => {
  const nodeGenerator = args.variant === 'TE' ? figmaTeNodes : undefined
  return getDocument({
    ...args,
    baseNodeFunc: getBaseFigmaNode,
    nodeGenerator,
    tableGenerator: figmaTable,
    connectorGenerator: figmaConnectorNode,
  })
}

export const getDrawIoDocument = (args: GetDocumentArgs): any => {
  const nodeGenerator = args.variant === 'TE' ? drawIoTeNodes : undefined
  return getDocument({
    ...args,
    baseNodeFunc: getBaseDrawIoNode,
    nodeGenerator,
    tableGenerator: drawIoTable,
    connectorGenerator: drawIoConnector,
  })
}

const getDocument = ({
  variant,
  isTable,
  type,
  baseNodeFunc,
  nodeGenerator,
  tableGenerator,
  connectorGenerator,
}: {
  type?: string
  variant?: 'TE'
  isTable?: boolean
  baseNodeFunc: (nodes: any[]) => any
  nodeGenerator: NodeGenerator
  tableGenerator: TableGenerator
  connectorGenerator: ConnectorGenerator
}): any => {
  if (type) {
    const textExample = 'Some text'
    if (variant === 'TE')
      switch (type) {
        case 'message':
        case 'signalSend':
        case 'script':
          return baseNodeFunc([
            nodeGenerator.script({ text: textExample, type }),
            ...connectorGenerator({ start: 'ScriptId' }),
          ])
        case 'serviceCall':
          return baseNodeFunc([
            nodeGenerator.serviceCall({ text: textExample }),
            ...connectorGenerator({ start: 'ServiceCallId' }),
          ])
        case 'root':
          return baseNodeFunc([
            nodeGenerator.start({}),
            ...connectorGenerator({ start: 'StartId', text: 'root:test' }),
          ])
        case 'start':
          return baseNodeFunc([
            nodeGenerator.start({}),
            ...connectorGenerator({ start: 'StartId', text: textExample }),
          ])
        case 'gateway':
          return baseNodeFunc([
            nodeGenerator.gateway({ text: textExample }),
            ...connectorGenerator({
              start: 'GatewayId',
              text: 'yes',
              end: 'YesId',
              id: 'ConnectorId1',
            }),
            ...connectorGenerator({
              start: 'GatewayId',
              text: 'no',
              end: 'NoId',
              id: 'ConnectorId2',
            }),
          ])
        case 'subprocess':
          return baseNodeFunc([
            nodeGenerator.subprocess({ text: 'Next' }),
            nodeGenerator.start({ id: 'LinkId' }),
            ...connectorGenerator({
              start: 'SubprocessId',
              id: 'ConnectorId1',
              end: 'NextId',
            }),
            ...connectorGenerator({
              start: 'LinkId',
              text: 'Next',
              id: 'ConnectorId2',
            }),
          ])
        case 'userAction':
          return baseNodeFunc([
            nodeGenerator.userAction({ text: textExample, position: 0 }),
            nodeGenerator.signalListen({ text: 'Click', position: 0 }),
            ...connectorGenerator({
              start: 'UserActionId',
              id: 'ConnectorId1',
            }),
            ...connectorGenerator({
              start: 'SignalListenId',
              id: 'ConnectorId2',
              end: 'ActionId',
            }),
          ])
        case 'other':
          return baseNodeFunc([
            nodeGenerator.other({ id: 'AnyId', text: textExample }),
            ...connectorGenerator({
              start: 'AnyId',
              end: 'NextId',
            }),
          ])
        case 'end':
          return baseNodeFunc([
            nodeGenerator.start({ id: 'EndId' }),
            ...connectorGenerator({
              start: 'AnyId',
              end: 'EndId',
              text: textExample,
            }),
          ])
        default:
          debugger
      }
    else debugger
  } else if (isTable) {
    return baseNodeFunc([
      tableGenerator({
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
