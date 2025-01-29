export type NodeGenerator<T=any> = {
  script: (args: {
    text?: string
    id?: string
    type: 'script' | 'message' | 'signalSend'
  }) => T[]
  scriptGroupedText: (args: { text?: string; id?: string }) => T[]
  serviceCall: (args: { text?: string; id?: string }) => T[]
  start: (args: { id?: string }) => T[]
  gateway: (args: { id?: string; text?: string, type?: 'gateway' | 'loop' | 'parallel' }) => T[]
  subprocess: (args: { id?: string; text?: string }) => T[]
  userAction: (args: { id?: string; text?: string }) => T[]
  signalListen: (args: { id?: string; text?: string; parentId: string }) => T[]
  other: (args: { text?: string; id?: string }) => T[]
  note: (args: { text?: string; id?: string }) => T[]
}

export type TableGenerator = (args: {
  id?: string
  children: string[][]
}) => any[]

export type ConnectorGenerator = (args: {
  // id?: string
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
  | 'note'
  | 'loop'
  | 'subprocess-loop'

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
          ...nodeGenerator.script({ text: options?.text || textExample, type }),
        ...connectorGenerator({ start: 'ScriptId' })
      ])
    case 'serviceCall':
      return baseNodeFunc([
          ...nodeGenerator.serviceCall({ text: '/api/get-data' }),
        ...connectorGenerator({ start: 'ServiceCallId' })
      ])
    case 'root':
      return baseNodeFunc([
          ...nodeGenerator.start({}),
        ...connectorGenerator({ start: 'StartId', text: 'root:test' })
      ])
    case 'start':
      return baseNodeFunc([
          ...nodeGenerator.start({}),
        ...connectorGenerator({ start: 'StartId', text: textExample })
      ])
    case 'gateway':
      return baseNodeFunc([
          ...nodeGenerator.gateway({ text: textExample }),
        ...connectorGenerator({
          start: 'GatewayId',
          text: 'yes',
          end: 'YesId'
          // id: 'ConnectorId1'
        }),
        ...connectorGenerator({
          start: 'GatewayId',
          text: 'no',
          end: 'NoId'
          // id: 'ConnectorId2'
        })
      ])
    case 'subprocess':
      return baseNodeFunc([
          ...nodeGenerator.subprocess({ text: 'Next' }),
          ...nodeGenerator.start({ id: 'LinkId' }),
        ...connectorGenerator({
          start: 'SubprocessId',
          // id: 'ConnectorId1',
          end: 'NextId'
        }),
        ...connectorGenerator({
          start: 'LinkId',
          text: 'Next'
          // id: 'ConnectorId2'
        })
      ])
    case 'userAction':
      return baseNodeFunc([
          ...nodeGenerator.userAction({ text: textExample }),
          ...nodeGenerator.signalListen({ text: 'Click', parentId: "UserActionId" }),
        ...connectorGenerator({
          start: 'UserActionId'
          // id: 'ConnectorId1'
        }),
        ...connectorGenerator({
          start: 'SignalListenId',
          // id: 'ConnectorId2',
          end: 'ActionId'
        })
      ])
    case 'other':
      return baseNodeFunc([
          ...nodeGenerator.other({ id: 'OtherId', text: textExample }),
        ...connectorGenerator({
          start: 'OtherId',
          end: 'NextId'
        })
      ])
    case 'end':
      return baseNodeFunc([
          ...nodeGenerator.start({ id: 'EndId' }),
        ...connectorGenerator({
          start: 'AnyId',
          end: 'EndId',
          text: textExample
        })
      ])
    case 'dotted':
      return baseNodeFunc([
          ...nodeGenerator.serviceCall({}),
          ...nodeGenerator.script({ type: 'script' }),
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
            ['My Table', 'Column1', 'Column2'],
            ['Line1', 'AAAA', 'BBBB'],
            ['Line2', 'CCCC', 'DDDD']
          ]
        })
      ])
    case 'subprocess-actions':
      return baseNodeFunc([
        ...nodeGenerator.subprocess({ text: 'External component'}),
        ...nodeGenerator.signalListen({ text: 'Click', parentId: "SubprocessId" }),
        ...connectorGenerator({
          start: 'SubprocessId'
          // id: 'ConnectorId1'
        }),
        ...connectorGenerator({
          start: 'SignalListenId',
          // id: 'ConnectorId2',
          end: 'ActionId'
        })
      ])
    case 'scriptWithGroupedText':
      return baseNodeFunc([
        ...nodeGenerator.scriptGroupedText({ text: 'Grouped Text', id: 'ScriptWithGroupedTextId' }),
        ...connectorGenerator({ start: 'ScriptWithGroupedTextId' })
      ])
    case 'note':
      return baseNodeFunc([
        ...nodeGenerator.start({}),
        ...connectorGenerator({ start: 'NoteId', end: 'StartId', dotted: true }),
        ...connectorGenerator({ start: 'StartId', end: 'NextId', text: textExample }),
        ...nodeGenerator.note({ text: 'Some comment here' })
      ])
    case 'loop':
      return baseNodeFunc([
        ...nodeGenerator.start({}),
        ...connectorGenerator({ start: 'StartId', end: 'LoopId', text: 'root:loop' }),
        ...nodeGenerator.gateway({ id: 'LoopId', text: 'loop', type: 'loop' }),
        ...connectorGenerator({ start: 'LoopId', end: 'ScriptId' }),
        ...nodeGenerator.script({ id: 'ScriptId', text: 'Script', type: 'script' }),
        ...connectorGenerator({ start: 'ScriptId', end: 'LoopReturnId' }),
        ...nodeGenerator.gateway({ id: 'LoopReturnId', text: 'loop return' }),
        ...connectorGenerator({ start: 'LoopReturnId', end: 'LoopId' })
      ])
    case 'subprocess-loop':
      return baseNodeFunc([
        ...nodeGenerator.start({ id: 'StartId' }),
        ...connectorGenerator({ start: 'StartId', end: 'SubprocessId', text: 'root:test' }),
        ...nodeGenerator.subprocess({ id: 'SubprocessId', text: 'Sub Start'}),
        ...nodeGenerator.start({ id: 'SubprocessRootId' }),
        ...connectorGenerator({ start: 'SubprocessRootId', end: 'ScriptId', text: 'Sub Start' }),
        ...nodeGenerator.script({ id: 'ScriptId', text: 'Do thing', type: 'script' }),
        ...connectorGenerator({ start: 'ScriptId', end: 'UserActionId' }),
        ...nodeGenerator.userAction({ id: 'UserActionId' }),
        ...nodeGenerator.signalListen({ text: 'Click Next', id: 'SignalListenId', parentId: "UserActionId" }),
        ...connectorGenerator({ start: 'SignalListenId', end: 'SubprocessLoopId' }),
        ...nodeGenerator.subprocess({ id: 'SubprocessLoopId', text: 'Sub Start' })
      ])
    default:
      debugger
  }
}
