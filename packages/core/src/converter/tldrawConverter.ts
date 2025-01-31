import { getXCoordinate } from './common'

const createConnector = ({ text, start, end, dotted }: {
  text?: string,
  start: string,
  end?: string,
  dotted?: boolean
}) => {
  const id = Math.random().toString()
  return [{
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
        'toId': end || 'NextId',
        'props': {
          'terminal': 'end'
        },
        'typeName': 'binding'
      }
    }]
}

export const convertToTldraw = async (scraped: Scraped) => {
  const children: any[] = []
  scraped.forEach(node => {
    switch (node.type) {
      case 'script':
        children.push({
          'state': {
            'id': node.id,
            'type': node.variant,
            'props': {
              'text': node.raw
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'subprocess':
        children.push({
          'state': {
            'id': node.id,
            'type': 'subprocess',
            'props': {
              'text': node.raw
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'root':
      case 'end':
      case 'start':
        children.push({
          'state': {
            'id': node.id,
            'type': 'start'
          }
        })
        if (node.next) children.push(...createConnector({
          start: node.id,
          end: node.next,
          text: node.type === 'root' ? `root:${node.raw}` : node.raw
        }))
        break
      case 'serviceCall':
        children.push({
          'state': {
            'id': node.id,
            'type': 'serviceCall',
            'props': {
              'text': node.raw
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next, text: node.raw }))
        break
      case 'userAction':
        children.push({
          'state': {
            'id': node.id,
            'type': node.variant,
            'props': {
              'text': node.raw,
              h: 20,
              w: 100
            },
            x: getXCoordinate(node.id),
            y: 0
          }
        })
        Object.entries(node.actions).forEach(([key, value], i) => {
          children.push({
            'state': {
              id: `${node.id}_action_${i}`,
              'type': 'signalListen',
              'props': {
                'text': value,
                h: 10,
                w: 10
              },
              x: getXCoordinate(node.id) + 5,
              y: 5
            }
          })
          children.push(...createConnector({ start: `${node.id}_action_${i}`, end: key }))
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next, text: node.raw }))
        break
      case 'other':
        children.push({
          'state': {
            'id': node.id,
            'type': 'other',
            'props': {
              'text': node.raw
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'gateway':
        children.push({
          'state': {
            'id': node.id,
            'type': node.variant,
            'props': {
              'text': node.raw
            }
          }
        })
        Object.entries(node.options || {}).forEach(option => {
          children.push(...createConnector({ start: node.id, end: option[0], text: option[1] }))
        })
        break
      case 'table':
        children.push({
          'state': {
            'id': node.id,
            'type': 'table',
            'props': {
              'rows': node.rows
            }
          }
        })
        break
      default:
        debugger
        break
    }
  })
  return {
    documents: children
  }
}
