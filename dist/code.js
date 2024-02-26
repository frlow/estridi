"use strict";
(() => {
  // src/nodes.ts
  var getNodeMetadata = (node) => getScriptMetadata(node) || getServiceCallMetadata(node) || getSubProcessMetadata(node) || getUserActionMetadata(node) || getSignalSendExternalMetadata(node) || getGatewayMetadata(node) || getMessageMetadata(node) || getSignalListenMetadata(node) || getStartMetadata(node) || getInputMetadata(node) || getOutputMetadata(node) || getConnectorMetadata(node) || getParallelGatewayMetadata(node) || getTimerMetadata(node) || getNoteMetadata(node);
  var findText = (node) => {
    var _a;
    return (((_a = node.children.find((c) => c.type === "TEXT")) == null ? void 0 : _a.characters) || "").replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\n/g, " ").replace(/ +/g, " ").trim();
  };
  var getScriptMetadata = (node) => {
    if (node.name !== "Script")
      return void 0;
    return {
      type: "script",
      text: findText(node)
    };
  };
  var getServiceCallMetadata = (node) => {
    if (node.name !== "Service call")
      return void 0;
    return {
      type: "serviceCall",
      text: findText(node)
    };
  };
  var getSubProcessMetadata = (node) => {
    if (node.name !== "Subprocess")
      return void 0;
    return {
      type: "subprocess",
      text: findText(node)
    };
  };
  var getUserActionMetadata = (node) => {
    if (node.name !== "User action")
      return void 0;
    return {
      type: "userAction",
      text: findText(node)
    };
  };
  var getSignalSendExternalMetadata = (node) => {
    if (node.name !== "Signal send external")
      return void 0;
    return {
      type: "signalSendExternal",
      text: findText(node)
    };
  };
  var getGatewayMetadata = (node) => {
    if (node.name !== "Gateway")
      return void 0;
    return {
      type: node.children.length === 3 ? "gatewayLoop" : "gateway",
      text: findText(node)
    };
  };
  var getMessageMetadata = (node) => {
    if (node.name !== "Message")
      return void 0;
    return {
      type: "message",
      text: findText(node)
    };
  };
  var getSignalListenMetadata = (node) => {
    if (node.name !== "Signal listen")
      return void 0;
    return {
      type: "signalListen",
      text: findText(node)
    };
  };
  var getStartMetadata = (node) => {
    if (node.name !== "Start")
      return void 0;
    return {
      type: "start",
      text: findText(node)
    };
  };
  var getInputMetadata = (node) => {
    if (node.name !== "Input")
      return void 0;
    return {
      type: "input",
      text: findText(node)
    };
  };
  var getOutputMetadata = (node) => {
    if (node.name !== "Output")
      return void 0;
    return {
      type: "output",
      text: findText(node)
    };
  };
  var getConnectorMetadata = (node) => {
    if (node.name !== "Connector")
      return void 0;
    return {
      type: "connector",
      text: findText(node)
    };
  };
  var getParallelGatewayMetadata = (node) => {
    if (node.name !== "Paralell gateway")
      return void 0;
    return {
      type: "parallelGateway",
      text: findText(node)
    };
  };
  var getTimerMetadata = (node) => {
    if (node.name !== "Timer")
      return void 0;
    return {
      type: "timer",
      text: findText(node)
    };
  };
  var getNoteMetadata = (node) => {
    if (node.name !== "Note")
      return void 0;
    return {
      type: "note",
      text: findText(node)
    };
  };

  // src/feature.ts
  var handleNode = (node) => {
    var _a, _b;
    const toHandle = [
      { node, acc: [] }
    ];
    const ret = [];
    while (toHandle.length > 0) {
      for (const current of [...toHandle]) {
        toHandle.splice(toHandle.indexOf(current), 1);
        toHandle.push(
          ...((_a = current.node.next) == null ? void 0 : _a.map((n) => ({
            node: n,
            acc: [...current.acc, current.node]
          }))) || []
        );
        if ((((_b = current.node.next) == null ? void 0 : _b.length) || 0) === 0) {
          ret.push([...current.acc, current.node]);
        }
      }
    }
    return ret;
  };
  var createScenarios = (nodes) => {
    var _a, _b, _c, _d;
    const thenTypes = ["script", "message", "serviceCall", "subprocess"];
    const given = [];
    const when = [];
    const then = [];
    for (const node of nodes.filter((n) => !!n.meta)) {
      if (thenTypes.includes(node.meta.type))
        then.push({ type: node.meta.type, text: (_a = node.meta) == null ? void 0 : _a.text });
      else if (node.meta.type === "connector" && node.meta.text)
        given.push({
          type: node.meta.type,
          text: (_b = node.meta) == null ? void 0 : _b.text,
          value: (_c = node.meta) == null ? void 0 : _c.value
        });
      else if (node.meta.type === "signalListen")
        when.push({ type: node.meta.type, text: (_d = node.meta) == null ? void 0 : _d.text });
    }
    return {
      given,
      when,
      then
    };
  };
  var createFeature = (name, nodes) => ({
    name,
    scenarios: nodes.map((n) => createScenarios(n))
  });

  // src/index.ts
  figma.showUI(__html__);
  var isStartNode = (node) => {
    var _a, _b;
    return node.name === "Start" && ((_b = (_a = node.children[0].strokeWeight) == null ? void 0 : _a.toString()) == null ? void 0 : _b.startsWith("2"));
  };
  var isSection = (node) => node.type === "SECTION";
  var isAction = (node) => node.name === "Signal listen";
  figma.ui.onmessage = (msg) => {
    if (msg.type === "traverse") {
      const result = [];
      const sections = figma.currentPage.children.filter((c) => isSection(c));
      for (const section of sections) {
        const start = section.children.find((c) => isStartNode(c));
        if (!start)
          continue;
        const parsedStartNode = traverse(start);
        const handledNodes = handleNode(parsedStartNode);
        const actions = section.children.filter((c) => isAction(c));
        const handledActions = actions.map((a) => handleNode(traverse(a)));
        handledActions.forEach((h) => handledNodes.push(...h));
        const feature = createFeature(section.name, handledNodes);
        result.push(feature);
      }
      const body = JSON.stringify(result);
      fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body
      }).catch(() => console.log("local server not started"));
    }
    if (msg.type === "identify") {
      const nodes = figma.currentPage.selection;
      for (const node of nodes) {
        console.log(getNodeMetadata(node));
      }
    }
  };
  var traverse = (node, visited = []) => {
    if (visited.includes(node.id))
      return { id: node.id };
    const connectors = node == null ? void 0 : node.attachedConnectors.filter(
      (c) => {
        var _a, _b;
        return ((_a = c == null ? void 0 : c.dashPattern) == null ? void 0 : _a.length) === 0 && ((_b = c == null ? void 0 : c.connectorStart) == null ? void 0 : _b.endpointNodeId) === node.id;
      }
    );
    const meta = getNodeMetadata(node);
    const nextNodes = (meta == null ? void 0 : meta.type) === "gateway" ? connectors == null ? void 0 : connectors.map((c) => {
      var _a;
      return {
        id: c.id,
        meta: {
          type: "connector",
          text: meta.text.replace(/[^a-zA-Z0-9]/, ""),
          value: c.name || "unknown"
        },
        next: [
          traverse(figma.getNodeById((_a = c == null ? void 0 : c.connectorEnd) == null ? void 0 : _a.endpointNodeId), [
            ...visited,
            node.id
          ])
        ]
      };
    }) : connectors == null ? void 0 : connectors.map((c) => {
      var _a;
      const nextNode = figma.getNodeById((_a = c == null ? void 0 : c.connectorEnd) == null ? void 0 : _a.endpointNodeId);
      return traverse(nextNode, [...visited, node.id]);
    });
    return {
      id: node.id,
      meta: getNodeMetadata(node),
      next: nextNodes
    };
  };
})();
