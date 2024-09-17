import type {Scraped} from '../src/runner.js'
export const scraped: Scraped = [
  {
    "type": "start",
    "id": "58:945",
    "text": "runner",
    "next": "104:2156",
    "isRoot": true
  },
  {
    "type": "serviceCall",
    "id": "104:2156",
    "text": "Load handles",
    "next": "76:1168"
  },
  {
    "type": "serviceCall",
    "id": "76:1168",
    "text": "Load scraped data",
    "next": "76:1110"
  },
  {
    "type": "userAction",
    "id": "76:1110",
    "text": "action",
    "next": "76:1121",
    "actions": {
      "94:2102": "Get variants",
      "76:1211": "Test node"
    }
  },
  {
    "type": "start",
    "id": "76:1121",
    "text": "start"
  },
  {
    "type": "gateway",
    "id": "94:2102",
    "text": "Node has any variants",
    "options": {
      "76:1189": "yes",
      "94:2126": "no"
    }
  },
  {
    "type": "script",
    "id": "76:1189",
    "text": "Return Variants for node"
  },
  {
    "type": "script",
    "id": "94:2126",
    "text": "Return default variant"
  },
  {
    "type": "subprocess",
    "id": "76:1211",
    "text": "Relevant path",
    "link": "76:1229"
  },
  {
    "type": "start",
    "id": "76:1229",
    "text": "Relevant path",
    "next": "109:2256",
    "isRoot": false
  },
  {
    "type": "script",
    "id": "109:2256",
    "text": "List all paths",
    "next": "110:2290"
  },
  {
    "type": "gateway",
    "id": "110:2290",
    "text": "Any paths containing node",
    "options": {
      "76:1241": "yes",
      "110:2303": "no"
    }
  },
  {
    "type": "script",
    "id": "76:1241",
    "text": "Filter all paths containing node",
    "next": "76:1261"
  },
  {
    "type": "gateway",
    "id": "76:1261",
    "text": "Node has variant",
    "options": {
      "76:1304": "yes",
      "108:2202": "no"
    }
  },
  {
    "type": "gateway",
    "id": "76:1304",
    "text": "Variant has via",
    "options": {
      "108:2202": "no",
      "110:2342": "yes"
    }
  },
  {
    "type": "other",
    "id": "108:2202",
    "next": "108:2187"
  },
  {
    "type": "script",
    "id": "108:2187",
    "text": "Don t filter nodes by via",
    "next": "78:2000"
  },
  {
    "type": "other",
    "id": "78:2000",
    "next": "76:1372"
  },
  {
    "type": "gateway",
    "id": "76:1372",
    "text": "Any discouraged nodes",
    "options": {
      "77:1572": "yes",
      "108:2237": "no"
    }
  },
  {
    "type": "gateway",
    "id": "77:1572",
    "text": "Any suggested paths left",
    "options": {
      "77:1609": "yes",
      "77:1635": "no"
    }
  },
  {
    "type": "script",
    "id": "77:1609",
    "text": "Filter encouraged paths",
    "next": "76:1417"
  },
  {
    "type": "other",
    "id": "76:1417",
    "next": "76:1484"
  },
  {
    "type": "script",
    "id": "76:1484",
    "text": "Use shortest path",
    "next": "77:1692"
  },
  {
    "type": "subprocess",
    "id": "77:1692",
    "text": "Process path",
    "next": "77:1675",
    "link": "77:1724"
  },
  {
    "type": "start",
    "id": "77:1675",
    "text": "start"
  },
  {
    "type": "start",
    "id": "77:1724",
    "text": "Process path",
    "next": "87:2067",
    "isRoot": false
  },
  {
    "type": "gateway",
    "id": "87:2067",
    "text": "Variant has custom test",
    "options": {
      "78:1739": "no",
      "87:2080": "yes"
    }
  },
  {
    "type": "script",
    "id": "78:1739",
    "text": "Show args testLib args getTable gateways variant",
    "next": "78:1749"
  },
  {
    "type": "script",
    "id": "78:1749",
    "text": "Call setup args",
    "next": "78:1766"
  },
  {
    "type": "script",
    "id": "78:1766",
    "text": "Call serviceCalls args serviceCallKey state",
    "next": "78:1798"
  },
  {
    "type": "script",
    "id": "78:1798",
    "text": "Call start args state",
    "next": "78:1843"
  },
  {
    "type": "script",
    "id": "78:1843",
    "text": "Call actions before tested node args actionKey state",
    "next": "78:1892"
  },
  {
    "type": "gateway",
    "id": "78:1892",
    "text": "Variant has extra action",
    "options": {
      "78:1923": "yes",
      "78:1915": "no"
    }
  },
  {
    "type": "script",
    "id": "78:1923",
    "text": "Call extraAction args state",
    "next": "78:1915"
  },
  {
    "type": "other",
    "id": "78:1915",
    "next": "78:1865"
  },
  {
    "type": "script",
    "id": "78:1865",
    "text": "Call testNode args testNodeKey state Including scripts messages and unlinked subprocesses",
    "next": "78:1958"
  },
  {
    "type": "start",
    "id": "78:1958",
    "text": "start"
  },
  {
    "type": "script",
    "id": "87:2080",
    "text": "Call custom test"
  },
  {
    "type": "script",
    "id": "77:1635",
    "text": "Include discouraged paths",
    "next": "76:1417"
  },
  {
    "type": "script",
    "id": "108:2237",
    "text": "Don t filter discouraged",
    "next": "76:1417"
  },
  {
    "type": "gateway",
    "id": "110:2342",
    "text": "Any path containing all via nodes",
    "options": {
      "76:1322": "yes",
      "110:2327": "no"
    }
  },
  {
    "type": "script",
    "id": "76:1322",
    "text": "Filter paths containing all via nodes",
    "next": "78:2000"
  },
  {
    "type": "script",
    "id": "110:2327",
    "text": "No paths containing all via nodes"
  },
  {
    "type": "script",
    "id": "110:2303",
    "text": "No paths containing node"
  },
  {
    "type": "table",
    "rows": [
      [
        ".Node types",
        "text",
        "next",
        "options",
        "isRoot",
        "actions",
        "link",
        "Alias"
      ],
      [
        "script",
        "x",
        "x",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "message",
        "x",
        "x",
        "",
        "",
        "",
        "",
        "script"
      ],
      [
        "serviceCall",
        "x",
        "x",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "root",
        "x",
        "x",
        "",
        "x",
        "",
        "",
        ""
      ],
      [
        "start",
        "x",
        "x",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "gateway",
        "x",
        "",
        "x",
        "",
        "",
        "",
        ""
      ],
      [
        "subprocess",
        "x",
        "x",
        "",
        "",
        "",
        "x",
        ""
      ],
      [
        "userAction",
        "x",
        "x",
        "",
        "",
        "x",
        "",
        ""
      ],
      [
        "other",
        "",
        "x",
        "",
        "",
        "",
        "",
        ""
      ]
    ],
    "id": "1:966",
    "text": "Node types"
  },
  {
    "type": "table",
    "rows": [
      [
        ".Source types",
        "Family",
        "Variant"
      ],
      [
        "Figma TE",
        "figma",
        "TE"
      ]
    ],
    "id": "16:1764",
    "text": "Source types"
  },
  {
    "type": "table",
    "rows": [
      [
        ".Generation targets",
        "Test file name"
      ],
      [
        "playwright",
        "spec"
      ],
      [
        "vitest",
        "test"
      ]
    ],
    "id": "51:412",
    "text": "Generation targets"
  }
]