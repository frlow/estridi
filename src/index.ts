import { scrapeTable2, traverse2 } from './figma/traverse'
import { Scraped } from './common'

figma.showUI(__html__)

const isStartNode = (node: any) =>
  node.name === 'Start' &&
  node.children![0].strokeWeight?.toString()?.startsWith('2')

const isSection = (node: BaseNode) => node.type === 'SECTION'

figma.ui.onmessage = (msg) => {
  if (msg.type === 'traverse') {
    // const result: Feature[] = []
    const nodes2: Scraped = {}
    const sections = figma.currentPage.children.filter((c) => isSection(c))
    for (const section of sections as SectionNode[]) {
      const startNodes = section.children.filter((c) => isStartNode(c))
      startNodes.forEach(s => traverse2(section.name, s, nodes2))
      const tables = section.children.filter((c) => c.type === 'TABLE')
      tables.forEach(t => scrapeTable2(section.name, t, nodes2))
    }
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(nodes2)
    }).catch(() => console.log('local server not started'))
  }
}

