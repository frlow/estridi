import { ConnectorGenerator, getDocument, GetDocumentFunc, NodeGenerator } from './documentGenerator.js'
import fs from 'node:fs'

export const getBaseFigmaNode = (children: any[]): any => ({
  id: '0:0',
  name: 'Document',
  type: 'DOCUMENT',
  children: [
    {
      id: '0:1',
      name: 'Page 1',
      type: 'CANVAS',
      children: children,
      visible: true,
      sharedPluginData: {},
      pluginData: {},
      prototypeStartNodeID: null
    }
  ],
  visible: true,
  pluginData: null,
  sharedPluginData: null
})

export const figmaNodes: NodeGenerator = {
  script: ({ text, id, type }) => {
    let typeName: string
    switch (type) {
      case 'script':
        typeName = '3. Script'
        break
      case 'message':
        typeName = '02. Message'
        break
      case 'signalSend':
        typeName = '06. Signal send'
        break
    }
    return {
      id: id || 'ScriptId',
      name: typeName,
      type: 'INSTANCE',
      children: [
        {
          type: 'TEXT',
          characters: 'Wrong text'
        },
        {
          type: 'TEXT',
          name: 'text',
          characters: text || 'Script'
        }
      ]
    }
  },
  serviceCall: ({ text, id }) => ({
    id: id || 'ServiceCallId',
    name: '4. Service call',
    children: [
      {
        type: 'TEXT',
        characters: text || 'Service Call'
      }
    ]
  }),
  start: ({ id }) => ({
    id: id || 'StartId',
    name: '01. Start'
  }),
  gateway: ({ id, text, type }) => {
    const gateway = ({
      id: id || 'GatewayId',
      name: '04. Gateway',
      children: [
        {
          name: 'text',
          type: 'TEXT',
          characters: text || 'Gateway'
        }, {}
      ]
    })
    if(type==="loop") gateway.children.push({})
    if(type==="parallel") gateway.children.push({},{})
    return gateway
  },
  subprocess: ({ id, text, position }) => ({
    id: id || 'SubprocessId',
    name: '2. Subprocess',
    children: [
      {
        name: 'sub process',
        type: 'TEXT',
        characters: text || 'Sub Process'
      }
    ],
    absoluteBoundingBox: {
      x: position || 0,
      y: 0,
      width: 100,
      height: 100
    }
  }),
  userAction: ({ id, text, position }) => ({
    id: id || 'UserActionId',
    name: '1. User action',
    children: [
      {
        name: 'action',
        type: 'TEXT',
        characters: text || 'action'
      }
    ],
    absoluteBoundingBox: {
      x: position,
      y: 0,
      width: 100,
      height: 100
    }
  }),
  signalListen: ({ id, text, position }) => ({
    id: id || 'SignalListenId',
    name: '05. Signal listen',
    children: [
      {
        name: 'Cancel chosen',
        type: 'TEXT',
        characters: text || 'Signal Listen'
      }
    ],
    absoluteBoundingBox: {
      x: position + 5,
      y: 50,
      width: 10,
      height: 10
    }
  }),
  other: ({ text, id }) => ({
    id: id || 'ScriptId',
    children: [
      {
        type: 'TEXT',
        name: 'text',
        characters: text || 'Other'
      }
    ]
  }),
  scriptGroupedText: ({ text, id }) => ({
    'id': `group-${id}`,
    'type': 'GROUP',
    'children': [
      {
        'name': '02. Message',
        'id': id,
        'children': [
          {
            'name': 'text',
            'type': 'TEXT',
            'characters': ''
          }
        ]
      },
      {
        'type': 'TEXT',
        'characters': text || 'Script with grouped text'
      }
    ]
  }),
  note: ({ text, id }) => ({
    id: id || 'NoteId',
    name: '5. Note',
    children: [
      {
        type: 'TEXT',
        characters: text || 'Note'
      }
    ]
  })
}

export const figmaConnectorNode: ConnectorGenerator = ({
                                                         end,
                                                         start,
                                                         text,
                                                         dotted
                                                       }) => [
  {
    id: `Connector_${Math.random().toString()}`,
    type: 'CONNECTOR',
    name: text || 'Connector Line',
    connectorStart: {
      endpointNodeId: start
    },
    connectorEnd: {
      endpointNodeId: end || 'NextId'
    },
    strokeDashes: dotted ? [] : undefined
  }
]

export const figmaTable = ({
                             id,
                             children
                           }: {
  id?: string
  children: string[][]
}) => {
  const mappedChildren = children.flatMap((row, i) =>
    row.map((text) => ({
      characters: text,
      absoluteBoundingBox: { y: i }
    }))
  )
  return [
    {
      id: id || 'TableId',
      name: 'Table',
      type: 'TABLE',
      children: mappedChildren
    }
  ]
}

export const getFigmaDocument: GetDocumentFunc = (type, options) =>
  getDocument({
    type,
    baseNodeFunc: getBaseFigmaNode,
    nodeGenerator: figmaNodes,
    tableGenerator: figmaTable,
    connectorGenerator: figmaConnectorNode,
    options
  })

export const getFigmaTestData = () => JSON.parse(fs.readFileSync('./src/sources/test/figma.json', 'utf8'))
