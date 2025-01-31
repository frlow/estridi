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
      case 'start':
        children.push({
          'state': {
            'id': node.id,
            'type': 'start'
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next, text: node.raw }))
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
