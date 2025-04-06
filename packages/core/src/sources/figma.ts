import * as Figma from 'figma-api'
import { DocumentNode, Node } from '@figma/rest-api-spec'
import { isNodeInside } from './common'
import {
  FigmaConfig,
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
export const loadFigmaDocument = async ({
  fileId,
  token,
}: FigmaConfig): Promise<DocumentNode> => {
  if (!fileId || !token) throw 'token and fileId must be set'
  const api = new Figma.Api({
    personalAccessToken: token,
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
    const textNode = children?.find((c) => c.type === 'TEXT')
    return textNode?.characters || ''
  }
  return rawText
}

const getType = (node: Node): ScrapedNodeTypes | 'signalListen' => {
  if ((node.type as any) === 'TABLE') return 'table'
  if (node.name?.replace('02.', '').trim() === 'Message') return 'message'
  if (node.name?.replace('06.', '').trim() === 'Signal send')
    return 'signalSend'
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

const getActions = (node: any, data: any) =>
  data
    .filter(
      (n: any) =>
        getType(n) === 'signalListen' &&
        isNodeInside(node.absoluteBoundingBox, n.absoluteBoundingBox),
    )
    .reduce((acc, cur) => {
      acc[getNext(cur)] = findRawText(cur)
      return acc
    }, {}) as Record<string, string>

const getNodeMetadata = (node: Node, data: any): ScrapedNode => {
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
              cur.characters,
            ],
          }),
          {},
        ),
      )
      const text = rows[0][0]
      const table: ScrapedTable = {
        type: 'table',
        rows,
        id: node.id,
        raw: text,
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
        next: getNext(node),
        raw: findRawText(node),
      }
      ret = script
      break
    }
    case 'serviceCall': {
      const serviceCall: ScrapedServiceCall = {
        type: 'serviceCall',
        id: node.id,
        next: getNext(node),
        raw: findRawText(node),
      }
      ret = serviceCall
      break
    }
    case 'start': {
      if ((node as any).connections.length === 0) {
        const end: ScrapedStart = {
          type: 'end',
          id: node.id,
          raw: 'end',
        }
        ret = end
        break
      }
      const connection = (node as any).connections[0]
      const isRoot = connection?.text?.startsWith('root:')
      const start: ScrapedStart = {
        type: isRoot ? 'root' : 'start',
        id: node.id,
        next: getNext(node),
        raw: connection?.text?.replace('root:', '') || 'start',
      }
      ret = start
      break
    }
    case 'gateway': {
      const numberOfChildren = (node as any).children.length
      const variant =
        numberOfChildren === 2
          ? 'gateway'
          : numberOfChildren === 3
            ? 'loop'
            : 'parallel'

      if (variant === 'gateway') {
        const gateway: ScrapedGateway = {
          type: 'gateway',
          id: node.id,
          options: ((node as any).connections || []).reduce(
            (acc, cur) => ({ ...acc, [cur.id]: cur.text }),
            {},
          ),
          raw: findRawText(node),
        }
        ret = gateway
      } else if (variant === 'parallel') {
        const parallel: ScrapedParallel = {
          type: 'parallel',
          id: node.id,
          options: ((node as any).connections || []).reduce(
            (acc, cur) => ({ ...acc, [cur.id]: null }),
            {},
          ),
          raw: findRawText(node),
        }
        ret = parallel
      } else if (variant === 'loop') {
        const loop: ScrapedLoop = {
          type: 'loop',
          id: node.id,
          next: getNext(node),
          raw: findRawText(node),
        }
        ret = loop
      }
      break
    }
    case 'subprocess': {
      const subprocess: ScrapedSubprocess = {
        type: 'subprocess',
        id: node.id,
        next: getNext(node),
        raw: findRawText(node),
      }
      const link = data.find(
        (n) =>
          getType(n) === 'start' &&
          getNodeMetadata(n, data).raw === subprocess.raw,
      )?.id
      if (link) subprocess.link = link
      const actions = getActions(node, data)
      if (Object.keys(actions).length > 0) subprocess.special = { actions }
      ret = subprocess
      break
    }
    case 'userAction': {
      const actions = getActions(node, data)
      const userAction: ScrapedUserAction = {
        type: 'userAction',
        id: node.id,
        next: getNext(node),
        raw: '',
        actions,
      }
      ret = userAction
      break
    }
    case 'connector': {
      const connector: ScrapedConnector = {
        id: node.id,
        type: 'connector',
        raw: '',
        next: getNext(node),
      }
      ret = connector
      break
    }
    default: {
      const other: ScrapedOther = {
        type: 'other',
        id: node.id,
        next: getNext(node),
        raw: findRawText(node),
      }
      ret = other
      break
    }
  }

  return ret
}

const isSignalListenInside = (host, child) =>
  child.name?.replace('05.', '').trim() === 'Signal listen' &&
  child.absoluteBoundingBox &&
  isNodeInside(host.absoluteBoundingBox, child.absoluteBoundingBox)

export const processFigma = async (data: any): Promise<Scraped> => {
  const nodes: ProcessedNodes = {}
  processNode(data, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  return nodeValues.map((n) => getNodeMetadata(n, nodeValues))
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
    node.children?.forEach((c) => {
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
