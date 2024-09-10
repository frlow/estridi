import {Node} from "figma-api";
import {FigmaDocument} from "../../../src/processors/figma";

export const getBaseFigmaNode = (children: Node<any>[]): FigmaDocument => ({
  "id": "0:0",
  "name": "Document",
  "type": "DOCUMENT",
  children: [{
    "id": "0:1",
    "name": "Page 1",
    "type": "CANVAS",
    children: children,
    visible: true,
    sharedPluginData: {},
    pluginData: {},
    "prototypeStartNodeID": null,
  }],
  visible: true,
  pluginData: null,
  sharedPluginData: null
})

export const teNodes = {
  script: ({text, id}: { text?: string, id?: string }) => ({
    "id": id || "1:50",
    "name": "3. Script",
    "type": "INSTANCE",
    "children": [
      {
        "type": "TEXT",
        "characters": "Wrong text"
      },
      {
        "type": "TEXT",
        name: "text",
        "characters": text || "Script"
      },
    ],
  }),
  serviceCall: ({text, id}: { text?: string, id?: string }) => ({
    "id": id || "1:60",
    "name": "4. Service call",
    "children": [
      {
        "type": "TEXT",
        "characters": text || "Service Call",
      },
    ],
  }),
  start: ({id}: { id?: string }) => ({
    "id": id || "1:10",
    "name": "01. Start"
  }),
  gateway: ({id, text}: { id?: string, text?: string }) => ({
    "id": id || "1:5",
    "name": "04. Gateway",
    "children": [
      {
        "name": "text",
        "type": "TEXT",
        "characters": text || "Gateway",
      }
    ],
  }),
  subprocess: ({id, text}: { id?: string, text?: string }) => ({
    "id": id || "1:80",
    "name": "2. Subprocess",
    "children": [
      {
        "name": "sub process",
        "type": "TEXT",
        "characters": text || "Sub Process"
      }
    ]
  }),
  userAction: ({id, text, position}: { id?: string, text?: string, position: number }) => ({
    "id": id || "1:55",
    "name": "1. User action",
    "children": [
      {
        "name": "action",
        "type": "TEXT",
        "characters": text || "action"
      }
    ],
    "absoluteBoundingBox": {
      "x": position,
      "y": 0,
      "width": 100,
      "height": 100
    },
  }),
  signalListen: ({id, text, position}: { id?: string, text?: string, position: number }) => ({
    "id": id || "1:58",
    "name": "05. Signal listen",
    "children": [
      {
        "name": "Cancel chosen",
        "type": "TEXT",
        "characters": text || "Signal Listen",
      }
    ],
    "absoluteBoundingBox": {
      "x": position + 5,
      "y": 50,
      "width": 10,
      "height": 10
    }
  })
}

export const connectorNode = ({id, end, start, text}: { id?: string, start: string, end?: string, text?: string }) => ({
  "id": id || "1:200",
  "type": "CONNECTOR",
  "name": text || "Connector Line",
  "connectorStart": {
    "endpointNodeId": start,
  },
  "connectorEnd": {
    "endpointNodeId": end || "1:500",
  },
})
