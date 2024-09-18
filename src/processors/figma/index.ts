import { FigmaConfig, LogFunc } from '../../index'
import * as Figma from 'figma-api'
import { Node } from 'figma-api'
import { processTeFigma } from './te'

export const processNode = (node: any, acc: ProcessedNodes) => {
  if (acc[node.id]) return
  acc[node.id] = node
  const children = node.children || []
  children.forEach((c: any) => processNode(c, acc))
}

export type FigmaDocument = Figma.Node<'DOCUMENT'>
export const loadFigmaDocument = async ({
  fileId,
  token,
}: {
  fileId: string
  token: string
}): Promise<FigmaDocument> => {
  if (!fileId || !token) throw 'token and fileId must be set'
  const api = new Figma.Api({
    personalAccessToken: token,
  })

  const file = await api.getFile(fileId)
  return file.document
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

export type ProcessedNodes = Record<string, Node<any>>
export const processFigma = async (
  config: FigmaConfig,
  data: FigmaDocument,
  log: LogFunc,
) => {
  const nodes: ProcessedNodes = {}
  processNode(data, nodes)
  const nodesWithConnections = mapConnections(nodes)
  switch (config.variant) {
    case 'TE':
      return await processTeFigma(nodesWithConnections, log)
    default:
      throw `${config.variant} not implemented yet`
  }
}
