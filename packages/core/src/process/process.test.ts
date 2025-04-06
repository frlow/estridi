import { describe, expect, test } from 'vitest'
import { getTestCase } from '../test/editorTestCases'
import { getTestableNodeTree, NodeTree } from './testableNodeTree'
import { injectSpecialCases } from './special'

const runTest = async (
  rootName: string,
  expectedChildren: NodeTree['children'],
) => {
  const root = `tc-tree-${rootName}`
  const testCase = await getTestCase(root)
  const injected = injectSpecialCases(testCase)
  const tree = getTestableNodeTree(injected, root)
  const expected = {
    name: root,
    allGateways: expect.anything(),
    allServiceCalls: expect.anything(),
    subprocesses: expect.anything(),
    children: expectedChildren,
  }
  expect(tree).toEqual(expected)
}

describe('process node tree', () => {
  test('message', async () =>
    await runTest('message', [
      {
        name: 'Target',
        actions: [],
        gateways: {},
      },
    ]))

  test('message2', async () =>
    await runTest('message2', [
      {
        name: 'Target',
        actions: [],
        gateways: {},
      },
      {
        name: 'Other',
        actions: [],
        gateways: {},
      },
    ]))

  test('gateway', async () => async () =>
    await runTest('gateway', [
      {
        name: 'Target',
        actions: [],
        gateways: { Gateway: 'AAA' },
      },
    ]))

  test('action', async () =>
    await runTest('action', [
      {
        name: 'Target',
        actions: ['Click'],
        gateways: {},
      },
    ]))

  test('subflow', async () =>
    await runTest('subflow', [
      {
        name: 'tc-tree-subflow-sub',
        children: [
          {
            actions: [],
            gateways: {},
            name: 'Target',
          },
        ],
      },
    ]))

  test('subflow2', async () =>
    await runTest('subflow2', [
      {
        name: 'tc-tree-subflow2-sub',
        children: [
          {
            actions: [],
            gateways: {},
            name: 'Target',
          },
          {
            actions: [],
            gateways: {},
            name: 'Other',
          },
        ],
      },
    ]))

  test('subflow3', async () =>
    await runTest('subflow3', [
      {
        children: [
          {
            children: [
              {
                actions: [],
                gateways: {},
                name: 'Target',
              },
            ],
            name: 'tc-tree-subflow3-sub2',
          },
        ],
        name: 'tc-tree-subflow3-sub',
      },
    ]))

  test('linked', async () =>
    await runTest('linked', [
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'Other',
      },
      {
        actions: [],
        gateways: {
          Gateway: '',
        },
        name: 'Other3',
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'Other2',
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'YesTarget',
      },
      {
        actions: [],
        gateways: {
          Gateway: 'no',
        },
        name: 'NoTarget',
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'After',
      },
    ]))

  test('linked2', async () =>
    await runTest('linked2', [
      {
        actions: [],
        gateways: {
          Gateway: 'no',
        },
        name: 'NoBase',
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'YesBase',
      },
      {
        children: [
          {
            actions: [],
            gateways: {
              Gateway: 'yes',
            },
            name: 'YesSub',
          },
        ],
        name: 'tc-tree-linked2-sub',
      },
      {
        children: [
          {
            actions: ['Click'],
            gateways: {
              Gateway: 'no',
            },
            name: 'NoSub',
          },
        ],
        name: 'tc-tree-linked2-sub 1',
      },
    ]))

  test('loop', async () =>
    await runTest('loop', [
      {
        actions: [],
        gateways: {},
        name: 'Target',
      },
    ]))

  test('subloop', async () =>
    await runTest('subloop', [
      {
        children: [
          {
            actions: [],
            gateways: {},
            name: 'Target',
          },
          {
            children: [
              {
                actions: ['Click'],
                gateways: {},
                name: 'Target',
              },
            ],
            name: 'tc-tree-subloop-sub',
          },
        ],
        name: 'tc-tree-subloop-sub',
      },
    ]))

  test('subflow-multi', async () =>
    await runTest('subflow-multi', [
      {
        children: [
          {
            actions: [],
            gateways: {
              Linked: 'B',
            },
            name: 'Common',
          },

          {
            actions: [],
            gateways: {
              Linked: 'B',
            },
            name: 'B Message',
          },
        ],
        name: 'tc-tree-subflow-multi-sub',
      },
      {
        children: [
          {
            actions: ['Click'],
            gateways: {
              Linked: 'A',
            },
            name: 'Common',
          },
          {
            actions: ['Click'],
            gateways: {
              Linked: 'A',
            },
            name: 'A Message',
          },
        ],
        name: 'tc-tree-subflow-multi-sub 1',
      },
    ]))

  test('linked-script', async () =>
    await runTest('linked-script', [
      {
        actions: [],
        gateways: {
          Gateway: 'A',
        },
        name: 'Target',
      },
      {
        actions: [],
        gateways: {
          Gateway: 'B',
        },
        name: 'Target',
        index: 1,
      },
      {
        children: [
          {
            actions: [],
            gateways: {
              Gateway: 'A',
            },
            name: 'Target',
          },
        ],
        name: 'tc-tree-linked-script-sub',
      },
    ]))

  test('parallel', async () => {
    await runTest('parallel', [
      {
        actions: [],
        gateways: {},
        name: 'Target 1',
      },
      {
        actions: [],
        gateways: {},
        name: 'Target 2',
      },
    ])
  })
})
