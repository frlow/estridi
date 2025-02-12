import * as Figma from 'figma-api'
import { autoText, sanitizeText } from '../common/texts.js'
import { DocumentNode, Node } from '@figma/rest-api-spec'
import { afterProcess, getTableKey } from './common'
import { isNodeInside } from '../common/inside'
import {
  FigmaConfig,
  Scraped,
  ScrapedConnector,
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
export const loadFigmaDocument = async (
  {
    fileId,
    token
  }: FigmaConfig): Promise<DocumentNode> => {
  if (!fileId || !token) throw 'token and fileId must be set'
  const api = new Figma.Api({
    personalAccessToken: token
  })

  const file = await api.getFile({ file_key: fileId })
  return file.document
}

const findRawText = (node: any): string => {
  const children: any[] = node?.children || []
  children.sort((a) => (a.name === 'text' ? -1 : 1))
  const rawText = children.find((c: any) => c.type === 'TEXT')?.characters || ''
  if (!rawText && (node as any)?.parent?.type === 'GROUP') {
    const parent = (node as any).parent
    const children = parent?.children
    const textNode = children?.find(c => c.type === 'TEXT')
    return textNode?.characters || ''
  }
  return rawText
}

const findText = (node: any) => sanitizeText(findRawText(node))

const getType = (node: Node): ScrapedNodeTypes => {
  if ((node.type as any) === 'TABLE') return 'table'
  if (node.name?.replace('02.', '').trim() === 'Message') return 'message'
  if (node.name?.replace('06.', '').trim() === 'Signal send') return 'signalSend'
  if (node.name?.replace('3.', '').trim() === 'Script') return 'script'
  if (node.name?.replace('4.', '').trim() === 'Service call')
    return 'serviceCall'
  if (node.name?.replace('01.', '').trim() === 'Start') return 'start'
  if (node.name?.replace('04.', '').trim() === 'Gateway') return 'gateway'
  if (node.name?.replace('2.', '').trim() === 'Subprocess') return 'subprocess'
  if (node.name?.replace('1.', '').trim() === 'User action') return 'userAction'
  if (node.name?.replace('10.', '').trim() === 'Connector') return 'connector'
  if (node.name?.replace('05.', '').trim() === 'Signal listen')
    return 'signalListen' as any
  return 'other'
}

const getNext = (node: any): string | undefined => {
  const connections = node.connections
  if (connections?.length === 1) return connections[0].id
  return undefined
}

const getNodeMetadata = (node: Node): ScrapedNode => {
  const type = getType(node)
  let ret: ScrapedNode
  switch (type) {
    case 'table': {
      const rows: string[][] = Object.values(
        (node as any).children.reduce(
          (acc: Record<string, string[]>, cur: any) => ({
            ...acc,
            [cur.absoluteBoundingBox.y + 1000000]: [
              ...(acc[cur.absoluteBoundingBox.y + 1000000] || []),
              cur.characters
            ]
          }),
          {}
        )
      )
      const text = rows[0][0]
      const table: ScrapedTable = {
        type: 'table', rows, id: node.id, text,
        raw: text
      }
      ret = table
      break
    }
    case 'message':
    case 'signalSend':
    case 'script': {
      const script: ScrapedScript = {
        type: 'script',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        raw: findRawText(node),
        variant: type
      }
      ret = script
      break
    }
    case 'serviceCall': {
      const serviceCall: ScrapedServiceCall = {
        type: 'serviceCall',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        raw: findRawText(node)
      }
      ret = serviceCall
      break
    }
    case 'start': {
      if ((node as any).connections.length === 0) {
        const end: ScrapedStart = {
          type: 'end',
          id: node.id,
          text: 'end',
          raw: 'end'
        }
        ret = end
        break
      }
      const connection = (node as any).connections[0]
      const isRoot = connection?.text?.startsWith('root:')
      const start: ScrapedStart = {
        type: isRoot ? 'root' : 'start',
        id: node.id,
        text: sanitizeText(connection?.text?.replace('root:', '') || 'start'),
        next: getNext(node),
        raw: connection?.text?.replace('root:', '') || 'start'
      }
      ret = start
      break
    }
    case 'gateway': {
      const numberOfChildren = (node as any).children.length
      const variant = numberOfChildren === 2 ? 'gateway' :
        numberOfChildren === 3 ? 'loop' :
          'parallel'

      const gateway: ScrapedGateway = {
        type: 'gateway',
        id: node.id,
        text: findText(node),
        options: ((node as any).connections || []).reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur.text }),
          {}
        ),
        variant,
        raw: findRawText(node)
      }
      ret = gateway
      break
    }
    case 'subprocess': {
      const subprocess: ScrapedSubprocess = {
        type: 'subprocess',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        link: undefined,
        tableKey: getTableKey(findRawText(node)),
        raw: findRawText(node)
      }
      ret = subprocess
      break
    }
    case 'userAction': {
      const userAction: ScrapedUserAction = {
        type: 'userAction',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        actions: {},
        raw: findRawText(node),
        variant: 'userAction'
      }
      ret = userAction
      break
    }
    case 'connector': {
      const connector: ScrapedConnector = {
        id: node.id,
        type: 'connector',
        ...autoText(''),
        next: getNext(node)
      }
      ret = connector
      break
    }
    default: {
      const other: ScrapedOther = {
        type: 'other',
        id: node.id,
        next: getNext(node),
        text: findText(node),
        raw: findRawText(node)
      }
      ret = other
      break
    }
  }

  if ((node as any).absoluteBoundingBox) {
    ret.extra = { ...(ret.extra || {}), ...(node as any).absoluteBoundingBox }
  }
  return ret
}

const isSignalListenInside = (host, child) => child.name?.replace('05.', '').trim() === 'Signal listen' &&
  child.absoluteBoundingBox &&
  isNodeInside(host.absoluteBoundingBox, child.absoluteBoundingBox)

export const processFigma = async (
  data: any
): Promise<Scraped> => {
  const nodes: ProcessedNodes = {}
  processNode(data, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  const scraped = nodeValues.map((n) => getNodeMetadata(n))
  return afterProcess({ scraped, nodes: nodesWithConnections, findText, getNext, isSignalListenInside })
}

const processNode = (node: any, acc: ProcessedNodes) => {
  if (acc[node.id]) return
  acc[node.id] = node
  const children = node.children || []
  children.forEach((c: any) => processNode(c, acc))
}

const mapConnections = (nodes: ProcessedNodes): ProcessedNodes => {
  const temp = structuredClone(nodes)
  const connections = Object.values(temp).filter((n) => n.type === 'CONNECTOR')
  Object.keys(temp).forEach((key) => {
    const node = temp[key]
    node.children?.forEach(c => {
      if (!c.parent) c.parent = node
    })
    node.connections = connections
      .filter((c) => {
        return c.connectorStart?.endpointNodeId === node.id && !c.strokeDashes
      })
      .map((c) => ({ id: c.connectorEnd?.endpointNodeId, text: c.name }))
    node.dottedConnections = connections
      .filter((c) => {
        return c.connectorStart?.endpointNodeId === node.id && !!c.strokeDashes
      })
      .map((c) => ({ id: c.connectorEnd?.endpointNodeId, text: c.name }))
  })
  return temp
}
