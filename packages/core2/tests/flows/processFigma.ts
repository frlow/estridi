import type { CoreProcessFigma } from '../core.test'
import { expect, vi } from 'vitest'
import * as figmaAccessor from '../../src/sources/figma/figmaAccessor'
import * as figmaParser from '../../src/sources/figma/figmaParser'
import { getTestCase } from '../utils/testCases'
import { convertToFigma, Scraped } from 'core'
import { expectedNodes } from './expectedNodes'

export const processFigmaHandles: CoreProcessFigma = {
  async serviceCall_loadFromFigmaApi(args) {
    vi.spyOn(figmaAccessor, 'loadFromFigma').mockImplementation(
      async () => await convertToFigma(await getTestCase('tc-base')),
    )
  },
  async test_loadFromFigmaApi(args, _) {
    const mock = vi.spyOn(figmaAccessor, 'loadFromFigma')
    return async () => {
      expect(mock.mock.calls).toStrictEqual([
        [{ fileId: 'dummyFileId', source: 'figma', token: 'dummyToken' }],
      ])
    }
  },
  async test_parseFigmaToScrapedNodeType(args, _) {
    if (args.tableRow.Id !== 'base')
      vi.spyOn(figmaAccessor, 'loadFromFigma').mockImplementation(
        async () =>
          await convertToFigma(
            await getTestCase(`tc-node-${args.tableRow.Id}`),
          ),
      )
    const mock = vi.spyOn(figmaParser, 'parseFigma')

    return async () => {
      if (args.tableRow.Id === 'base') {
        expect(mock.mock.calls[0][0].children).toBeTruthy()
        expect(mock.mock.settledResults[0].value.length).toBeGreaterThan(0)
      } else {
        const scraped: Scraped = mock.mock.settledResults[0].value
        const overrides = {
          subprocessTable: 'subprocess',
          subprocessActions: 'userAction',
        }
        const node = scraped.find(
          (n) =>
            (overrides[args.tableRow.Id] &&
              n.type === overrides[args.tableRow.Id]) ||
            n.type === args.tableRow.Id ||
            (n as any).variant === args.tableRow.Id,
        )
        expect(expectedNodes[args.tableRow.Id]).toBeTruthy()
        expect(node).toEqual(expectedNodes[args.tableRow.Id])
      }
    }
  },
}
