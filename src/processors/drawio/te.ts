import {
  LogFunc,
  Scraped,
  ScrapedNode,
  ScrapedNodeTypes,
  ScrapedScript,
  type ScrapedServiceCall,
  ScrapedStart,
} from '../../index.js'

export const drawIoTeStyles = {
  start:
    'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;outline=standard;symbol=general;fillColor=#99CCFF;',
  script:
    'shape=ext;rounded=0;html=1;whiteSpace=wrap;glass=0;fillColor=#99CCFF;gradientColor=none;',
  message:
    'points=[[0.145,0.145,0],[0.5,0,0],[0.855,0.145,0],[1,0.5,0],[0.855,0.855,0],[0.5,1,0],[0.145,0.855,0],[0,0.5,0]];shape=mxgraph.bpmn.event;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;aspect=fixed;outline=end;symbol=message;fillColor=#99CCFF;',
  signalSend:
    'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;outline=end;symbol=signal;rounded=0;glass=0;fillColor=#99CCFF;gradientColor=none;fontColor=none;resizable=0;rotatable=0;strokeColor=#FFFFFF;',
  serviceCall:
    'shape=ext;rounded=0;html=1;whiteSpace=wrap;glass=0;gradientColor=none;fillColor=#7AB648;',
}

const styles: Record<string, ScrapedNodeTypes> = {
  [drawIoTeStyles.start]: 'start',
  [drawIoTeStyles.script]: 'script',
  [drawIoTeStyles.message]: 'script',
  [drawIoTeStyles.signalSend]: 'script',
  [drawIoTeStyles.serviceCall]: 'serviceCall',
}

export const processTeDrawIo = async (
  data: any,
  log: LogFunc,
): Promise<Scraped> => {
  const rawNodes = data.mxfile.diagram.mxGraphModel.root.mxCell
  const getConnections = (
    id: string,
  ): { target: string; text: string | undefined }[] => {
    const getConnectionText = (id: string) => {
      const connectionText = rawNodes.find((n) => n['@_parent'] === id)
      return connectionText ? connectionText['@_value'] : undefined
    }
    const connectionNodes = rawNodes.filter(
      (n: any) => n['@_source'] === id && !n['@_style'].includes('dashed'),
    )
    return connectionNodes.map((c: any) => ({
      target: c['@_target'],
      text: getConnectionText(c['@_id']),
    }))
  }
  const getNext = (id: string) => {
    const connection = getConnections(id)[0]
    return connection?.target
  }
  const getNodeMetadata = (node: any, type: ScrapedNodeTypes): ScrapedNode => {
    switch (type) {
      case 'script': {
        const script: ScrapedScript = {
          type: 'script',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node['@_id']),
        }
        log && log('parsedScript', script)
        return script
      }
      case 'start': {
        const connections = getConnections(node['@_id'])
        const text = connections[0]?.text
        const isRoot = text?.startsWith('root:')
        const start: ScrapedStart = {
          type: 'start',
          id: node['@_id'],
          text: text.replace('root:', ''),
          isRoot,
          next: getNext(node['@_id']),
        }
        log(isRoot ? 'parsedRoot' : 'parsedStart', start)
        return start
      }
      case 'serviceCall': {
        const serviceCall: ScrapedServiceCall = {
          type: 'serviceCall',
          id: node['@_id'],
          text: node['@_value'],
          next: getNext(node['@_id']),
        }
        log('parsedServiceCall', serviceCall)
        return serviceCall
      }
      default:
        if (node['@_id'] !== 'ConnectorId') {
          debugger
        }
        return {
          type: 'other',
          id: node['@_id'],
        }
    }
  }
  const nodes: ScrapedNode[] = rawNodes.map((node) =>
    getNodeMetadata(node, styles[node['@_style']] || 'other'),
  )

  return nodes
}
