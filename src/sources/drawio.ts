import { isNodeInside } from '../common/inside.js'

export const drawIoHelper = (rawNodes: any[]) => {
  const getTableMetadata = (node: any) => {
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
        return table
      }
    }
    return undefined
  }

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

  return { getConnections, getNext, getTableMetadata }
}

const getTableKey = (node: any) => {
  const text = node['@_value']
  const splitResult = text.split(':')
  if (splitResult.length !== 2) return undefined
  return splitResult[1].trim()
}

export const processDrawIo = async (
  data: any,
): Promise<Scraped> => {
  const rawNodes = data.mxfile.diagram.mxGraphModel.root.mxCell
  const { getNext, getConnections, getTableMetadata } = drawIoHelper(rawNodes)
  const getNodeMetadata = (node: any): ScrapedNode => {
    const table = getTableMetadata(node)
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
        return script
      }
      case 'start': {
        const connections = getConnections(node)
        if (connections.length === 0) return {
          type: 'end',
          id: node['@_id'],
          text: 'end'
        }
        const text = connections[0]?.text
        const isRoot = text?.startsWith('root:')
        return {
          type: 'start',
          id: node['@_id'],
          text: text?.replace('root:', ''),
          isRoot,
          next: getNext(node),
        }
      }
      case 'serviceCall': {
        return {
          type: 'serviceCall',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
        }
      }
      case 'gateway': {
        const connections = getConnections(node)
        return {
          type: 'gateway',
          id: node['@_id'],
          text: node['@_value'],
          options: connections.reduce(
            (acc, cur) => ({ ...acc, [cur.target]: cur.text }),
            {},
          ),
        }
      }
      case 'subprocess': {
        return {
          type: 'subprocess',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
          link: undefined,
          tableKey: getTableKey(node)
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
        return {
          type: 'userAction',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
          actions,
        }
      }
      default:
        if (!node['@_id'].includes('Connector')) {
          // debugger
        }
        return {
          type: 'other',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node),
        }
    }
  }
  const nodes: ScrapedNode[] = rawNodes.map((node) => getNodeMetadata(node))

  for (const node of nodes) {
    if (node.type === 'subprocess') {
      const link = nodes.find((n) => n.type === 'start' && n.text === node.text)
      node.link = link && link.id
    }
  }
  return nodes
}
