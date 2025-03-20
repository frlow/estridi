import type { Core } from './core.test'
import { generateTestFile, GenerateTestFileConfig } from '../src'
import { processFigmaHandles } from './flows/processFigma'

export const handles: Core = {
  ...processFigmaHandles,
  async setup(args) {
    return {}
  },
  async start(args) {
    const target = args.gateways['Source type'] || 'figma'
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
    const result = await generateTestFile(config[target])
  },
}
