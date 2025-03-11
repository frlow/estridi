import { Scraped, ScrapedNode } from '../scraped'


export const convertToTldraw = async (scraped: Scraped) => {
  const pageId = 'page:page1Id'
  const base = (node?: ScrapedNode) => {
    return ({
      typeName: 'shape',
      x: node?.extra?.x || 0,
      y: node?.extra?.y || 0,
      rotation: 0,
      index: 'a1',
      parentId: pageId,
      isLocked: false,
      opacity: 1,
      meta: {}
    })
  }
  const children: any[] = [...[{
    'state': {
      'gridSize': 10,
      'name': '',
      'meta': {},
      'id': 'document:document',
      'typeName': 'document'
    },
    'lastChangedClock': 0
  },
    {
      'state': {
        'meta': {},
        'id': pageId,
        'name': 'Page 1',
        'index': 'a1',
        'typeName': 'page'
      },
      'lastChangedClock': 0
    }]]
  scraped.forEach(node => {
    const createConnector = ({ text, start, end, dotted }: {
      text?: string,
      start: string,
      end?: string,
      dotted?: boolean
    }) => {
      const id = Math.random().toString()
      return [{
        'state': {
          ...base(node),
          'id': `shape:${id}`,
          'type': 'arrow',
          'typeName': 'shape',
          props: {
            'text': text || '',
            'dash': 'draw',
            'size': 's',
            'fill': 'none',
            'color': 'black',
            'labelColor': 'black',
            'bend': 0,
            'start': {
              'x': 0,
              'y': 0
            },
            'end': {
              'x': 0,
              'y': 0
            },
            'arrowheadStart': 'none',
            'arrowheadEnd': 'arrow',
            'labelPosition': 0.5,
            'font': 'draw',
            'scale': 1
          }
        }
      },
        {
          'state': {
            'id': `binding:start_${id}`,
            'type': 'arrow',
            'fromId': `shape:${id}`,
            'toId': `shape:${start}`,
            'meta': {},
            'props': {
              'terminal': 'start',
              'isPrecise': true,
              'isExact': false,
              'normalizedAnchor': {
                'x': 0.5,
                'y': 0.5
              }
            },
            'typeName': 'binding'
          }
        },
        {
          'state': {
            'id': `binding:end_${id}`,
            'type': 'arrow',
            'fromId': `shape:${id}`,
            'toId': `shape:${end}`,
            'meta': {},
            'props': {
              'terminal': 'end',
              'isPrecise': true,
              'isExact': false,
              'normalizedAnchor': {
                'x': 0.5,
                'y': 0.5
              }
            },
            'typeName': 'binding'
          }
        }]
    }

    switch (node.type) {
      case 'script':
        const content = {
          'state': {
            ...base(node),
            'id': `shape:${node.id}`,
            'type': node.variant,
            'props': {
              'text': node.raw
              , w: 270, h: 80,
              color: "light-blue"
            }
          }
        }
        if(node.variant==="message") (content.state.props as any).dash="solid"
        children.push(content)
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'subprocess':
        children.push({
          'state': {
            ...base(node),
            'id': `shape:${node.id}`,
            'type': 'subprocess',
            'props': {
              'text': node.raw
              , w: 400, h: 80,
              color: "light-blue"
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
            ...base(node),
            'id': `shape:${node.id}`,
            'type': 'start',
            props: {
              w: 80, h: 80, text: '',
              color: "light-blue",
              target: "playwright"
            }
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
            ...base(node),
            'id': `shape:${node.id}`,
            'type': 'serviceCall',
            'props': {
              'text': node.raw,
              w: 380,
              h: 80,
              color: "light-green"
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'userAction':
        children.push({
          'state': {
            ...base(node),
            'id': `shape:${node.id}`,
            'type': node.variant,
            'props': {
              'text': node.raw,
              h: node.extra?.height || 80,
              w: node.extra?.width || (Object.keys(node.actions).length * 100 + 100),
              color: "light-blue"
            },
            x: node.extra?.x || 0,
            y: node.extra?.y || 0
          }
        })
        Object.entries(node.actions).forEach(([key, value], i) => {
          children.push({
            'state': {
              ...base(node),
              id: `shape:${node.id}_action_${i}`,
              'type': 'signalListen',
              'props': {
                'text': value,
                h: 80,
                w: 80,
                color: "light-blue"
              },
              x: (node.extra?.x || 0) + 50 + (i * 100),
              y: (node.extra?.y || 0) + 50
            }
          })
          children.push(...createConnector({ start: `${node.id}_action_${i}`, end: key }))
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'other':
        children.push({
          'state': {
            ...base(node),
            'id': `shape:${node.id}`,
            'type': 'other',
            'props': {
              'text': node.raw
              , w: 80, h: 80
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'connector':
        children.push({
          'state': {
            ...base(node),
            'id': `shape:${node.id}`,
            'type': 'connector',
            'props': {
              'text': node.raw
              , w: 80, h: 80
            }
          }
        })
        if (node.next) children.push(...createConnector({ start: node.id, end: node.next }))
        break
      case 'gateway':
        children.push({
          'state': {
            ...base(node),
            'id': `shape:${node.id}`,
            'type': node.variant,
            'props': {
              'text': node.raw
              , w: 80, h: 80,
              color: "light-blue"
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
            ...base(node),
            'id': `shape:${node.id}`,
            'type': 'table',
            'props': {
              'rows': node.rows,
              "columns": [],
              text: node.text,
              h: 80, w: 80
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
    'clock': 1,
    'tombstones': {},
    'schema': {
      'schemaVersion': 2,
      'sequences': {
        'com.tldraw.store': 4,
        'com.tldraw.asset': 1,
        'com.tldraw.camera': 1,
        'com.tldraw.document': 2,
        'com.tldraw.instance': 25,
        'com.tldraw.instance_page_state': 5,
        'com.tldraw.page': 1,
        'com.tldraw.instance_presence': 6,
        'com.tldraw.pointer': 1,
        'com.tldraw.shape': 4,
        'com.tldraw.asset.bookmark': 2,
        'com.tldraw.asset.image': 5,
        'com.tldraw.asset.video': 5,
        'com.tldraw.shape.arrow': 5,
        'com.tldraw.shape.bookmark': 2,
        'com.tldraw.shape.draw': 2,
        'com.tldraw.shape.embed': 4,
        'com.tldraw.shape.frame': 0,
        'com.tldraw.shape.geo': 9,
        'com.tldraw.shape.group': 0,
        'com.tldraw.shape.highlight': 1,
        'com.tldraw.shape.image': 4,
        'com.tldraw.shape.line': 5,
        'com.tldraw.shape.note': 8,
        'com.tldraw.shape.text': 2,
        'com.tldraw.shape.video': 2,
        'com.tldraw.shape.message': 0,
        'com.tldraw.shape.script': 0,
        'com.tldraw.shape.signalSend': 0,
        'com.tldraw.shape.start': 0,
        'com.tldraw.shape.subprocess': 0,
        'com.tldraw.shape.serviceCall': 0,
        'com.tldraw.shape.userAction': 0,
        'com.tldraw.shape.gateway': 0,
        'com.tldraw.shape.signalListen': 0,
        'com.tldraw.shape.other': 0,
        'com.tldraw.binding.arrow': 0
      }
    },
    'documents': children
  }
}
