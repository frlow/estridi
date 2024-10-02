import { createMermaidRenderer } from './parser.js'
import * as fs from 'fs'
import { Scraped, ScrapedNode } from '../../scraped.js'
import { LogFunc, MermaidConfig } from '../../index.js'

export const loadMermaidDocument = async (
  config: MermaidConfig,
): Promise<any[]> => {
  if (!config.mermaidFile) throw 'file must be set'
  const content = fs.readFileSync(config.mermaidFile, 'utf-8')
  const flowcharts: string[] = (
    content.match(/```mermaid(?:.|\n)*?```/g) || []
  ).map((m) => m.replace('```mermaid\n', '').replace('```', ''))
  return await createMermaidRenderer({
    launchOptions: { headless: true, devtools: false },
  })(flowcharts)
}

export const processMermaid = async (
  data: any[],
  log: LogFunc,
): Promise<Scraped> => {
  const scraped: Scraped = []
  for (const chart of data) {
    const { nodes, edges }: { nodes: any[]; edges: any[] } = chart.value

    const processNode = (current: any): ScrapedNode | undefined => {
      current.connections = edges
        .filter((e) => e.start === current.id && e.thickness === 'normal')
        .reduce((acc, cur) => {
          acc[cur.end] = cur.label || 'Connection'
          return acc
        }, {})
      current.hasConnections = Object.keys(current.connections).length > 0
      if (current.shape === 'circle')
        return {
          type: current.hasConnections ? 'start' : 'end',
          text: current.label,
          id: current.id,
          // @ts-ignore
          connections: current.connections,
        }
      if (current.shape === 'subroutine')
        return {
          type: 'serviceCall',
          text: current.label,
          id: current.id,
          // @ts-ignore
          connections: current.connections,
        }
      if (current.shape === 'diamond')
        return {
          type: 'gateway',
          text: current.label,
          id: current.id,
          // @ts-ignore
          connections: current.connections,
        }
      if (current.shape === 'squareRect')
        return {
          type: 'script',
          text: current.label,
          id: current.id,
          // @ts-ignore
          connections: current.connections,
        }
      if (current.shape === 'hexagon') {
        const actions = edges
          .filter(
            (edge) => edge.start === current.id && edge.thickness === 'thick',
          )
          .map((e) => e.end)
        return {
          type: 'userAction',
          text: current.label,
          id: current.id,
          connections: current.connections,
          // @ts-ignore
          actions,
        }
      }
      if (current.shape === 'doublecircle')
        return {
          // @ts-ignore
          type: 'signalListen',
          text: current.label,
          id: current.id,
          connections: current.connections,
        }
      if (current.shape === 'roundedRect') {
        const linked = nodes.find(
          (n) => n.shape === 'circle' && n.label === current.label,
        )
        return {
          type: 'subprocess',
          text: current.label,
          id: current.id,
          // @ts-ignore
          connections: current.connections,
          linked: linked.id,
        }
      }

      return undefined
    }

    nodes.forEach((node: any) => {
      const processed = processNode(node)
      if (processed) scraped.push(processed)
    })
  }

  // TODO: Scrape tables

  return scraped
}
