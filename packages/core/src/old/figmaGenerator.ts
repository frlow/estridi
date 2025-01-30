import { ConnectorGenerator, getDocument, GetDocumentFunc, NodeGenerator } from './documentGenerator.js'
import fs from 'node:fs'

function generateHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Ensure the hash is positive and pad to 12 digits
  return hash * 20
}

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
    return [{
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
    }]
  },
  serviceCall: ({ text, id }) => ([{
    id: id || 'ServiceCallId',
    name: '4. Service call',
    children: [
      {
        type: 'TEXT',
        characters: text || 'Service Call'
      }
    ]
  }]),
  start: ({ id }) => ([{
    id: id || 'StartId',
    name: '01. Start'
  }]),
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
    if (type === 'loop') gateway.children.push({})
    if (type === 'parallel') gateway.children.push({}, {})
    return [gateway]
  },
  subprocess: ({ id, text }) => ([{
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
      x: generateHash(id || 'SubprocessId'),
      y: 0,
      width: 100,
      height: 20
    }
  }]),
  userAction: ({ id, text }) => ([{
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
      x: generateHash(id || 'UserActionId'),
      y: 0,
      width: 100,
      height: 20
    }
  }]),
  signalListen: ({ id, text, parentId }) => ([{
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
      x: generateHash(parentId) + 5,
      y: 5,
      width: 10,
      height: 10
    }
  }]),
  other: ({ text, id }) => ([{
    id: id || 'ScriptId',
    children: [
      {
        type: 'TEXT',
        name: 'text',
        characters: text || 'Other'
      }
    ]
  }]),
  scriptGroupedText: ({ text, id }) => ([{
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
  }]),
  note: ({ text, id }) => ([{
    id: id || 'NoteId',
    name: '5. Note',
    children: [
      {
        type: 'TEXT',
        characters: text || 'Note'
      }
    ]
  }])
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


