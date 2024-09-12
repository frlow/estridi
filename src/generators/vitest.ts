import {GenerationKeys, getKeysString} from "./index";

export const generateVitestTest = (keys: GenerationKeys) => `import {describe, test} from 'vitest'
import {createTester, Handles} from 'estridi'
import {handles, State} from './${keys.name}.handles.js'
import {scraped} from './${keys.name}.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => () => getVariants(id).forEach(v => test(v.name, () => testNode(id, {v})))

describe('${keys.name}', () => {
${keys.scriptKeys.map(key => `  describe('${key}', t('${key.split(": ")[0]}'))`).join("\n")}
})

export type GatewayKey =
${getKeysString(keys.gatewayKeys)}
export type ServiceCallKey =
${getKeysString(keys.gatewayKeys)}
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
    {},
    TableKeys
>
`
