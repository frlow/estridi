import { CorePrepareTestableNodes } from '../core.test'
import { expect, vi } from 'vitest'
import * as figmaAccessor from '../../src/sources/figma/figmaAccessor'
import * as roots from '../../src/prepare/roots'
import * as filterNodes from '../../src/prepare/filterNodes'
import { convertToFigma } from 'core'
import { getTestCase } from '../utils/testCases'

export const preapreTestableNodesHandles: CorePrepareTestableNodes = {
  async test_noRootsFound(_, __) {
    vi.spyOn(figmaAccessor, 'loadFromFigma').mockImplementation(async () => [])
    const mock = vi.spyOn(roots, 'getRoots')
    return async () => {
      expect(mock.mock.settledResults).toEqual([
        {
          type: 'fulfilled',
          value: {
            error: 'No roots found',
          },
        },
      ])
    }
  },
  async test_selectAllRoots(_, __) {
    const mock = vi.spyOn(roots, 'getRoots')
    vi.spyOn(figmaAccessor, 'loadFromFigma').mockImplementation(
      async () => await convertToFigma(await getTestCase()),
    )
    return async () => {
      // Hard to check exactly, but check that it's more than one at least.
      expect(mock.mock.settledResults[0].value.value.length).toBeGreaterThan(15)
    }
  },

  async test_rootNotFound(_, __) {
    const mock = vi.spyOn(roots, 'getRoots')
    return async () => {
      expect(mock.mock.settledResults).toEqual([
        {
          type: 'fulfilled',
          value: {
            error: 'Root not found',
          },
        },
      ])
    }
  },

  async test_selectListedNodes(_, __) {
    const mock = vi.spyOn(roots, 'getRoots')
    vi.spyOn(figmaAccessor, 'loadFromFigma').mockImplementation(
      async () => await convertToFigma(await getTestCase()),
    )
    return async () => {
      expect(mock.mock.settledResults).toEqual([
        {
          type: 'fulfilled',
          value: {
            value: [
              {
                name: 'tc-base',
              },
              {
                name: 'tc-node-message',
              },
            ],
          },
        },
      ])
    }
  },

  async test_multipleRootsFound(_, __) {
    const mock = vi.spyOn(roots, 'getRoots')
    vi.spyOn(figmaAccessor, 'loadFromFigma').mockImplementation(
      async () => await convertToFigma(await getTestCase()),
    )
    return async () => {
      expect(mock.mock.settledResults).toEqual([
        {
          type: 'fulfilled',
          value: {
            error: 'Multiple roots found',
          },
        },
      ])
    }
  },

  async test_selectSingleRoot(_, __) {
    const mock = vi.spyOn(roots, 'getRoots')
    return async () => {
      expect(mock.mock.settledResults).toEqual([
        {
          type: 'fulfilled',
          value: {
            value: [
              {
                name: 'tc-base',
              },
            ],
          },
        },
      ])
    }
  },

  async test_filterNodesConnectedToRoot(_, __) {
    const mock = vi.spyOn(filterNodes, 'filterNodes')
    return async () => {
      const testCase = await getTestCase('tc-base')
      testCase.forEach((n) => {
        delete n.extra
      })
      expect(mock.mock.settledResults).toEqual([
        {
          type: 'fulfilled',
          value: testCase,
        },
      ])
    }
  },
}
