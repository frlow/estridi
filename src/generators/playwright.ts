import {getKeysBlock, getTestableNodes} from "./index";
import {Scraped} from "../scraped";

export const generatePlaywrightTest = (name: string, scraped: Scraped) => `import { test, Page, BrowserContext } from '@playwright/test'
import {createTester, Handles} from 'estridi'
import {handles, State} from './${name}.handles.js'
import {scraped} from './${name}.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, ({ context, page }) => testNode(id, {context, page, variant: v})))

test.describe('${name}', () => {
${getTestableNodes(scraped).map(node => `  test.describe('${node.text}', t('${node.id}'))`).join("\n")}
})

${getKeysBlock(scraped)}

export type ${name[0].toUpperCase() + name.slice(1)}Handles = Handles<
    State,
    GatewayKey,
    ServiceCallKey,
    TestNodeKey,
    ActionKey,
    { page: Page; context: BrowserContext },
    TableKeys
>
`

