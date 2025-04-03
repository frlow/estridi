import { camelize } from '../texts'
import { afterProcess, isNodeInside } from './common'
import {
  Scraped,
  ScrapedConnector,
  ScrapedGateway,
  ScrapedLoop,
  ScrapedNode,
  ScrapedNodeTypes,
  ScrapedOther,
  ScrapedParallel,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedStart,
  ScrapedSubprocess,
  ScrapedTable,
  ScrapedUserAction,
} from '../scraped'

export type ProcessedNodes = Record<string, any>

type RichText = { content: any }
const parseRichText = (richText: RichText): string[] => {
  if (!richText) return undefined
  const text = richText.content.flatMap((c) => {
    if (c.content) return parseRichText(c)
    return c.text
  })
  return text
}

type ExtendedNodeTypes = ScrapedNodeTypes | 'loop' | 'parallel'
export const processTldraw = async (data: {
  documents: any[]
}): Promise<Scraped> => {
  const findRawText = (node: any): string => {
    const text =
      node.state?.props?.text ||
      parseRichText(node.state?.props?.richText)?.join(' ') ||
      ''
    if ((text || '').trim() === '') {
      const parent = data.documents.find(
        (n) => n.state.id === node.state.parentId,
      )
      const parentType = parent?.state?.type
      if (parentType === 'group') {
        const groupedText = data.documents.find(
          (n) =>
            n.state.parentId === parent.state.id && n.state.type === 'text',
        )
        return groupedText?.state?.props.text || ''
      }
    }
    return text
  }

  const getNext = (node: any): string | undefined => {
    const connections = node.connections
    if (connections?.length === 1) return connections[0].id
    return undefined
  }

  const getType = (node: any): ExtendedNodeTypes => {
    const types: ExtendedNodeTypes[] = [
      'script',
      'end',
      'gateway',
      'root',
      'script',
      'serviceCall',
      'start',
      'subprocess',
      'table',
      'userAction',
      'message',
      'signalSend',
      'loop',
      'parallel',
      'connector',
    ]
    const nodeType: any = camelize(
      node.state?.type?.replace('-be', '')?.replace('-fe', '') || '',
    )
    if (types.includes(nodeType)) return nodeType
    return 'other'
  }

  const getId = (id: string) => {
    return id?.replace(/^shape:/, '')
  }

  const getNodeMetadata = (node: any): ScrapedNode => {
    const type = getType(node)
    switch (type) {
      case 'message':
      case 'signalSend':
      case 'script':
        const script: ScrapedScript = {
          type: 'script',
          id: getId(node.state.id),
          next: getNext(node),
          raw: findRawText(node),
        }
        return script
      case 'subprocess':
        const subprocess: ScrapedSubprocess = {
          type: 'subprocess',
          id: getId(node.state.id),
          raw: findRawText(node),
          next: getNext(node),
          link: undefined,
        }
        return subprocess
      case 'start':
        if ((node as any).connections.length === 0) {
          const end: ScrapedStart = {
            type: 'end',
            id: getId(node.state.id),
            raw: 'end',
          }
          return end
        }
        const connection = (node as any).connections[0]
        const isRoot = connection?.text?.startsWith('root:')
        const start: ScrapedStart = {
          type: isRoot ? 'root' : 'start',
          id: getId(node.state.id),
          next: getNext(node),
          raw: connection?.text?.replace('root:', '') || 'start',
        }
        return start
      case 'serviceCall':
        const serviceCall: ScrapedServiceCall = {
          type: 'serviceCall',
          id: getId(node.state.id),
          next: getNext(node),
          raw: findRawText(node),
        }
        return serviceCall
      case 'userAction':
        const userAction: ScrapedUserAction = {
          type: 'userAction',
          id: getId(node.state.id),
          next: getNext(node),
          raw: '',
          actions: {},
        }
        return userAction
      case 'loop':
        const loop: ScrapedLoop = {
          type: 'loop',
          id: getId(node.state.id),
          raw: findRawText(node),
          next: getNext(node),
        }
        return loop
      case 'parallel':
        const parallel: ScrapedParallel = {
          type: 'parallel',
          id: getId(node.state.id),
          raw: findRawText(node),
          options: ((node as any).connections || []).reduce(
            (acc, cur) => ({ ...acc, [cur.id]: null }),
            {},
          ),
        }
        return parallel
      case 'gateway':
        const gateway: ScrapedGateway = {
          type: type,
          id: getId(node.state.id),
          raw: findRawText(node),
          options: ((node as any).connections || []).reduce(
            (acc, cur) => ({ ...acc, [cur.id]: cur.text }),
            {},
          ),
        }
        return gateway
      case 'table':
        const table: ScrapedTable = {
          id: getId(node.state.id),
          type: 'table',
          raw: node.state.props.rows[0][0],
          rows: node.state.props.rows,
        }
        return table
      case 'connector':
        const connector: ScrapedConnector = {
          id: getId(node.state.id),
          type: 'connector',
          raw: '',
          next: getNext(node),
        }
        return connector
      default: {
        // console.log(`Node type not found: ${node.state?.type}`)
        return {
          type: 'other',
          id: getId(node.state.id),
          next: getNext(node),
          raw: findRawText(node),
        } as ScrapedOther
      }
    }
  }

  const processData = (data: any, acc: ProcessedNodes) => {
    for (const node of data) {
      const id = getId(node.state.id)
      if (acc[id]) return
      acc[id] = node
    }
  }

  const mapConnections = (nodes: ProcessedNodes): ProcessedNodes => {
    const temp = structuredClone(nodes)
    const connections = Object.values(temp)
      .filter((n) => n.state.type === 'arrow' && n.state.typeName === 'shape')
      .map((n) => {
        const findBinding = (terminal: 'start' | 'end') =>
          getId(
            Object.values(temp).find(
              (c) =>
                c.state.type === 'arrow' &&
                c.state.typeName === 'binding' &&
                c.state.fromId === n.state.id &&
                c.state.props?.terminal === terminal,
            )?.state?.toId,
          )
        const from = findBinding('start')
        const to = findBinding('end')
        return { from, to, text: n.state.props?.text }
      })
    Object.keys(temp).forEach((key) => {
      const node = temp[key]
      node.connections = connections
        .filter((c) => {
          return c.from === getId(node.state.id)
        })
        .map((c) => ({ id: c.to, text: c.text }))
    })
    return temp
  }

  const isSignalListenInside = (host, child) => {
    if (child.state.type !== 'signal-listen-fe') return false
    return isNodeInside(
      {
        x: host.state.x,
        y: host.state.y,
        width: host.state.props.w,
        height: host.state.props.h,
      },
      {
        x: child.state.x,
        y: child.state.y,
        width: child.state.props.w,
        height: child.state.props.h,
      },
    )
  }

  const nodes: ProcessedNodes = {}
  processData(data.documents, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  const scraped = nodeValues.map((n) => getNodeMetadata(n))
  return afterProcess({
    scraped,
    nodes: nodesWithConnections,
    findText: findRawText,
    getNext,
    isSignalListenInside,
  })
}
