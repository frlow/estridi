import { autoText, sanitizeText } from '../common/texts'
import { afterProcess, getTableKey } from './common'
import { isNodeInside } from '../common/inside'
import {
  Scraped,
  ScrapedGateway,
  ScrapedNode,
  ScrapedNodeTypes,
  ScrapedOther,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedStart,
  ScrapedSubprocess,
  ScrapedTable,
  ScrapedUserAction
} from '../scraped'

export type ProcessedNodes = Record<string, any>

type ExtendedNodeTypes = ScrapedNodeTypes | 'loop' | 'parallel'
export const processTldraw = async (
  data: { documents: any[] }
): Promise<Scraped> => {
  const findRawText = (node: any): string => {
    const text = node.state?.props?.text
    if ((text || '').trim() === '') {
      const parent = data.documents.find(n => n.state.id === node.state.parentId)
      const parentType = parent?.state?.type
      if (parentType === 'group') {
        const groupedText = data.documents.find(n =>
          n.state.parentId === parent.state.id &&
          n.state.type === 'text')
        return groupedText?.state?.props.text || ''
      }
    }
    return text
  }

  const findText = (node: any) => sanitizeText(findRawText(node))

  const autoFindText = (node: any) => ({
    text: findText(node),
    raw: findRawText(node)
  })

  const getNext = (node: any): string | undefined => {
    const connections = node.connections
    if (connections?.length === 1) return connections[0].id
    return undefined
  }

  const getType = (node: any): ExtendedNodeTypes => {
    const types: ExtendedNodeTypes[] = [
      'script', 'end', 'gateway', 'root', 'script', 'serviceCall',
      'start', 'subprocess', 'table', 'userAction', 'message', 'signalSend',
      'loop', 'parallel']
    if (types.includes(node.state?.type)) return node.state?.type
    return 'other'
  }

  const getNodeMetadata = (node: any): ScrapedNode => {
    const type = getType(node)
    switch (type) {
      case 'message':
      case 'signalSend':
      case 'script':
        const script: ScrapedScript = {
          type: 'script',
          id: node.state.id,
          next: getNext(node),
          ...autoFindText(node),
          variant: type
        }
        return script
      case 'subprocess':
        const subprocess: ScrapedSubprocess = {
          type: 'subprocess',
          id: node.state.id,
          ...autoFindText(node),
          next: getNext(node),
          tableKey: getTableKey(findRawText(node)),
          link: undefined
        }
        return subprocess
      case 'start':
        if ((node as any).connections.length === 0) {
          const end: ScrapedStart = {
            type: 'end',
            id: node.state.id,
            text: 'end',
            raw: 'end'
          }
          return end
        }
        const connection = (node as any).connections[0]
        const isRoot = connection?.text?.startsWith('root:')
        const start: ScrapedStart = {
          type: isRoot ? 'root' : 'start',
          id: node.state.id,
          text: sanitizeText(connection?.text?.replace('root:', '') || 'start'),
          next: getNext(node),
          raw: connection?.text?.replace('root:', '') || 'start'
        }
        return start
      case 'serviceCall':
        const serviceCall: ScrapedServiceCall = {
          type: 'serviceCall',
          id: node.state.id,
          next: getNext(node),
          ...autoFindText(node)
        }
        return serviceCall
      case 'userAction':
        const userAction: ScrapedUserAction = {
          type: 'userAction',
          id: node.state.id,
          next: getNext(node),
          ...autoFindText(node),
          variant: 'userAction',
          actions: {}
        }
        return userAction
      case 'loop':
      case 'parallel':
      case 'gateway':
        const gateway: ScrapedGateway = {
          type: 'gateway',
          id: node.state.id,
          ...autoFindText(node),
          variant: type,
          options: ((node as any).connections || []).reduce(
            (acc, cur) => ({ ...acc, [cur.id]: cur.text }),
            {}
          )
        }
        return gateway
      case 'table':
        const table: ScrapedTable = {
          id: node.state.id,
          type: 'table',
          ...autoText(node.state.props.rows[0][0]),
          rows: node.state.props.rows
        }
        return table
      default: {
        return {
          type: 'other',
          id: node.state.id,
          next: getNext(node),
          text: findText(node),
          raw: findRawText(node)
        } as ScrapedOther
      }
    }
  }

  const processData = (data: any, acc: ProcessedNodes) => {
    for (const node of data) {
      const id = node.state.id
      if (acc[id]) return
      acc[id] = node
    }
  }

  const mapConnections = (nodes: ProcessedNodes): ProcessedNodes => {
    const temp = structuredClone(nodes)
    const connections = Object.values(temp)
      .filter((n) => n.state.type === 'arrow' && n.state.typeName === 'shape')
      .map(n => {
        const findBinding = (terminal: 'start' | 'end') => Object.values(temp).find(c =>
          c.state.type === 'arrow' &&
          c.state.typeName === 'binding' &&
          c.state.fromId === n.state.id &&
          c.state.props?.terminal === terminal)?.state?.toId
        const from = findBinding('start')
        const to = findBinding('end')
        return { from, to, text: n.state.props?.text }
      })
    Object.keys(temp).forEach((key) => {
      const node = temp[key]
      node.connections = connections
        .filter((c) => {
          return c.from === node.state.id
        })
        .map((c) => ({ id: c.to, text: c.text }))
    })
    return temp
  }

  const isSignalListenInside = (host, child) => {
    if (child.state.type !== 'signalListen') return false
    return isNodeInside(
      { x: host.state.x, y: host.state.y, width: host.state.props.w, height: host.state.props.h },
      { x: child.state.x, y: child.state.y, width: child.state.props.w, height: child.state.props.h }
    )
  }

  const nodes: ProcessedNodes = {}
  processData(data.documents, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  const scraped = nodeValues.map((n) => getNodeMetadata(n))
  return afterProcess({ scraped, nodes: nodesWithConnections, findText, getNext, isSignalListenInside })
}
