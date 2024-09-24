export const expectedDataFile = `import type {Scraped} from 'estridi'
export const scraped: Scraped = [
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
    "type": "script",
    "id": "1:74",
    "text": "Show server error"
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
    "type": "end",
    "id": "1:77",
    "text": "end"
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
    "next": "40:145",
    "isRoot": false
  },
  {
    "type": "gateway",
    "id": "40:145",
    "text": "Shorter or longer",
    "options": {
      "40:158": "longer",
      "40:184": "shorter"
    }
  },
  {
    "type": "script",
    "id": "40:158",
    "text": "Longer 1",
    "next": "40:171"
  },
  {
    "type": "script",
    "id": "40:171",
    "text": "Longer 2",
    "next": "40:220"
  },
  {
    "type": "other",
    "id": "40:220",
    "next": "47:198",
    "text": ""
  },
  {
    "type": "subprocess",
    "id": "47:198",
    "text": "Unlinked",
    "next": "58:203"
  },
  {
    "type": "gateway",
    "id": "58:203",
    "text": "A or B",
    "options": {
      "58:229": "A",
      "58:255": "B"
    }
  },
  {
    "type": "script",
    "id": "58:229",
    "text": "A 1",
    "next": "58:221"
  },
  {
    "type": "other",
    "id": "58:221",
    "next": "58:212",
    "text": ""
  },
  {
    "type": "gateway",
    "id": "58:212",
    "text": "A or B",
    "options": {
      "58:242": "A",
      "58:256": "B"
    }
  },
  {
    "type": "script",
    "id": "58:242",
    "text": "A 2",
    "next": "58:327"
  },
  {
    "type": "script",
    "id": "58:327",
    "text": "Here to make this path longer",
    "next": "58:291"
  },
  {
    "type": "other",
    "id": "58:291",
    "next": "1:365",
    "text": ""
  },
  {
    "type": "script",
    "id": "1:365",
    "text": "Show Done",
    "next": "40:237"
  },
  {
    "type": "end",
    "id": "40:237",
    "text": "end"
  },
  {
    "type": "script",
    "id": "58:256",
    "text": "B 2",
    "next": "58:291"
  },
  {
    "type": "script",
    "id": "58:255",
    "text": "B 1",
    "next": "58:221"
  },
  {
    "type": "script",
    "id": "40:184",
    "text": "Shorter 1",
    "next": "40:220"
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

export const expectedHandlesFile = (
  fileType: string,
) => `import type { MainHandles } from './main.${fileType}.ts'

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

const keyBlock = `export type GatewayKey =
    | '1:73: Any errors from backend'
    | '40:145: Shorter or longer'
    | '58:203: A or B'
    | '58:212: A or B'
export type ServiceCallKey =
    | '1:67: Get Data From Backend'
export type ActionKey =
    | '1:235: action - Next Clicked'
    | '1:235: action - Cancel Clicked'
export type TestNodeKey =
    | '1:74: Show server error'
    | '1:338: Show Data'
    | '40:158: Longer 1'
    | '40:171: Longer 2'
    | '47:198: Unlinked'
    | '58:229: A 1'
    | '58:242: A 2'
    | '58:327: Here to make this path longer'
    | '1:365: Show Done'
    | '58:256: B 2'
    | '58:255: B 1'
    | '40:184: Shorter 1'
    | '1:326: Clear Page'
export type TableKeys =
    | '9:415: My Table'`

export const expectedVitestFile = `import {describe, test} from 'vitest'
import {createTester, Handles} from 'estridi'
import {handles, State} from './main.handles.js'
import {scraped} from './main.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, () => testNode(id, {variant: v})))

describe('main', () => {
  describe('Show server error', t('1:74'))
  describe('Show Data', t('1:338'))
  describe('Longer 1', t('40:158'))
  describe('Longer 2', t('40:171'))
  describe('Unlinked', t('47:198'))
  describe('A 1', t('58:229'))
  describe('A 2', t('58:242'))
  describe('Here to make this path longer', t('58:327'))
  describe('Show Done', t('1:365'))
  describe('B 2', t('58:256'))
  describe('B 1', t('58:255'))
  describe('Shorter 1', t('40:184'))
  describe('Clear Page', t('1:326'))
})

${keyBlock}

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
export const expectedPlaywrightFile = `import { test, Page, BrowserContext } from '@playwright/test'
import {createTester, Handles} from 'estridi'
import {handles, State} from './main.handles.js'
import {scraped} from './main.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, ({ context, page }) => testNode(id, {context, page, variant: v})))

test.describe('main', () => {
  test.describe('Show server error', t('1:74'))
  test.describe('Show Data', t('1:338'))
  test.describe('Longer 1', t('40:158'))
  test.describe('Longer 2', t('40:171'))
  test.describe('Unlinked', t('47:198'))
  test.describe('A 1', t('58:229'))
  test.describe('A 2', t('58:242'))
  test.describe('Here to make this path longer', t('58:327'))
  test.describe('Show Done', t('1:365'))
  test.describe('B 2', t('58:256'))
  test.describe('B 1', t('58:255'))
  test.describe('Shorter 1', t('40:184'))
  test.describe('Clear Page', t('1:326'))
})

${keyBlock}

export type MainHandles = Handles<
    State,
    GatewayKey,
    ServiceCallKey,
    TestNodeKey,
    ActionKey,
    { page: Page; context: BrowserContext },
    TableKeys
>
`

export const expectedWriterFile = `import {createTester, Handles} from 'estridi'
import {handles, State} from './main.handles.js'
import {scraped} from './main.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
async function t(id: string) {
  for (const v of getVariants(id))
    await testNode(id, { variant: v })
}

const run = async () => {
  await t('1:74') // Show server error
  await t('1:338') // Show Data
  await t('40:158') // Longer 1
  await t('40:171') // Longer 2
  await t('47:198') // Unlinked
  await t('58:229') // A 1
  await t('58:242') // A 2
  await t('58:327') // Here to make this path longer
  await t('1:365') // Show Done
  await t('58:256') // B 2
  await t('58:255') // B 1
  await t('40:184') // Shorter 1
  await t('1:326') // Clear Page

  await handles.handleSetup({ variant: { name: 'end' } } as any)
}

run().then()


${keyBlock}

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
