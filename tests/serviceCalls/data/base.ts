import {Node} from "figma-api";
import {FigmaDocument} from "../../../src/processors/figma";

export const getBaseNode = (children: Node<any>[]): FigmaDocument => ({
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
