import { LogFunc, Scraped, ScrapedNode, ScrapedNodeTypes } from '../../index.js'

const styles: Record<string, ScrapedNodeTypes> = {
  'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;outline=standard;symbol=general;fillColor=#99CCFF;':
    'start',
  'shape=ext;rounded=0;html=1;whiteSpace=wrap;glass=0;fillColor=#99CCFF;gradientColor=none;':
    'script',
}

export const processTeDrawIo = async (
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  const getNodeMetadata = (node: any, type: ScrapedNodeTypes): ScrapedNode => {
    switch (type) {
      case 'script':
        return {
          type: 'script',
          id: node['@_id'],
          text: node['@_value'],
        }
      default:
        return {
          type: 'other',
          id: node['@_id'],
        }
    }
  }
  const nodes: ScrapedNode[] = data.mxfile.diagram.mxGraphModel.root.mxCell.map(
    (node) => getNodeMetadata(node, styles[node['@_style']] || 'other'),
  )
  debugger
  throw 'sdoifhsudhf'
}
