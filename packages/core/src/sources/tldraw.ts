import { camelize } from '../texts'
import { getOutPaths, isNodeInside } from './common'
import {
  Scraped,
  ScrapedConnector,
  ScrapedGateway,
  ScrapedLoop,
  ScrapedNode,
  ScrapedNodeTypes,
  scrapedNodeTypes,
  ScrapedOther, ScrapedPage,
  ScrapedParallel,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedStart,
  ScrapedSubprocess,
  ScrapedTable,
  ScrapedUserAction
} from '../scraped'

export type ProcessedNodes = Record<string, any>

const findChildNodes = (nodes: any[], parentId: string): string[] =>{
  const toProcess = [parentId]
  const acc: string[] = []
  while(toProcess.length>0){
    const childIds = nodes.filter(n=>toProcess.includes(n.state.parentId)).map(n=>n.state.id)
    toProcess.splice(0, toProcess.length)
    toProcess.push(...childIds)
    acc.push(...childIds)
  }
  return acc
}

const getDimensions = (node: any, nodes: any) => {
  const height = node.state.props?.h
  const width = node.state.props?.w
  if (!height || !width) return undefined
  const x = [node.state.x]
  const y = [node.state.y]
  let parentId = node.state.parentId
  while (parentId) {
    const parent = nodes.find((n) => n.state.id === parentId)
    parentId = parent.state.parentId
    if (!parent.state.x || !parent.state.y) break
    x.push(parent.state.x)
    y.push(parent.state.y)
  }
  return {
    x: x.reduce((acc, cur) => acc + cur, 0),
    y: y.reduce((acc, cur) => acc + cur, 0),
    width,
    height,
  }
}

type RichText = { content: any }
const parseRichText = (richText: RichText): string[] => {
  if (!richText) return undefined
  const text = richText.content.flatMap((c) => {
    if (c.content) return parseRichText(c)
    return c.text
  })
  return text
}

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

  const getType = (node: any): ScrapedNodeTypes | 'signalListen' => {
    const types = [...scrapedNodeTypes, 'signalListen']
    const nodeType: any = camelize(
      node.state?.type?.replace('-be', '')?.replace('-fe', '') || '',
    )
    if (types.includes(nodeType)) return nodeType
    if (node.state.typeName === 'page') return 'page'
    return 'other'
  }

  const getId = (id: string) => {
    return id //?.replace(/^shape:/, '')
  }

  const getActions = (node: any, data: any) =>
    data
      .filter(
        (n) =>
          getType(n) === 'signalListen' &&
          isNodeInside(getDimensions(node, data), getDimensions(n, data)),
      )
      .reduce((acc, cur) => {
        acc[getNext(cur)] = findRawText(cur)
        return acc
      }, {}) as Record<string, string>

  const getNodeMetadata = (
    node: any,
    data: any[],
  ): ScrapedNode => {
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
        const outPaths = getOutPaths(node)
        if (outPaths) script.special = { out: outPaths }
        return script
      case 'subprocess': {
        const raw = findRawText(node)
        const link = data.find(
          (n) => getType(n) === 'start' && getNodeMetadata(n, data).raw === raw,
        )?.state?.id
        const actions = getActions(node, data)
        const subprocess: ScrapedSubprocess = {
          type: 'subprocess',
          id: getId(node.state.id),
          raw,
          next: getNext(node),
          link,
        }
        if (Object.keys(actions).length > 0) subprocess.special = { actions }
        return subprocess
      }
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
          actions: getActions(node, data),
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
      case 'page':
        const page : ScrapedPage = {
          id: getId(node.state.id),
          type: "page",
          raw: node.state.name,
          nodes: findChildNodes(data, getId(node.state.id))
        }
        return page
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

  const nodes: ProcessedNodes = {}
  processData(data.documents, nodes)
  const nodesWithConnections = mapConnections(nodes)
  const nodeValues = Object.values(nodesWithConnections)
  return nodeValues.map((n) => getNodeMetadata(n, nodeValues))
}
