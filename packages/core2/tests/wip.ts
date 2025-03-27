import { Wip } from './wip.test'
import * as wipRoot from '../src/index'
import { GenerateTestFileConfig, generateTestFiles, RootConfig } from '../src'
import * as figma from '../src/sources/figma/index'
import * as figmaAccessor from '../src/sources/figma/figmaAccessor'
import * as figmaParser from '../src/sources/figma/figmaParser'
import { parseFigma } from '../src/sources/figma/figmaParser'
import * as sources from '../src/sources'
import { convertToFigma } from 'core'
import { getTestCase } from './utils/testCases'
import { expect, vi } from 'vitest'
import { expectedNodes } from './flows/expectedNodes'

export const handles: Wip = {
  nodeFunctionMappings: {
    root_wip: vi.spyOn(wipRoot, 'generateTestFiles'),
    subprocess_loadScraped: vi.spyOn(sources, 'loadScraped'),
    subprocess_processFigma: vi.spyOn(figma, 'processFigma'),
    serviceCall_loadFromFigmaAPI: vi.spyOn(figmaAccessor, 'loadFromFigma'),
    subprocess_parseFigmaToScraped: vi.spyOn(figmaParser, 'parseFigma'),
  },
  async setup(args) {},
  async serviceCall_loadFromFigmaApi(args) {
    args.spy.mockImplementation(
      async () => await convertToFigma(await getTestCase('tc-base')),
    )
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
    const roots: RootConfig[] = [{}]
    await generateTestFiles(config[source], roots)
  },
  async test_root_wip(func) {},
  async test_loadFromFigmaAPI(func) {
    throw 'not implemented'
  },
  async test_subprocess_loadScraped(func) {
    throw 'not implemented'
  },
  async test_subprocess_processFigma(func) {
    throw 'not implemented'
  },
  async test_subprocess_parseFigmaToScraped(func, tr) {
    const testData = await getTestCase(`tc-node-${tr.Id}`)
    const figmaData = await convertToFigma(testData)
    const parsed = await func(figmaData) // <=== Tested function
    const overrides = {
      subprocessTable: 'subprocess',
      subprocessActions: 'userAction',
    }
    const node = parsed.find(
      (n) =>
        (overrides[tr.Id] && n.type === overrides[tr.Id]) ||
        n.type === tr.Id ||
        (n as any).variant === tr.Id,
    )
    expect(expectedNodes[tr.Id]).toBeTruthy()
    expect(node).toEqual(expectedNodes[tr.Id])
  },
}
