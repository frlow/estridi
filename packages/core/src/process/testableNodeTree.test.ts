import { describe, expect, test } from 'vitest'
import { getTestCase } from '../test/editorTestCases'
import { getTestableNodeTree, NodeTree } from './testableNodeTree'

const runTest = async (
  rootName: string,
  expectedChildren: NodeTree['children'],
) => {
  const root = `tc-tree-${rootName}`
  const testCase = await getTestCase(root)
  const tree = getTestableNodeTree(testCase, root)
  const expected = {
    name: root,
    allGateways: expect.anything(),
    allServiceCalls: expect.anything(),
    subprocesses: expect.anything(),
    children: expectedChildren,
  }
  expect(tree).toEqual(expected)
}

describe('testable node tree 2', () => {
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
          {
            actions: ['Click'],
            gateways: {
              Gateway: 'no',
            },
            name: 'NoSub',
          },
        ],
        name: 'tc-tree-linked2-sub',
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

  test('table', async () => {
    const rootName = 'table'
    const root = `tc-tree-${rootName}`
    const testCase = await getTestCase(root)
    const tree = getTestableNodeTree(testCase, root)
    const expected = {
      name: root,
      allGateways: ["validate:tc-tree-table-table"],
      allServiceCalls: expect.anything(),
      subprocesses: expect.anything(),
      children: [
        {
          children: [
            {
              actions: [],
              gateways: {
                'validate:tc-tree-table-table': 'AAA',
              },
              name: 'validate:tc-tree-table-table AAA',
            },
            {
              actions: [],
              gateways: {
                'validate:tc-tree-table-table': 'BBB',
              },
              name: 'validate:tc-tree-table-table BBB',
            },
          ],
          name: 'validate:tc-tree-table-table',
        },
      ],
    }
    expect(tree).toEqual(expected)
  })

  describe('virtual nodes', () => {
    test('base', async () =>
      await runTest('virtual', [
        {
          actions: [],
          gateways: {
            'Is thing on?': 'no',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing on?': 'yes',
          },
          name: 'Show Thing',
        },
      ]))

    test('double', async () =>
      await runTest('virtual-double', [
        {
          actions: [],
          gateways: {
            'Is thing on?': 'no',
          },
          name: 'Negative: Show Warning',
        },
        {
          actions: [],
          gateways: {
            'Is thing on?': 'maybe',
          },
          name: 'Show Warning',
        },
        {
          actions: [],
          gateways: {
            'Is thing on?': 'yes',
          },
          name: 'Show Error',
        },
      ]))

    test('stair', async () =>
      await runTest('virtual-stair', [
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'no',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'yes',
            'Is thing 2 on?': 'no',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'yes',
            'Is thing 2 on?': 'yes',
          },
          name: 'Show Thing',
        },
      ]))

    test('wrong-path', async () =>
      await runTest('virtual-wrong-path', [
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'no',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'yes',
            'Is thing 2 on?': 'no',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'no',
          },
          name: 'Wrong',
        },
        {
          actions: [],
          gateways: {
            'Is thing 1 on?': 'yes',
            'Is thing 2 on?': 'yes',
            'Is thing 3 on?': 'yes',
            'Is thing 4 on?': 'yes',
            'Is thing 5 on?': 'yes',
          },
          name: 'Show Thing',
        },
      ]))

    test.skip('closed-path', async () =>
      await runTest('virtual-closed-path', [
        {
          actions: [],
          gateways: {
            Before: 'A',
          },
          name: 'A',
        },
        {
          actions: [],
          gateways: {
            Before: 'B',
          },
          name: 'B',
        },
        {
          actions: [],
          gateways: {
            Before: 'A',
            'Is thing on?': 'yes',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            Before: 'B',
          },
          name: 'Show Thing',
        },
        {
          actions: [],
          gateways: {
            Before: 'A',
            'Is thing on?': 'no',
          },
          name: 'Wrong',
        },
      ]))
    test('shortest-path', async () =>
      await runTest('virtual-shortest-path', [
        {
          actions: [],
          gateways: {
            'Is thing on?': 'no',
          },
          name: 'Negative: Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing on?': 'yes',
          },
          name: 'Show Thing',
        },
        {
          actions: [],
          gateways: {
            'Is thing on?': 'no',
          },
          name: 'My node',
        },
      ]))
  })
})
