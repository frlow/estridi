import type { Core } from './core.test'
import { generateTestFile, GenerateTestFileConfig } from '../src'
import {
  getProcessFigmaStates,
  processFigmaHandles,
} from './flows/processFigma'
import { States } from './utils/States'

export const handles: Core<{ states: States }> = {
  ...processFigmaHandles,
  async setup(args) {
    const processFigmaStates = await getProcessFigmaStates()
    return {
      states: {
        ...processFigmaStates,
      },
    }
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
