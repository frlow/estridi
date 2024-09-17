import {getKeysBlock, getTestableNodes} from "./index";
import {Scraped} from "../scraped";

export const generateVitestTest = (name: string, scraped: Scraped) => `import {describe, test} from 'vitest'
import {createTester, Handles} from 'estridi'
import {handles, State} from './${name}.handles.js'
import {scraped} from './${name}.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, () => testNode(id, {variant: v})))

describe('${name}', () => {
${getTestableNodes(scraped).map(node => `  describe('${node.text}', t('${node.id}'))`).join("\n")}
})

${getKeysBlock(scraped)}

export type ${name[0].toUpperCase() + name.slice(1)}Handles = Handles<
    State,
    GatewayKey,
    ServiceCallKey,
    TestNodeKey,
    ActionKey,
    {},
    TableKeys
>
`
