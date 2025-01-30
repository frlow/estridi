import { describe, expect, test } from 'vitest'
import { processFigma } from '../sources/figma.js'
import { filterScraped } from './filter.js'
import { getPathGatewayValuesForPath, getTestableNodes } from '../targets/codegen/misc.js'
import { findShortestPathToNode } from './shotestPath.js'
import { autoText, getFigmaTestData } from '../sources/testCases'

describe('filter scraped', () => {
  test('filter', async () => {
    const scraped: Scraped = [
      { id: '0', type: 'root', ...autoText('demo'), next: '1' },
      { id: '1', type: 'script', variant: 'script', ...autoText('Some script'), next: '2' },
      { id: '2', type: 'gateway', ...autoText('Gateway'), options: { 3: 'A' }, variant: 'gateway' },
      { id: '3', next: '4', raw: 'Show A', text: 'Show A', type: 'script', variant: 'script' },
      {
        'actions': {
          '6': 'Click Button'
        },
        'id': '4',
        'next': 'end',
        'raw': 'action',
        'text': 'action',
        'type': 'userAction',
        variant: 'userAction'
      },
      {
        'id': '6',
        'next': '7',
        'raw': 'Clicked Button',
        'text': 'Clicked Button',
        'type': 'script',
        variant: 'script'
      },
      {
        'id': '7',
        'link': '8',
        'next': 'after',
        'raw': 'Some subprocess',
        'tableKey': undefined,
        'text': 'Some subprocess',
        'type': 'subprocess'
      },
      {
        'id': '8',
        'next': '9',
        'raw': 'Some subprocess',
        'text': 'Some subprocess',
        'type': 'start'
      },
      {
        'id': '9',
        'next': undefined,
        'raw': 'In subprocess',
        'text': 'In subprocess',
        'type': 'script',
        variant: 'script'
      },
      {
        'id': 'end',
        'raw': 'end',
        'text': 'end',
        'type': 'end'
      },
      {
        'id': 'after',
        'next': undefined,
        'raw': 'After subprocess',
        'text': 'After subprocess',
        'type': 'script',
        variant: 'script'
      },
      { id: 'OtherId', type: 'script', variant: 'script', ...autoText('other') },
    ]

    const filtered = filterScraped(scraped, 'demo')
    const expected: Scraped = [
      {
        distance: 0,
        'id': '0',
        'next': '1',
        'raw': 'demo',
        'text': 'demo',
        'type': 'root'
      },
      {
        distance: 1,
        'id': '1',
        'next': '2',
        'raw': 'Some script',
        'text': 'Some script',
        'type': 'script',
        variant: 'script'
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
        'type': 'script',
        variant: 'script'
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
        'type': 'userAction',
        variant: 'userAction'
      },
      {
        distance: 5,
        'id': '6',
        'next': '7',
        'raw': 'Clicked Button',
        'text': 'Clicked Button',
        'type': 'script',
        variant: 'script'
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
        'type': 'script',
        variant: 'script'
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
        'type': 'script',
        variant: 'script'
      }
    ]
    expect(filtered).toStrictEqual(expected)
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
