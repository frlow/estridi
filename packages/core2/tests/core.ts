import type { Core } from './core.test'
import { GenerateTestFileConfig, generateTestFiles, RootConfig } from '../src'
import { processFigmaHandles } from './flows/processFigma'
import { preapreTestableNodesHandles } from './flows/preapreTestableNodes'

export const handles: Core = {
  ...processFigmaHandles,
  ...preapreTestableNodesHandles,
  async setup(args) {
    return {}
  },
  async start(args) {
    const source = args.gateways['Source type'] || 'figma'
    const config: Record<string, GenerateTestFileConfig> = {
      figma: {
        source: 'figma',
        fileId: 'dummyFileId',
        token: 'dummyToken',
      },
      tldraw: {
        source: 'tldraw',
        file: 'dummyFilePath',
      },
    }
    const roots: RootConfig[] =
      args.gateways['Selected Roots'] === 'all'
        ? [{ name: '+' }]
        : args.gateways['Selected Roots'] === 'list'
          ? [
              { name: 'tc-base' },
              {
                name:
                  args.gateways['Any selected root not in document'] === 'yes'
                    ? 'dummy'
                    : 'tc-node-message',
              },
            ]
          : [{}]
    const result = await generateTestFiles(config[source], roots)
  },
}
