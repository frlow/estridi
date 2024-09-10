import {FigmaDocument} from "../../src/processors/figma";
import {connectorNode, getBaseFigmaNode, teNodes} from "./data/figmaBase";
import {figmaExampleTE} from "./data/figmaExamples";

export const getFigmaDocument = (variant: any): FigmaDocument => {
  if (variant.data?.source?.Variant === "TE") {
    if (!variant.data?.node) return figmaExampleTE as any
    const type = variant.data?.node.Id
    const textExample = "Some text"
    switch (type) {
      case "script":
      case "message":
        return getBaseFigmaNode([teNodes.script({text: textExample}), connectorNode({start: "1:50", end: "NextId"})])
      case "serviceCall":
        return getBaseFigmaNode([teNodes.serviceCall({text: textExample}), connectorNode({start: "1:60", end: "NextId"})])
      case "root":
        return getBaseFigmaNode([teNodes.start({}), connectorNode({start: "1:10", text: "root:test", end: "NextId"})])
      case "start":
        return getBaseFigmaNode([teNodes.start({}), connectorNode({start: "1:10", text: textExample, end: "NextId"})])
      case "gateway":
        return getBaseFigmaNode([
          teNodes.gateway({text: textExample}),
          connectorNode({start: "1:5", text: "yes", end: "YesId", id: "2:1"}),
          connectorNode({start: "1:5", text: "no", end: "NoId", id: "2:2"})
        ])
      case "subprocess":
        return getBaseFigmaNode([
          teNodes.subprocess({text: "Next"}),
          teNodes.start({id: "LinkId"}),
          connectorNode({start: "1:80", id: "3:3", end: "NextId"}),
          connectorNode({start: "LinkId", text: "Next", id: "3:4"})
        ])
      case "userAction":
        return getBaseFigmaNode([
          teNodes.userAction({text: textExample, position: 0}),
          teNodes.signalListen({text: "Click", position: 0, id: "6:6"}),
          connectorNode({start: "1:55", id: "4:4", end: "NextId"}),
          connectorNode({start: "6:6", id: "9:9", end: "ActionId"}),
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
