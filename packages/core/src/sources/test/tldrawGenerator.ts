import { getDocument, GetDocumentFunc } from './documentGenerator'

function getBaseTldrawNode() {

}

let tldrawNodes

function tldrawTable() {
  return []
}

function tldrawConnectorNode() {
  return []
}

export const getTldrawDocument: GetDocumentFunc = (type, options) =>
  getDocument({
    type,
    baseNodeFunc: getBaseTldrawNode,
    nodeGenerator: tldrawNodes,
    tableGenerator: tldrawTable,
    connectorGenerator: tldrawConnectorNode,
    options
  })
