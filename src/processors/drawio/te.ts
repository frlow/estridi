import {
  LogFunc,
  Scraped,
  ScrapedGateway,
  ScrapedNode,
  ScrapedOther,
  ScrapedScript,
  type ScrapedServiceCall,
  ScrapedStart,
  ScrapedTable,
  ScrapedUserAction,
} from '../../index.js'
import { isNodeInside } from '../index.js'

// export const drawIoTeStyles = {
//   start:
//     'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;outline=standard;symbol=general;fillColor=#99CCFF;',
//   script:
//     'shape=ext;rounded=0;html=1;whiteSpace=wrap;glass=0;fillColor=#99CCFF;gradientColor=none;',
//   message:
//     'points=[[0.145,0.145,0],[0.5,0,0],[0.855,0.145,0],[1,0.5,0],[0.855,0.855,0],[0.5,1,0],[0.145,0.855,0],[0,0.5,0]];shape=mxgraph.bpmn.event;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;aspect=fixed;outline=end;symbol=message;fillColor=#99CCFF;',
//   signalSend:
//     'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;outline=end;symbol=signal;rounded=0;glass=0;fillColor=#99CCFF;gradientColor=none;fontColor=none;resizable=0;rotatable=0;strokeColor=#FFFFFF;',
//   serviceCall:
//     'shape=ext;rounded=0;html=1;whiteSpace=wrap;glass=0;gradientColor=none;fillColor=#7AB648;',
//   gateway:
//     'rhombus;html=1;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;fillColor=#99CCFF;fontSize=12;',
//   subprocess:
//     'shape=ext;rounded=0;html=1;whiteSpace=wrap;glass=0;fillColor=#99CCFF;gradientColor=none;',
// }

// const styles: Record<string, ScrapedNodeTypes> = {
//   [drawIoTeStyles.start]: 'start',
//   [drawIoTeStyles.script]: 'script',
//   [drawIoTeStyles.message]: 'script',
//   [drawIoTeStyles.signalSend]: 'script',
//   [drawIoTeStyles.serviceCall]: 'serviceCall',
//   [drawIoTeStyles.gateway]: 'gateway',
//   [drawIoTeStyles.subprocess]: 'subprocess',
// }

export const processTeDrawIo = async (
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  const rawNodes = data.mxfile.diagram.mxGraphModel.root.mxCell
  const getConnections = (
    node: any,
  ): { target: string; text: string | undefined }[] => {
    const getConnectionText = (id: string) => {
      const connectionText = rawNodes.find((n) => n['@_parent'] === id)
      return connectionText ? connectionText['@_value'] : undefined
    }
    const connectionNodes = rawNodes.filter(
      (n: any) =>
        n['@_source'] === node['@_id'] && !n['@_style']?.includes('dashed'),
    )
    return connectionNodes.map((c: any) => ({
      target: c['@_target'],
      text: getConnectionText(c['@_id']),
    }))
  }
  const getNext = (node: any) => {
    const connection = getConnections(node)[0]
    return connection?.target
  }
  const getNodeMetadata = (node: any): ScrapedNode => {
    if (node['@_style'] && node['@_style'].includes('shape=table;')) {
      const rowIds = rawNodes
        .filter(
          (n) =>
            n['@_style'] &&
            n['@_style'].includes('shape=tableRow;') &&
            n['@_parent'] === node['@_id'],
        )
        .map((r) => r['@_id'])
      const values = rowIds.map((rId) =>
        rawNodes.filter((n) => n['@_parent'] === rId).map((v) => v['@_value']),
      )
      const text: string = values[0][0]
      const isConnected = text.startsWith('.')
      if (isConnected) {
        const table: ScrapedTable = {
          type: 'table',
          id: node['@_id'],
          text: text.substring(1),
          rows: values,
        }
        log && log('parsedTable', table)
        return table
      }
    }
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
