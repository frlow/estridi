import { getConnections, getTableMetadata, isNodeInside, sanitizeText } from './common.js'

const matchNames = (name: string, nodeName: string) => {
  if (name === nodeName) return true
  // There are 2 ways of naming the nodes in figma templates
  // old "Subflows"
  // new "2. Subflows"
  const fixed = name.replace(/[0-9]*\. /, '')
  return fixed === nodeName
}

// export type TeNodeMetadata = ReturnType<typeof getNodeMetadata>
export const getTeNodeMetadata = (node: any) => {
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
  if (meta.type !== 'table')
    meta.connections = getConnections(node)
  meta.id = node.id
  return meta
}

export const findText = (node: any) => {
  const children: any[] = node.children || []
  children.sort((a) => a.name === 'text' ? -1 : 1)
  return sanitizeText(children.find((c: any) => c.type === 'TEXT')?.characters || '')
}


const getScriptMetadata = (node: any) => {
  if (!matchNames(node.name, 'Script')) return undefined
  return {
    type: 'script',
    text: findText(node)
  }
}

const getServiceCallMetadata = (node: any) => {
  if (!matchNames(node.name, 'Service call')) return undefined
  const inputs = node.scraped
    .filter((n: any) => n.connectorStart?.endpointNodeId === node.id || n.connectorEnd?.endpointNodeId === node.id)
    .flatMap((n: any) => ([n.connectorStart?.endpointNodeId, n.connectorEnd?.endpointNodeId]))
    .map((id: string) => node.scraped.find((n: any) => n.id === id))
    .filter((n: any) => matchNames(n.name, 'Input'))
    .map((n: any) => findText(n))
  return {
    type: 'serviceCall',
    inputs,
    text: findText(node)
  }
}

const getSubProcessMetadata = (node: any) => {
  if (!matchNames(node.name, 'Subprocess')) return undefined
  return {
    type: 'subprocess',
    text: findText(node)
  }
}

const getUserActionMetadata = (node: any) => {
  if (!matchNames(node.name, 'User action')) return undefined
  const ret = {
    type: 'userAction',
    text: findText(node),
    actions: node.scraped
      .filter((n: any) =>
        matchNames(n.name, 'Signal listen') &&
        isNodeInside(node.absoluteBoundingBox, n.absoluteBoundingBox))
      .map((n: any) => n.id)
  }
  return ret
}

const getSignalSendExternalMetadata = (node: any) => {
  if (!matchNames(node.name, 'Signal send external')) return undefined
  return {
    type: 'signalSendExternal',
    text: findText(node)
  }
}

const getSignalSendMetadata = (node: any) => {
  if (!matchNames(node.name, 'Signal send')) return undefined
  return {
    type: 'signalSend',
    text: findText(node)
  }
}

const getGatewayMetadata = (node: any) => {
  if (!matchNames(node.name, 'Gateway')) return undefined
  return {
    type: node.children.length === 3 ? 'gatewayLoop' : 'gateway',
    text: findText(node)
  }
}
const getMessageMetadata = (node: any) => {
  if (!matchNames(node.name, 'Message')) return undefined
  return {
    type: 'message',
    text: findText(node)
  }
}
const getSignalListenMetadata = (node: any) => {
  if (!matchNames(node.name, 'Signal listen')) return undefined
  return {
    type: 'signalListen',
    text: findText(node)
  }
}

const getStartMetadata = (node: any) => {
  if (!matchNames(node.name, 'Start')) return undefined
  const connector = node.scraped.find((n: any) =>
    n.type === 'CONNECTOR' &&
    n.connectorStart?.endpointNodeId === node.id) //node.attachedConnectors.find((c: any) => c.connectorStart.endpointNodeId === node.id)
  const type = !!connector ? 'start' : 'end'
  const text = (!!connector && connector.name !== 'Connector line') ? connector?.name : `start_${node.id.replace(':', '_')}`
  const ret: any = {
    type,
    text: type === 'end' ? 'end' : sanitizeText(text)
  }
  if (ret.type === 'start' && text.startsWith('root:')) ret.rootName = text.replace('root:', '')
  return ret
}

const getInputMetadata = (node: any) => {
  if (!matchNames(node.name, 'Input')) return undefined
  return {
    type: 'input',
    text: findText(node)
  }
}

const getOutputMetadata = (node: any) => {
  if (!matchNames(node.name, 'Output')) return undefined
  return {
    type: 'output',
    text: findText(node)
  }
}

const getConnectorMetadata = (node: any) => {
  if (!matchNames(node.name, 'Connector')) return undefined
  return {
    type: 'connector',
    text: findText(node)
  }
}

const getParallelGatewayMetadata = (node: any) => {
  if (!matchNames(node.name, 'Paralell gateway')) return undefined
  return {
    type: 'parallelGateway',
    text: findText(node)
  }
}

const getTimerMetadata = (node: any) => {
  if (!matchNames(node.name, 'Timer')) return undefined
  return {
    type: 'timer',
    text: findText(node)
  }
}

const getNoteMetadata = (node: any) => {
  if (!matchNames(node.name, 'Note')) return undefined
  return {
    type: 'note',
    text: findText(node)
  }
}



