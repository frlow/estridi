import { getNodeMetadata } from './figma/nodes.js'

figma.showUI(__html__)
figma.ui.onmessage = (msg) => {
  if (msg.type === 'traverse') {
    const nodes = figma.currentPage.findAll().map(n => getNodeMetadata(n)).filter(n => n)
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(nodes)
    }).catch(() => console.log('local server not started'))
  }
}

