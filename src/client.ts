import { getNodeMetadata } from './figma/nodes'

figma.showUI(__html__)

const isStartNode = (node: any) =>
  node.name === 'Start' && node.attachedConnectors.some((c: any) => c.connectorStart.endpointNodeId === node.id)

const isSection = (node: BaseNode) => node.type === 'SECTION'

figma.ui.onmessage = (msg) => {
  if (msg.type === 'traverse') {
    // const nodes2: Scraped = {}
    const nodes = figma.currentPage.findAll().map(n => getNodeMetadata(n)).filter(n => n)
    // const startNodes = figma.currentPage.findAll().filter(node=>isStartNode(node))
    // startNodes.forEach(s => traverse2(s, nodes2))
    // const tables = figma.currentPage.findAll().filter(node=>node.type==="TABLE")
    // tables.forEach(t => scrapeTable2(t, nodes2))
    console.log(nodes)
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(nodes)
    }).catch(() => console.log('local server not started'))
  }
}

