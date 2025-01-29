function getXCoordinate(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  // Ensure the hash is positive and pad to 12 digits
  return hash * 20
}

const createConnector = ({ text, start, end, dotted }: {
  text?: string,
  start: string,
  end?: string,
  dotted?: boolean
}) => {
  return {
    id: `Connector_${Math.random().toString()}`,
    type: 'CONNECTOR',
    name: text || 'Connector Line',
    connectorStart: {
      endpointNodeId: start
    },
    connectorEnd: {
      endpointNodeId: end
    },
    strokeDashes: dotted ? [] : undefined
  }
}

export const convertToFigma = async (scraped: Scraped) => {
  const children: any[] = []
  scraped.forEach(node => {
    switch (node.type) {
      case 'script':
        let typeName: string
        switch (node.variant) {
          case 'script':
            typeName = '3. Script'
            break
          case 'message':
            typeName = '02. Message'
            break
          case 'signalSend':
            typeName = '06. Signal send'
            break
        }
        children.push(
          {
            id: node.id,
            name: typeName,
            type: 'INSTANCE',
            children: [
              {
                type: 'TEXT',
                characters: 'Wrong text'
              },
              {
                type: 'TEXT',
                name: 'text',
                characters: node.raw
              }
            ]
          }
        )
        if (node.next) children.push(createConnector({ start: node.id, end: node.next }))
        break
      case 'gateway':
        debugger
        break
      case 'table':
        debugger
        break
      case 'serviceCall':
        children.push({
          id: node.id,
          name: '4. Service call',
          children: [
            {
              type: 'TEXT',
              characters: node.raw
            }
          ]
        })
        if (node.next) children.push(createConnector({ start: node.id, end: node.next }))
        break
      case 'start':
        children.push({
          id: node.id,
          name: '01. Start'
        })
        children.push(createConnector({ start: node.id, end: node.next, text: node.raw }))
        break
      case 'root':
        debugger
        break
      case 'end':
        debugger
        break
      case 'subprocess':
        children.push({
          id: node.id,
          name: '2. Subprocess',
          children: [
            {
              name: 'sub process',
              type: 'TEXT',
              characters: node.raw
            }
          ],
          absoluteBoundingBox: {
            x: getXCoordinate(node.id),
            y: 0,
            width: 100,
            height: 20
          }
        })
        if (node.next) children.push(createConnector({ start: node.id, end: node.next }))
        if (node.link) {
          children.push({
            id: node.link,
            name: '01. Start'
          })
          children.push(createConnector({ start: node.link, text: node.raw }))
        }
        break
      case 'userAction':
        children.push({
          id: node.id,
          name: '1. User action',
          children: [
            {
              name: 'action',
              type: 'TEXT',
              characters: node.raw
            }
          ],
          absoluteBoundingBox: {
            x: getXCoordinate(node.id),
            y: 0,
            width: 100,
            height: 20
          }
        })
        Object.entries(node.actions).forEach(([key, value], i) => {
          children.push({
            id: `${node.id}_action_${i}`,
            name: '05. Signal listen',
            children: [
              {
                name: 'Cancel chosen',
                type: 'TEXT',
                characters: value
              }
            ],
            absoluteBoundingBox: {
              x: getXCoordinate(node.id) + 5,
              y: 5,
              width: 10,
              height: 10
            }
          })
          children.push(createConnector({ start: `${node.id}_action_${i}`, end: key }))
        })
        if (node.next) children.push(createConnector({ start: node.id, end: node.next }))
        break
      case 'other':
        debugger
        break
    }
  })
  return { id: 'document', children: [{ id: 'page', children }] }
}
