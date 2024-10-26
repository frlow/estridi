import type { Node } from 'figma-api'
import * as Figma from 'figma-api'
import { sanitizeText } from '../common/texts.js'
import { isNodeInside } from '../common/inside.js'

export type ProcessedNodes = Record<string, Node<any>>
export type FigmaDocument = Figma.Node<'DOCUMENT'>
export const loadFigmaDocument = async ({
                                          fileId,
                                          token
                                        }: FigmaConfig): Promise<FigmaDocument> => {
  if (!fileId || !token) throw 'token and fileId must be set'
  const api = new Figma.Api({
    personalAccessToken: token
  })

  const file = await api.getFile(fileId)
  return file.document
}

const findRawText = (node: any) => {
  const children: any[] = node.children || []
  children.sort((a) => (a.name === 'text' ? -1 : 1))
  return children.find((c: any) => c.type === 'TEXT')?.characters || ''
}

const findText = (node: any) => sanitizeText(findRawText(node))

const getType = (node: Node): ScrapedNodeTypes => {
  if ((node.type as any) === 'TABLE') return 'table'
  if (node.name?.replace('02.', '').trim() === 'Message') return 'script'
  if (node.name?.replace('06.', '').trim() === 'Signal send') return 'script'
  if (node.name?.replace('3.', '').trim() === 'Script') return 'script'
  if (node.name?.replace('4.', '').trim() === 'Service call')
    return 'serviceCall'
  if (node.name?.replace('01.', '').trim() === 'Start') return 'start'
  if (node.name?.replace('04.', '').trim() === 'Gateway') return 'gateway'
  if (node.name?.replace('2.', '').trim() === 'Subprocess') return 'subprocess'
  if (node.name?.replace('1.', '').trim() === 'User action') return 'userAction'
  if (node.name?.replace('05.', '').trim() === 'Signal listen')
    return 'signalListen' as any
  return 'other'
}

const getNext = (node: any): string | undefined => {
  const connections = node.connections
  if (connections?.length === 1) return connections[0].id
  return undefined
}

const getTableKey = (node: any) => {
  const text = findRawText(node)
  const splitResult = text.split(':')
  if (splitResult.length !== 2) return undefined
  return splitResult[1].trim()
}

const isCustomTest = (node: any) => findRawText(node).startsWith('_')

const getNodeMetadata = (node: Node): ScrapedNode => {
  const type = getType(node)
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
      const text = rows[0][0].substring(1)
      const table: ScrapedTable = { type: 'table', rows, id: node.id, text }
      return table
    }
    case 'script': {
      const script: ScrapedScript = {
        type: 'script',
        id: node.id,
        text: findText(node),
        next: getNext(node)
      }
      if (isCustomTest(node)) script.customTest = true
      return script
    }
    case 'serviceCall': {
      const serviceCall: ScrapedServiceCall = {
        type: 'serviceCall',
        id: node.id,
        text: findText(node),
        next: getNext(node)
      }
      return serviceCall
    }
    case 'start': {
      if ((node as any).connections.length === 0) {
        const end: ScrapedStart = {
          type: 'end',
          id: node.id,
          text: 'end'
        }
        return end
      }
      const connection = (node as any).connections[0]
      const isRoot = connection?.text?.startsWith('root:')
      const start: ScrapedStart = {
        type: 'start',
        id: node.id,
        text: connection?.text?.replace('root:', '') || 'start',
        next: getNext(node),
        isRoot: isRoot
      }
      return start
    }
    case 'gateway': {
      const gateway: ScrapedGateway = {
        type: 'gateway',
        id: node.id,
        text: findText(node),
        options: ((node as any).connections || []).reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur.text }),
          {}
        )
      }
      return gateway
    }
    case 'subprocess': {
      return {
        type: 'subprocess',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        link: undefined,
        tableKey: getTableKey(node)
      }
    }
    case 'userAction': {
      return {
        type: 'userAction',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        actions: {}
      }
    }
    default: {
      const other: ScrapedOther = {
        type: 'other',
        id: node.id,
        next: getNext(node),
        text: findText(node)
      }
      return other
    }
  }
}

const afterProcess = (
  scraped: Scraped,
  nodes: ProcessedNodes
): Scraped => {
  const ret = structuredClone(scraped)
  ret
    .filter((node) => node.type === 'subprocess')
    .forEach((sp: ScrapedSubprocess) => {
      const linkNode = ret.find((n) => n.type === 'start' && n.text === sp.text)
      sp.link = linkNode?.id
    })
  ret
    .filter((node) => node.type === 'userAction')
    .forEach((ua: ScrapedUserAction) => {
      const uaNode = nodes[ua.id]
      const actions = Object.values(nodes).filter(
        (n) =>
          n.name?.replace('05.', '').trim() === 'Signal listen' &&
          n.absoluteBoundingBox &&
          isNodeInside(uaNode.absoluteBoundingBox, n.absoluteBoundingBox)
      )
      actions.forEach((a) => (ua.actions[getNext(a)] = findText(a)))
    })
  return ret
}


export const processFigma = async (
  data: any
): Promise<Scraped> => {
  const nodes: ProcessedNodes = {}
  processNode(data, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  const scraped = nodeValues.map((n) => getNodeMetadata(n))
  return afterProcess(scraped, nodesWithConnections)
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
    node.connections = connections
      .filter((c) => {
        return c.connectorStart?.endpointNodeId === node.id && !c.strokeDashes
      })
      .map((c) => ({ id: c.connectorEnd?.endpointNodeId, text: c.name }))
  })
  return temp
}
