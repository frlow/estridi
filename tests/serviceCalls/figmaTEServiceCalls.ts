import {GatewayKey} from "../main.test";
import {FigmaDocument} from "../../src/processors/figma";
import {baseTable} from "./data/baseTable";
import {getBaseNode} from "./data/base";
import {baseScript} from "./data/baseScript";

export const getTEFigmaDocument = (gateways: Record<GatewayKey, string>): FigmaDocument => {
  if (gateways["1:845: Is node table"] === "yes") {
    const table = structuredClone(baseTable)
    if (gateways["2:1420: Does table have dot first in name"] === "no")
      table.children[0].characters = "No dot in name"
    return getBaseNode([table])
  }
  if (gateways["4:1511: Node type"] === "script") {
    return getBaseNode(baseScript)
  }
  throw "Case not handled"
}
