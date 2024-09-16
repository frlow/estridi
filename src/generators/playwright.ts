import {GenerationKeys, getKeysString} from "./index";

export const generatePlaywrightTest= (keys: GenerationKeys)=>`import { test, Page, BrowserContext } from '@playwright/test'
import {createTester, Handles} from 'estridi'
import {handles, State} from './${keys.name}.handles.js'
import {scraped} from './${keys.name}.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, ({ context, page }) => testNode(id, {context, page, variant: v})))

test.describe('${keys.name}', () => {
${keys.scriptKeys.map(key => `  test.describe('${key}', t('${key.split(": ")[0]}'))`).join("\n")}
})

export type GatewayKey =
${getKeysString(keys.gatewayKeys)}
export type ServiceCallKey =
${getKeysString(keys.serviceCallKeys)}
export type ActionKey =
${getKeysString(keys.actionKeys)}
export type TestNodeKey =
${getKeysString(keys.scriptKeys)}
export type TableKeys =
${getKeysString(keys.tableKeys)}

export type ${keys.name[0].toUpperCase() + keys.name.slice(1)}Handles = Handles<
    State,
    GatewayKey,
    ServiceCallKey,
    TestNodeKey,
    ActionKey,
    { page: Page; context: BrowserContext },
    TableKeys
>
`

