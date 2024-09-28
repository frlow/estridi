import {
  LogFunc,
  Scraped,
  ScrapedGateway,
  ScrapedNode,
  ScrapedOther,
  ScrapedScript,
  type ScrapedServiceCall,
  ScrapedStart,
  ScrapedUserAction,
} from '../../index.js'
import { isNodeInside } from '../index.js'
import { drawIoHelper } from './index.js'

export const processTeDrawIo = async (
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  const rawNodes = data.mxfile.diagram.mxGraphModel.root.mxCell
  const { getNext, getConnections, getTableMetadata } = drawIoHelper(rawNodes)
  const getNodeMetadata = (node: any): ScrapedNode => {
    const table = getTableMetadata(node, log)
    if (table) return table
    const type = node['@_type']
    switch (type) {
      case 'message':
      case 'signalSend':
      case 'script': {
        const script: ScrapedScript = {
          type: 'script',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
        }
        log && log('parsedScript', script)
        return script
      }
      case 'start': {
        const connections = getConnections(node)
        if (connections.length === 0) {
          const end: ScrapedStart = {
            type: 'end',
            id: node['@_id'],
            text: 'end',
          }
          log('parsedEnd', end)
          return end
        }
        const text = connections[0]?.text
        const isRoot = text?.startsWith('root:')
        const start: ScrapedStart = {
          type: 'start',
          id: node['@_id'],
          text: text?.replace('root:', ''),
          isRoot,
          next: getNext(node),
        }
        log(isRoot ? 'parsedRoot' : 'parsedStart', start)
        return start
      }
      case 'serviceCall': {
        const serviceCall: ScrapedServiceCall = {
          type: 'serviceCall',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
        }
        log('parsedServiceCall', serviceCall)
        return serviceCall
      }
      case 'gateway': {
        const connections = getConnections(node)
        const gateway: ScrapedGateway = {
          type: 'gateway',
          id: node['@_id'],
          text: node['@_value'],
          options: connections.reduce(
            (acc, cur) => ({ ...acc, [cur.target]: cur.text }),
            {},
          ),
        }
        log('parsedGateway', gateway)
        return gateway
      }
      case 'subprocess': {
        return {
          type: 'subprocess',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
          link: undefined,
        }
      }
      case 'userAction': {
        const isInside = (host: any, child: any) => {
          const getCoordinates = (node: any) => ({
            x: parseInt(node.mxGeometry['@_x']),
            y: parseInt(node.mxGeometry['@_y']),
            width: parseInt(node.mxGeometry['@_width']),
            height: parseInt(node.mxGeometry['@_height']),
          })
          return isNodeInside(getCoordinates(host), getCoordinates(child))
        }
        const actions = rawNodes
          .filter((n) => n['@_type'] === 'signalListen' && isInside(node, n))
          .map((a) => ({ text: a['@_value'], next: getNext(a) }))
          .reduce((acc, cur) => ({ ...acc, [cur.next]: cur.text }), {})
        const userAction: ScrapedUserAction = {
          type: 'userAction',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
          actions,
        }
        log && log('parsedUserAction', userAction)
        return userAction
      }
      default:
        if (!node['@_id'].includes('Connector')) {
          // debugger
        }
        const other: ScrapedOther = {
          type: 'other',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
        }
        log && log('parsedOther', other)
        return other
    }
  }
  const nodes: ScrapedNode[] = rawNodes.map((node) => getNodeMetadata(node))

  for (const node of nodes) {
    if (node.type === 'subprocess') {
      const link = nodes.find((n) => n.type === 'start' && n.text === node.text)
      node.link = link && link.id
      log && log('parsedSubprocess', node)
    }
  }
  return nodes
}
