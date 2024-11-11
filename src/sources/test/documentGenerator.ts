export type NodeGenerator = {
  script: (args: {
    text?: string
    id?: string
    type: 'script' | 'message' | 'signalSend'
  }) => any
  scriptGroupedText: (args: { text?: string; id?: string }) => any
  serviceCall: (args: { text?: string; id?: string }) => any
  start: (args: { id?: string }) => any
  gateway: (args: { id?: string; text?: string }) => any
  subprocess: (args: { id?: string; text?: string, position?: number }) => any
  userAction: (args: { id?: string; text?: string; position: number }) => any
  signalListen: (args: { id?: string; text?: string; position: number }) => any
  other: (args: { text?: string; id?: string }) => any
}

export type TableGenerator = (args: {
  id?: string
  children: string[][]
}) => any[]

export type ConnectorGenerator = (args: {
  id?: string
  start: string
  end?: string
  text?: string
  dotted?: boolean
}) => any[]

export type DocumentType =
  | 'message'
  | 'signalSend'
  | 'script'
  | 'scriptWithGroupedText'
  | 'serviceCall'
  | 'root'
  | 'start'
  | 'gateway'
  | 'subprocess'
  | 'subprocess-actions'
  | 'userAction'
  | 'other'
  | 'end'
  | 'dotted'
  | 'table'

export type GetDocumentFunc<T = any> = (type: DocumentType, options?: GetDocumentOptions) => T
export type GetDocumentOptions = { text?: string }
export const getDocument = (
  {
    type,
    baseNodeFunc,
    nodeGenerator,
    tableGenerator,
    connectorGenerator,
    options
  }: {
    type: DocumentType
    baseNodeFunc: (nodes: any[]) => any
    nodeGenerator: NodeGenerator
    tableGenerator: TableGenerator
    connectorGenerator: ConnectorGenerator,
    options?: GetDocumentOptions
  }): any => {
  const textExample = 'Some [text]'
  switch (type) {
    case 'message':
    case 'signalSend':
    case 'script':
      return baseNodeFunc([
        nodeGenerator.script({ text: options?.text || textExample, type }),
        ...connectorGenerator({ start: 'ScriptId' })
      ])
    case 'serviceCall':
      return baseNodeFunc([
        nodeGenerator.serviceCall({ text: '/api/get-data' }),
        ...connectorGenerator({ start: 'ServiceCallId' })
      ])
    case 'root':
      return baseNodeFunc([
        nodeGenerator.start({}),
        ...connectorGenerator({ start: 'StartId', text: 'root:test' })
      ])
    case 'start':
      return baseNodeFunc([
        nodeGenerator.start({}),
        ...connectorGenerator({ start: 'StartId', text: textExample })
      ])
    case 'gateway':
      return baseNodeFunc([
        nodeGenerator.gateway({ text: textExample }),
        ...connectorGenerator({
          start: 'GatewayId',
          text: 'yes',
          end: 'YesId',
          id: 'ConnectorId1'
        }),
        ...connectorGenerator({
          start: 'GatewayId',
          text: 'no',
          end: 'NoId',
          id: 'ConnectorId2'
        })
      ])
    case 'subprocess':
      return baseNodeFunc([
        nodeGenerator.subprocess({ text: 'Next' }),
        nodeGenerator.start({ id: 'LinkId' }),
        ...connectorGenerator({
          start: 'SubprocessId',
          id: 'ConnectorId1',
          end: 'NextId'
        }),
        ...connectorGenerator({
          start: 'LinkId',
          text: 'Next',
          id: 'ConnectorId2'
        })
      ])
    case 'userAction':
      return baseNodeFunc([
        nodeGenerator.userAction({ text: textExample, position: 0 }),
        nodeGenerator.signalListen({ text: 'Click', position: 0 }),
        ...connectorGenerator({
          start: 'UserActionId',
          id: 'ConnectorId1'
        }),
        ...connectorGenerator({
          start: 'SignalListenId',
          id: 'ConnectorId2',
          end: 'ActionId'
        })
      ])
    case 'other':
      return baseNodeFunc([
        nodeGenerator.other({ id: 'OtherId', text: textExample }),
        ...connectorGenerator({
          start: 'OtherId',
          end: 'NextId'
        })
      ])
    case 'end':
      return baseNodeFunc([
        nodeGenerator.start({ id: 'EndId' }),
        ...connectorGenerator({
          start: 'AnyId',
          end: 'EndId',
          text: textExample
        })
      ])
    case 'dotted':
      return baseNodeFunc([
        nodeGenerator.serviceCall({}),
        nodeGenerator.script({ type: 'script' }),
        ...connectorGenerator({
          start: 'ServiceCallId',
          end: 'ScriptId',
          dotted: true
        })
      ])
    case 'table':
      return baseNodeFunc([
        ...tableGenerator({
          children: [
            ['.My Table', 'Column1', 'Column2'],
            ['Line1', 'AAAA', 'BBBB'],
            ['Line2', 'CCCC', 'DDDD']
          ]
        })
      ])
    case 'subprocess-actions':
      return baseNodeFunc([
        nodeGenerator.subprocess({ text: 'External component', position: 0 }),
        nodeGenerator.signalListen({ text: 'Click', position: 0 }),
        ...connectorGenerator({
          start: 'SubprocessId',
          id: 'ConnectorId1'
        }),
        ...connectorGenerator({
          start: 'SignalListenId',
          id: 'ConnectorId2',
          end: 'ActionId'
        })
      ])
    case 'scriptWithGroupedText':
      return baseNodeFunc([
        nodeGenerator.scriptGroupedText({ text: 'Grouped Text', id: 'ScriptWithGroupedTextId' }),
        ...connectorGenerator({ start: 'ScriptWithGroupedTextId' })
      ])
    default:
      debugger
  }
}
