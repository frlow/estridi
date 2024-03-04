import { allowedRegex } from './common'

export type NodeMetadata = ReturnType<typeof getNodeMetadata>
export const getNodeMetadata = (node: BaseNode) =>
  getScriptMetadata(node) ||
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
  getNoteMetadata(node)

const findText = (node: any) =>
  (node.children.find((c: any) => c.type === 'TEXT')?.characters || '')
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
  return {
    type: 'userAction',
    text: findText(node)
  }
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
  return {
    type: 'start',
    text: findText(node)
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
