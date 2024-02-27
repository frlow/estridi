import { getNodeMetadata } from './nodes'
import { createFeature, Feature, handleNode } from './feature'

figma.showUI(__html__)

const isStartNode = (node: any) =>
  node.name === 'Start' &&
  node.children![0].strokeWeight?.toString()?.startsWith('2')

const isSection = (node: BaseNode) => node.type === 'SECTION'
const isAction = (node: BaseNode) => node.name === 'Signal listen'

figma.ui.onmessage = (msg) => {
  if (msg.type === 'traverse') {
    const result: Feature[] = []
    const sections = figma.currentPage.children.filter((c) => isSection(c))
    for (const section of sections as SectionNode[]) {
      const start = section.children.find((c) => isStartNode(c))
      if (!start) continue
      const parsedStartNode = traverse(start)
      const handledNodes = handleNode(parsedStartNode)
      const actions = section.children.filter((c) => isAction(c))
      const handledActions = actions.map((a) => handleNode(traverse(a)))
      handledActions.forEach((h) => handledNodes.push(...h))
      const feature = createFeature(section.name, handledNodes)
      result.push(feature)
    }
    const body = JSON.stringify(result)
    console.log(result)
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    }).catch(() => console.log('local server not started'))
  }
  if (msg.type === 'identify') {
    const nodes = figma.currentPage.selection
    for (const node of nodes) {
      console.log(getNodeMetadata(node))
    }
  }
}

const traverse = (node: any, visited: string[] = []): any => {
  if (visited.includes(node.id)) return { id: node.id }
  const connectors = node?.attachedConnectors.filter(
    (c: any) =>
      c?.dashPattern?.length === 0 &&
      c?.connectorStart?.endpointNodeId === node.id,
  )
  const meta = getNodeMetadata(node)
  const nextNodes =
    meta?.type === 'gateway'
      ? connectors?.map((c: any) => {
          return {
            id: c.id,
            meta: {
              type: 'connector',
              text: meta.text.replace(/[^a-zA-Z0-9]/, ''),
              value: c.name || 'unknown',
            },
            next: [
              traverse(figma.getNodeById(c?.connectorEnd?.endpointNodeId), [
                ...visited,
                node.id,
              ]),
            ],
          }
        })
      : connectors?.map((c: any) => {
          const nextNode = figma.getNodeById(c?.connectorEnd?.endpointNodeId)
          return traverse(nextNode, [...visited, node.id])
        })

  return {
    id: node.id,
    meta: getNodeMetadata(node),
    next: nextNodes,
  }
}
