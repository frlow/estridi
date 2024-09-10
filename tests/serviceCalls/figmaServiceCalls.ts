import {FigmaDocument} from "../../src/processors/figma";
import {connectorNode, getBaseFigmaNode, table, teNodes} from "./data/figmaBase";
import {figmaExampleTE} from "./data/figmaExamples";

export const getFigmaDocument = (variant: any): FigmaDocument => {
  if (variant.data?.source?.Variant === "TE") {
    if(variant.data.tables){
      return getBaseFigmaNode([table({children: [
          [".My Table", "Column1", "Column2"],
          ["Line1", "AAAA", "BBBB"],
          ["Line2", "CCCC", "DDDD"],
        ]})])
    }
    if (!variant.data?.node) return figmaExampleTE as any
    const type = variant.data?.node.Id
    const textExample = "Some text"
    switch (type) {
      case "script":
      case "message":
        return getBaseFigmaNode([teNodes.script({text: textExample}), connectorNode({start: "ScriptId"})])
      case "serviceCall":
        return getBaseFigmaNode([teNodes.serviceCall({text: textExample}), connectorNode({start: "ServiceCallId"})])
      case "root":
        return getBaseFigmaNode([teNodes.start({}), connectorNode({start: "StartId", text: "root:test"})])
      case "start":
        return getBaseFigmaNode([teNodes.start({}), connectorNode({start: "StartId", text: textExample})])
      case "gateway":
        return getBaseFigmaNode([
          teNodes.gateway({text: textExample}),
          connectorNode({start: "GatewayId", text: "yes", end: "YesId", id: "ConnectorId1"}),
          connectorNode({start: "GatewayId", text: "no", end: "NoId", id: "ConnectorId2"})
        ])
      case "subprocess":
        return getBaseFigmaNode([
          teNodes.subprocess({text: "Next"}),
          teNodes.start({id: "LinkId"}),
          connectorNode({start: "SubprocessId", id: "ConnectorId1", end: "NextId"}),
          connectorNode({start: "LinkId", text: "Next", id: "ConnectorId2"})
        ])
      case "userAction":
        return getBaseFigmaNode([
          teNodes.userAction({text: textExample, position: 0}),
          teNodes.signalListen({text: "Click", position: 0,}),
          connectorNode({start: "UserActionId", id: "ConnectorId1"}),
          connectorNode({start: "SignalListenId", id: "ConnectorId2", end: "ActionId"}),
        ])
      case "other":
        return getBaseFigmaNode([{id:"AnyId"}, connectorNode({start:"AnyId", end:"NextId"})])
      default:
        debugger
    }
  }
  debugger
  throw "Case not handled"
}
