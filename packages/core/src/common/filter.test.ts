import { describe, expect, test } from 'vitest'
import { processFigma } from '../sources/figma.js'
import { figmaConnectorNode, figmaNodes, getBaseFigmaNode, getFigmaTestData } from '../sources/test/figmaGenerator.js'
import { filterScraped } from './filter.js'
import { getPathGatewayValuesForPath, getTestableNodes } from '../targets/codegen/misc.js'
import { findShortestPathToNode } from './shotestPath.js'

describe('filter scraped', () => {
  test('filter', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        ...figmaNodes.start({ id: '0' }),
        ...figmaConnectorNode({ text: 'root:demo', start: '0', end: '1' }),
        ...figmaNodes.script({ id: '1', type: 'script', text: 'Some script' }),
        ...figmaConnectorNode({ start: '1', end: '2' }),
        ...figmaNodes.gateway({ id: '2' }),
        ...figmaConnectorNode({ start: '2', end: '3', text: 'A' }),
        ...figmaNodes.script({ id: '3', type: 'message', text: 'Show A' }),
        ...figmaConnectorNode({ start: '3', end: '4' }),
        ...figmaNodes.userAction({ id: '4' }),
        ...figmaConnectorNode({ start: '4', end: 'end' }),
        ...figmaNodes.start({ id: 'end' }),
        ...figmaNodes.signalListen({ id: '5', parentId: '4', text: 'Click Button' }),
        ...figmaConnectorNode({ start: '5', end: '6' }),
        ...figmaNodes.script({ id: '6', type: 'message', text: 'Clicked Button' }),
        ...figmaConnectorNode({ start: '6', end: '7' }),
        ...figmaNodes.subprocess({ text: 'Some subprocess', id: '7' }),
        ...figmaConnectorNode({ start: '7', end: 'after' }),
        ...figmaNodes.script({ id: 'after', type: 'message', text: 'After subprocess' }),
        ...figmaNodes.start({ id: '8' }),
        ...figmaConnectorNode({ text: 'Some subprocess', start: '8', end: '9' }),
        ...figmaNodes.script({ id: '9', type: 'signalSend', text: 'In subprocess' }),
        ...figmaNodes.script({ id: 'OtherScriptId', type: 'script' })
      ])
    )
    const filtered = filterScraped(scraped, 'demo')

    expect(filtered).toStrictEqual([
      {
        distance: 0,
        'id': '0',
        'isRoot': true,
        'next': '1',
        'raw': 'demo',
        'text': 'demo',
        'type': 'start'
      },
      {
        distance: 1,
        'id': '1',
        'next': '2',
        'raw': 'Some script',
        'text': 'Some script',
        'type': 'script'
      },
      {
        distance: 2,
        'id': '2',
        'options': {
          '3': 'A'
        },
        'raw': 'Gateway',
        'text': 'Gateway',
        'type': 'gateway',
        variant: 'gateway'
      },
      {
        distance: 3,
        'id': '3',
        'next': '4',
        'raw': 'Show A',
        'text': 'Show A',
        'type': 'script'
      },
      {
        distance: 4,
        'actions': {
          '6': 'Click Button'
        },
        'id': '4',
        'next': 'end',
        'raw': 'action',
        'text': 'action',
        'type': 'userAction'
      },
      {
        distance: 5,
        'id': '6',
        'next': '7',
        'raw': 'Clicked Button',
        'text': 'Clicked Button',
        'type': 'script'
      },
      {
        distance: 6,
        'id': '7',
        'link': '8',
        'next': 'after',
        'raw': 'Some subprocess',
        'tableKey': undefined,
        'text': 'Some subprocess',
        'type': 'subprocess'
      },
      {
        distance: 7,
        'id': '8',
        'isRoot': false,
        'next': '9',
        'raw': 'Some subprocess',
        'text': 'Some subprocess',
        'type': 'start'
      },
      {
        distance: 8,
        'id': '9',
        'next': undefined,
        'raw': 'In subprocess',
        'text': 'In subprocess',
        'type': 'script'
      },
      {
        distance: 5,
        'id': 'end',
        'raw': 'end',
        'text': 'end',
        'type': 'end'
      },
      {
        distance: 7,
        'id': 'after',
        'next': undefined,
        'raw': 'After subprocess',
        'text': 'After subprocess',
        'type': 'script'
      }
    ])
    expect(filtered.find(n => n.id === 'OtherScriptId')).toBeUndefined()
  })
  test('find untouched paths', async () => {
    const scraped = await processFigma(getFigmaTestData())
    const filtered = filterScraped(scraped, 'wip')
    const testableNodes = getTestableNodes(filtered)
    const shortestPaths = testableNodes.map(n => findShortestPathToNode(filtered, n.id))
    const gateways = shortestPaths.map(path => getPathGatewayValuesForPath(path))
    const touchedGatewayOptions = Object.keys(gateways.reduce((acc, cur) => {
      Object.entries(cur).forEach(v => {
        acc[`${v[0]}:${v[1]}`] = true
      })
      return acc
    }, {}))
    const allGatewayOptions = Object.keys(filtered.filter((n) => n.type === 'gateway')
      .reduce((acc, cur) => {
        Object.values(cur.options).forEach(v => {
          acc[`${cur.text.replace('*', '').trim()}:${v}`] = true
        })
        return acc
      }, {}))
    const diff = allGatewayOptions.filter(gw => !touchedGatewayOptions.includes(gw))
    expect(diff.length).toEqual(0)
  })
})
