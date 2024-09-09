export const baseScript = [{
  "id": "1:338",
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
      "characters": "Show Data"
    },
  ],
},
  {
    "id": "1:200",
    "type": "CONNECTOR",
    "name": "some arrow text",
    "connectorStart": {
      "endpointNodeId": "1:338",
    },
    "connectorEnd": {
      "endpointNodeId": "1:500",
    },
  },
  {
    "id": "1:500",
  }]
