import * as Figma from 'figma-api'
import { getNodeMetadata } from './nodes.js'


const processNode = (node: any, acc: Record<string, any>) => {
  if (acc[node.id]) return
  acc[node.id] = node
  const children = node.children || []
  children.forEach((c: any) => processNode(c, acc))
}

export const loadFromFigma = async ({ token, fileId }: { fileId: string, token: string }) => {
  const api = new Figma.Api({
    personalAccessToken: token
  })

  const file = await api.getFile(fileId)
  const acc: Record<string, any> = {}
  processNode(file.document, acc)
  const nodes = Object.values(acc)
  const patchedNodes = nodes.map((node, i, arr) => ({
    ...node,
    attachedConnectors: arr.filter(n => n.type === 'CONNECTOR' && n.connectorStart?.endpointNodeId === node.id).map(c => ({
      ...c,
      dashPattern: { length: c.strokeDashes ? 2 : 0 }
    })),
    ...node.absoluteBoundingBox
  }))
  patchedNodes.forEach(n => n.parent = { children: patchedNodes })
  return patchedNodes.map(node => getNodeMetadata(node)).filter(n => n)
}