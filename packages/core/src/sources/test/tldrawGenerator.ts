import { ConnectorGenerator, getDocument, GetDocumentFunc, NodeGenerator } from './documentGenerator'

function getBaseTldrawNode(children: []) {
  return {
    documents: children
  }
}

export const tldrawNodes: NodeGenerator = {
  script({ id, text, type }) {
    return {
      'state': {
        'id': id || 'ScriptId',
        'type': type,
        'props': {
          'text': text
        }
      }
    }
  }
}

function tldrawTable() {
  return []
}

const tldrawConnectorNode: ConnectorGenerator = ({ text, end, start, dotted }) => {
  const id = Math.random().toString()
  return [
    {
      'state': {
        'id': id,
        'type': 'arrow',
        'typeName': 'shape',
        props: {
          'text': text
        }
      }
    },
    {
      'state': {
        'id': `binding:start_${id}`,
        'type': 'arrow',
        'fromId': id,
        'toId': start,
        'props': {
          'terminal': 'start'
        },
        'typeName': 'binding'
      }
    },
    {
      'state': {
        'id': `binding:end_${id}`,
        'type': 'arrow',
        'fromId': id,
        'toId': end || "NextId",
        'props': {
          'terminal': 'end'
        },
        'typeName': 'binding'
      }
    }
  ]
}

export const getTldrawDocument: GetDocumentFunc = (type, options) =>
  getDocument({
    type,
    baseNodeFunc: getBaseTldrawNode,
    nodeGenerator: tldrawNodes,
    tableGenerator: tldrawTable,
    connectorGenerator: tldrawConnectorNode,
    options
  })
