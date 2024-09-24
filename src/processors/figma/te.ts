import { Node } from 'figma-api'
import type {
  LogFunc,
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
  ScrapedUserAction,
} from '../../index.js'
import { ProcessedNodes } from './index.js'
import { isNodeInside, sanitizeText } from '../index.js'

const findText = (node: any) => {
  const children: any[] = node.children || []
  children.sort((a) => (a.name === 'text' ? -1 : 1))
  return sanitizeText(
    children.find((c: any) => c.type === 'TEXT')?.characters || '',
  )
}

const getType = (node: Node): ScrapedNodeTypes => {
  if ((node.type as any) === 'TABLE') {
    const corner = (node as any).children[0]
    const cornerText: string = corner?.characters || 'N/A'
    return cornerText.startsWith('.') ? 'table' : 'other'
  }
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
  if (connections.length === 1) return connections[0].id
  return undefined
}

const getNodeMetadata = (node: Node, log: LogFunc): ScrapedNode => {
  const type = getType(node)
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
      const text = rows[0][0].substring(1)
      const table: ScrapedTable = { type: 'table', rows, id: node.id, text }
      log('parsedTable', table)
      return table
    }
    case 'script': {
      const script: ScrapedScript = {
        type: 'script',
        id: node.id,
        text: findText(node),
        next: getNext(node),
      }
      log('parsedScript', script)
      return script
    }
    case 'serviceCall': {
      const serviceCall: ScrapedServiceCall = {
        type: 'serviceCall',
        id: node.id,
        text: findText(node),
        next: getNext(node),
      }
      log('parsedServiceCall', serviceCall)
      return serviceCall
    }
    case 'start': {
      if ((node as any).connections.length === 0) {
        const end: ScrapedStart = {
          type: 'end',
          id: node.id,
          text: 'end',
        }
        log('parsedEnd', end)
        return end
      }
      const connection = (node as any).connections[0]
      const isRoot = connection?.text?.startsWith('root:')
      const start: ScrapedStart = {
        type: 'start',
        id: node.id,
        text: connection?.text?.replace('root:', '') || 'start',
        next: getNext(node),
        isRoot: isRoot,
      }
      log(isRoot ? 'parsedRoot' : 'parsedStart', start)
      return start
    }
    case 'gateway': {
      const gateway: ScrapedGateway = {
        type: 'gateway',
        id: node.id,
        text: findText(node),
        options: ((node as any).connections || []).reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur.text }),
          {},
        ),
      }
      log('parsedGateway', gateway)
      return gateway
    }
    case 'subprocess': {
      return {
        type: 'subprocess',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        link: undefined,
      }
    }
    case 'userAction': {
      return {
        type: 'userAction',
        id: node.id,
        text: findText(node),
        next: getNext(node),
        actions: {},
      }
    }
    default: {
      const other: ScrapedOther = {
        type: 'other',
        id: node.id,
        next: getNext(node),
        text: findText(node),
      }
      log('parsedOther', other)
      return other
    }
  }
}

const afterProcess = (
  scraped: Scraped,
  nodes: ProcessedNodes,
  log: LogFunc,
): Scraped => {
  const ret = structuredClone(scraped)
  ret
    .filter((node) => node.type === 'subprocess')
    .forEach((sp: ScrapedSubprocess) => {
      const linkNode = ret.find((n) => n.type === 'start' && n.text === sp.text)
      sp.link = linkNode?.id
      log('parsedSubprocess', sp)
    })
  ret
    .filter((node) => node.type === 'userAction')
    .forEach((ua: ScrapedUserAction) => {
      const uaNode = nodes[ua.id]
      const actions = Object.values(nodes).filter(
        (n) =>
          n.name?.replace('05.', '').trim() === 'Signal listen' &&
          n.absoluteBoundingBox &&
          isNodeInside(uaNode.absoluteBoundingBox, n.absoluteBoundingBox),
      )
      actions.forEach((a) => (ua.actions[getNext(a)] = findText(a)))
      log('parsedUserAction', ua)
    })
  return ret
}

export const processTeFigma = async (
  nodes: ProcessedNodes,
  log: LogFunc,
): Promise<Scraped> => {
  const nodeValues = Object.values(nodes)
  const scraped = nodeValues.map((n) => getNodeMetadata(n, log))
  return afterProcess(scraped, nodes, log)
}
