export const expectedDataFile = `export const scraped = [
  {
    "type": "start",
    "id": "1:72",
    "text": "main",
    "next": "1:67",
    "isRoot": true
  },
  {
    "type": "serviceCall",
    "id": "1:67",
    "text": "Get Data From Backend",
    "next": "1:73"
  },
  {
    "type": "gateway",
    "id": "1:73",
    "text": "Any errors from backend",
    "options": {
      "1:74": "yes",
      "1:338": "no"
    }
  },
  {
    "type": "other",
    "id": "1:74"
  },
  {
    "type": "script",
    "id": "1:338",
    "text": "Show Data",
    "next": "1:235"
  },
  {
    "type": "userAction",
    "id": "1:235",
    "text": "action",
    "next": "1:77",
    "actions": {
      "1:76": "Next Clicked",
      "1:326": "Cancel Clicked"
    }
  },
  {
    "type": "start",
    "id": "1:77",
    "text": "start"
  },
  {
    "type": "subprocess",
    "id": "1:76",
    "text": "Next Page",
    "link": "1:358"
  },
  {
    "type": "start",
    "id": "1:358",
    "text": "Next Page",
    "next": "1:365",
    "isRoot": false
  },
  {
    "type": "script",
    "id": "1:365",
    "text": "Show Done"
  },
  {
    "type": "script",
    "id": "1:326",
    "text": "Clear Page"
  },
  {
    "type": "table",
    "rows": [
      [
        ".My Table",
        "First",
        "Second"
      ],
      [
        "Line 1",
        "AAAA",
        "BBBB"
      ],
      [
        "Line 2",
        "CCCC",
        "DDDD"
      ]
    ],
    "id": "9:415",
    "text": "My Table"
  }
]`

export const expectedHandlesFile = (fileType: string) => `import type { MainHandles } from './main.${fileType}.ts'

export type State = {}
export const handles: MainHandles = {
  handleSetup: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleStart: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleServiceCall: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw \`\${args.key} not implemented\`
    }
  },
  handleAction: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw \`\${args.key} not implemented\`
    }
  },
  handleTestNode: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw \`\${args.key} not implemented\`
    }
  }
}
`

export const expectedVitestFile = `import {describe, test} from 'vitest'
import {createTester, Handles} from 'estridi'
import {handles, State} from './main.handles.js'
import {scraped} from './main.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, () => testNode(id, {variant: v})))

describe('main', () => {
  describe('1:338: Show Data', t('1:338'))
  describe('1:365: Show Done', t('1:365'))
  describe('1:326: Clear Page', t('1:326'))
})

export type GatewayKey =
    | '1:73: Any errors from backend'
export type ServiceCallKey =
    | '1:67: Get Data From Backend'
export type ActionKey =
    | '1:235: action - Next Clicked'
    | '1:235: action - Cancel Clicked'
export type TestNodeKey =
    | '1:338: Show Data'
    | '1:365: Show Done'
    | '1:326: Clear Page'
export type TableKeys =
    | '9:415: My Table'

export type MainHandles = Handles<
    State,
    GatewayKey,
    ServiceCallKey,
    TestNodeKey,
    ActionKey,
    {},
    TableKeys
>
`
