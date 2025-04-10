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
        path: expect.anything(),
      },
    ]))

  test('message2', async () =>
    await runTest('message2', [
      {
        name: 'Target',
        actions: [],
        gateways: {},
        path: expect.anything(),
      },
      {
        name: 'Other',
        actions: [],
        gateways: {},
        path: expect.anything(),
      },
    ]))

  test('gateway', async () =>
    await runTest('gateway', [
      {
        name: 'Target',
        actions: [],
        gateways: { Gateway: 'AAA' },
        path: expect.anything(),
      },
    ]))

  test('action', async () =>
    await runTest('action', [
      {
        name: 'Target',
        actions: ['Click'],
        gateways: {},
        path: expect.anything(),
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
            path: expect.anything(),
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
            path: expect.anything(),
          },
          {
            actions: [],
            gateways: {},
            name: 'Other',
            path: expect.anything(),
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
                path: expect.anything(),
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
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: '',
        },
        name: 'Other3',
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'Other2',
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'YesTarget',
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: 'no',
        },
        name: 'NoTarget',
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'After',
        path: expect.anything(),
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
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: 'yes',
        },
        name: 'YesBase',
        path: expect.anything(),
      },
      {
        children: [
          {
            actions: [],
            gateways: {
              Gateway: 'yes',
            },
            name: 'YesSub',
            path: expect.anything(),
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
            path: expect.anything(),
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
        path: expect.anything(),
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
            path: expect.anything(),
          },
          {
            children: [
              {
                actions: ['Click'],
                gateways: {},
                name: 'Target',
                path: expect.anything(),
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
            path: expect.anything(),
          },

          {
            actions: [],
            gateways: {
              Linked: 'B',
            },
            name: 'B Message',
            path: expect.anything(),
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
            path: expect.anything(),
          },
          {
            actions: ['Click'],
            gateways: {
              Linked: 'A',
            },
            name: 'A Message',
            path: expect.anything(),
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
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {
          Gateway: 'B',
        },
        name: 'Target',
        index: 1,
        path: expect.anything(),
      },
      {
        children: [
          {
            actions: [],
            gateways: {
              Gateway: 'A',
            },
            name: 'Target',
            path: expect.anything(),
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
        path: expect.anything(),
      },
      {
        actions: [],
        gateways: {},
        name: 'Target 2',
        path: expect.anything(),
      },
    ])
  })

  test('path', async () =>
    await runTest('path', [
      {
        actions: [],
        gateways: {
          Gateway: '',
        },
        name: 'Serivce Call..',
        path: [
          {
            raw: 'Gateway',
            type: 'gateway',
            value: '',
          },
          {
            raw: 'Serivce Call..',
            type: 'serviceCall',
          },
        ],
      },
      {
        actions: ["Click"],
        gateways: {
          Gateway: '',
          Other: '',
        },
        name: 'Target',
        path: [
          {
            raw: 'Gateway',
            type: 'gateway',
            value: '',
          },
          {
            raw: 'Serivce Call..',
            type: 'serviceCall',
          },
          {
            raw: 'Gateway',
            type: 'gateway',
            value: '',
          },
          {
            raw: 'Other',
            type: 'gateway',
            value: '',
          },
          {
            raw: "Click",
            type: 'action',
          },
        ],
      },
    ]))
})
