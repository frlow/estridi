import {getKeysBlock, getTestableNodes} from "./index";
import {Scraped} from "../scraped";

export const generateWriterScript = (name: string, scraped: Scraped, importSource: string) => `import {createTester, Handles} from '${importSource}'
import {handles, State} from './${name}.handles.js'
import {scraped} from './${name}.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
const t = (id: string) => getVariants(id).forEach(v => testNode(id, {variant: v}))

${getTestableNodes(scraped).map(node => `// ${node.text}\nt('${node.id}')`).join("\n\n")}

handles.handleSetup({variant:{name: "end"}})

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
