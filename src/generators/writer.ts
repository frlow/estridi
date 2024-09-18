import { getKeysBlock, getTestableNodes } from './index'
import { Scraped } from '../scraped'

export const generateWriterScript = (
  name: string,
  scraped: Scraped,
  importSource: string,
) => `import {createTester, Handles} from '${importSource}'
import {handles, State} from './${name}.handles.js'
import {scraped} from './${name}.data.js'
const {testNode, getVariants} = createTester(scraped, handles)
async function t(id: string) {
  for (const v of getVariants(id))
    await testNode(id, { variant: v })
}

const run = async () => {
${getTestableNodes(scraped)
  .map((node) => `  await t('${node.id}') // ${node.text}`)
  .join('\n')}

  await handles.handleSetup({ variant: { name: 'end' } } as any)
}

run().then()


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
