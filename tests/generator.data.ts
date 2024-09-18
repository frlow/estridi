import type {Scraped} from '../src/runner.js'
export const scraped: Scraped = [
  {
    "type": "start",
    "id": "1:373",
    "text": "generator",
    "next": "58:1051",
    "isRoot": true
  },
  {
    "type": "serviceCall",
    "id": "58:1051",
    "text": "Cli parameters",
    "next": "1:380"
  },
  {
    "type": "serviceCall",
    "id": "1:380",
    "text": "Config file",
    "next": "22:2092"
  },
  {
    "type": "gateway",
    "id": "22:2092",
    "text": "Errors loading config",
    "options": {
      "22:2100": "yes",
      "22:2121": "no"
    }
  },
  {
    "type": "script",
    "id": "22:2100",
    "text": "Could not load config"
  },
  {
    "type": "script",
    "id": "22:2121",
    "text": "Show loaded config",
    "next": "22:2042"
  },
  {
    "type": "serviceCall",
    "id": "22:2042",
    "text": "Load Data",
    "next": "22:2142"
  },
  {
    "type": "gateway",
    "id": "22:2142",
    "text": "Errors loading data",
    "options": {
      "22:2150": "yes",
      "22:2167": "Connector line"
    }
  },
  {
    "type": "script",
    "id": "22:2150",
    "text": "Could not load data"
  },
  {
    "type": "script",
    "id": "22:2167",
    "text": "Show loaded data",
    "next": "22:2180"
  },
  {
    "type": "subprocess",
    "id": "22:2180",
    "text": "Parse Nodes",
    "next": "22:2197"
  },
  {
    "type": "subprocess",
    "id": "22:2197",
    "text": "Parse Tables",
    "next": "39:2363"
  },
  {
    "type": "script",
    "id": "39:2363",
    "text": "Show parsed nodes and tables",
    "next": "57:378"
  },
  {
    "type": "subprocess",
    "id": "57:378",
    "text": "Validate params",
    "next": "22:2261",
    "link": "57:410"
  },
  {
    "type": "end",
    "id": "22:2261",
    "text": "end"
  },
  {
    "type": "start",
    "id": "57:410",
    "text": "Validate params",
    "next": "57:430",
    "isRoot": false
  },
  {
    "type": "gateway",
    "id": "57:430",
    "text": "Root node specified",
    "options": {
      "57:452": "yes",
      "57:489": "no"
    }
  },
  {
    "type": "gateway",
    "id": "57:452",
    "text": "Does root exist",
    "options": {
      "57:466": "no",
      "57:567": "yes"
    }
  },
  {
    "type": "script",
    "id": "57:466",
    "text": "Root node not found"
  },
  {
    "type": "script",
    "id": "57:567",
    "text": "Show using defined root",
    "next": "57:527"
  },
  {
    "type": "other",
    "id": "57:527",
    "next": "58:675",
    "text": ""
  },
  {
    "type": "gateway",
    "id": "58:675",
    "text": "Target set",
    "options": {
      "58:707": "no",
      "58:1014": "yes"
    }
  },
  {
    "type": "script",
    "id": "58:707",
    "text": "Default target playwright",
    "next": "58:744"
  },
  {
    "type": "other",
    "id": "58:744",
    "next": "57:623",
    "text": ""
  },
  {
    "type": "subprocess",
    "id": "57:623",
    "text": "Generate Tests",
    "next": "78:1983",
    "link": "47:2388"
  },
  {
    "type": "end",
    "id": "78:1983",
    "text": "end"
  },
  {
    "type": "start",
    "id": "47:2388",
    "text": "Generate Tests",
    "next": "58:877",
    "isRoot": false
  },
  {
    "type": "script",
    "id": "58:877",
    "text": "Show filtered nodes connected to root",
    "next": "50:315"
  },
  {
    "type": "script",
    "id": "50:315",
    "text": "Write data file",
    "next": "53:434"
  },
  {
    "type": "script",
    "id": "53:434",
    "text": "Write Test file for selected target",
    "next": "53:456"
  },
  {
    "type": "gateway",
    "id": "53:456",
    "text": "Does handles file exist",
    "options": {
      "53:478": "yes",
      "53:465": "no"
    }
  },
  {
    "type": "script",
    "id": "53:478",
    "text": "Leave handles file unchanged",
    "next": "53:503"
  },
  {
    "type": "other",
    "id": "53:503",
    "next": "58:916",
    "text": ""
  },
  {
    "type": "script",
    "id": "58:916",
    "text": "Done Tests written",
    "next": "53:524"
  },
  {
    "type": "end",
    "id": "53:524",
    "text": "end"
  },
  {
    "type": "script",
    "id": "53:465",
    "text": "Write Handles file",
    "next": "53:503"
  },
  {
    "type": "gateway",
    "id": "58:1014",
    "text": "Is target valid",
    "options": {
      "58:734": "yes",
      "58:1027": "no"
    }
  },
  {
    "type": "script",
    "id": "58:734",
    "text": "Show target",
    "next": "58:744"
  },
  {
    "type": "script",
    "id": "58:1027",
    "text": "Target not valid"
  },
  {
    "type": "gateway",
    "id": "57:489",
    "text": "Is there exactly one root",
    "options": {
      "57:503": "no",
      "57:599": "yes"
    }
  },
  {
    "type": "script",
    "id": "57:503",
    "text": "Document must contain exactly one root"
  },
  {
    "type": "script",
    "id": "57:599",
    "text": "Show using default root",
    "next": "57:527"
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
        "x",
        "x",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "end",
        "x",
        "",
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
      ],
      [
        "writer",
        "writer"
      ]
    ],
    "id": "51:412",
    "text": "Generation targets"
  }
]