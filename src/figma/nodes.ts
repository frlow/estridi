import { allowedRegex } from '../common.js'

export type NodeMetadata = ReturnType<typeof getNodeMetadata>
export const getNodeMetadata = (node: any) => {
  const meta: any = getScriptMetadata(node) ||
    getServiceCallMetadata(node) ||
    getSubProcessMetadata(node) ||
    getUserActionMetadata(node) ||
    getSignalSendExternalMetadata(node) ||
    getSignalSendMetadata(node) ||
    getGatewayMetadata(node) ||
    getMessageMetadata(node) ||
    getSignalListenMetadata(node) ||
    getStartMetadata(node) ||
    getInputMetadata(node) ||
    getOutputMetadata(node) ||
    getConnectorMetadata(node) ||
    getParallelGatewayMetadata(node) ||
    getTimerMetadata(node) ||
    getNoteMetadata(node) ||
    getTableMetadata(node)
  if (!meta) return undefined
  meta.connections = node.scraped
    .filter((n: any) =>
      n.type === 'CONNECTOR' &&
      !n.strokeDashes &&
      n.connectorStart.endpointNodeId === node.id)
    .reduce((acc: any, cur: any) => ({ ...acc, [cur.connectorEnd.endpointNodeId]: cur.name || 'N/A' }), {})
  meta.id = node.id
  return meta
}

export const findText = (node: any) =>
  (node.children?.find((c: any) => c.type === 'TEXT')?.characters || '')
    .replace(allowedRegex, ' ')
    .replace(/\n/g, ' ')
    .replace(/ +/g, ' ')
    .trim()

const getScriptMetadata = (node: any) => {
  if (node.name !== 'Script') return undefined
  return {
    type: 'script',
    text: findText(node)
  }
}

const getServiceCallMetadata = (node: any) => {
  if (node.name !== 'Service call') return undefined
  return {
    type: 'serviceCall',
    text: findText(node)
  }
}

const getSubProcessMetadata = (node: any) => {
  if (node.name !== 'Subprocess') return undefined
  return {
    type: 'subprocess',
    text: findText(node)
  }
}

const getUserActionMetadata = (node: any) => {
  if (node.name !== 'User action') return undefined
  const ret = {
    type: 'userAction',
    text: findText(node),
    actions: node.scraped
      .filter((n: any) =>
        n.name === 'Signal listen' &&
        isNodeInside(node.absoluteBoundingBox, n.absoluteBoundingBox))
      .map((n: any) => n.id)
  }
  return ret
}

const getSignalSendExternalMetadata = (node: any) => {
  if (node.name !== 'Signal send external') return undefined
  return {
    type: 'signalSendExternal',
    text: findText(node)
  }
}

const getSignalSendMetadata = (node: any) => {
  if (node.name !== 'Signal send') return undefined
  return {
    type: 'signalSend',
    text: findText(node)
  }
}

const getGatewayMetadata = (node: any) => {
  if (node.name !== 'Gateway') return undefined
  return {
    type: node.children.length === 3 ? 'gatewayLoop' : 'gateway',
    text: findText(node)
  }
}
const getMessageMetadata = (node: any) => {
  if (node.name !== 'Message') return undefined
  return {
    type: 'message',
    text: findText(node)
  }
}
const getSignalListenMetadata = (node: any) => {
  if (node.name !== 'Signal listen') return undefined
  return {
    type: 'signalListen',
    text: findText(node)
  }
}

const getStartMetadata = (node: any) => {
  if (node.name !== 'Start') return undefined
  const connector = node.scraped.find((n: any) =>
    n.type === 'CONNECTOR' &&
    n.connectorStart?.endpointNodeId === node.id) //node.attachedConnectors.find((c: any) => c.connectorStart.endpointNodeId === node.id)
  const type = !!connector ? 'start' : 'end'
  const text = (!!connector && connector.name !== 'Connector line') ? connector?.name : `start_${node.id.replace(':', '_')}`
  return {
    type,
    text
  }
}

const getInputMetadata = (node: any) => {
  if (node.name !== 'Input') return undefined
  return {
    type: 'input',
    text: findText(node)
  }
}

const getOutputMetadata = (node: any) => {
  if (node.name !== 'Output') return undefined
  return {
    type: 'output',
    text: findText(node)
  }
}

const getConnectorMetadata = (node: any) => {
  if (node.name !== 'Connector') return undefined
  return {
    type: 'connector',
    text: findText(node)
  }
}

const getParallelGatewayMetadata = (node: any) => {
  if (node.name !== 'Paralell gateway') return undefined
  return {
    type: 'parallelGateway',
    text: findText(node)
  }
}

const getTimerMetadata = (node: any) => {
  if (node.name !== 'Timer') return undefined
  return {
    type: 'timer',
    text: findText(node)
  }
}

const getNoteMetadata = (node: any) => {
  if (node.name !== 'Note') return undefined
  return {
    type: 'note',
    text: findText(node)
  }
}

const getTableMetadata = (node: any) => {
  if (node.type !== 'TABLE') return undefined
  const rows: string[][] = Object.values(node.children.reduce((acc: Record<string, string[]>, cur: any) => ({
    ...acc,
    [cur.absoluteBoundingBox.y]: [...(acc[cur.absoluteBoundingBox.y] || []), cur.characters]
  }), {}))
  const headers = rows[0]
  const corner = rows[0][0]
  if (!corner.startsWith('.')) return undefined
  const content = rows.slice(1)
  return {
    type: 'table',
    text: corner.substring(1),
    headers,
    content
  }
}

type Points = { x0: number, x1: number, y0: number, y1: number }
export const isNodeInside = (host: any, child: any) =>
  isInside({
    x0: host.x,
    x1: host.x + host.width,
    y0: host.y,
    y1: host.y + host.height
  }, {
    x0: child.x,
    x1: child.x + child.width,
    y0: child.y,
    y1: child.y + child.height
  })
export const isInside = (host: Points, child: Points) => {
  const compare = (x: number, y: number) => x > host.x0 && x < host.x1 && y > host.y0 && y < host.y1
  if (compare(child.x0, child.y0)) return true
  if (compare(child.x1, child.y0)) return true
  if (compare(child.x0, child.y1)) return true
  if (compare(child.x1, child.y1)) return true
  return false
}
