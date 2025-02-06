import { describe, expect, test } from 'vitest'
import { processFigma } from '../sources/figma.js'
import { filterScraped } from './filter.js'
import { getPathGatewayValuesForPath, getTestableNodes } from '../targets/codegen/misc.js'
import { findShortestPathToNode } from './shotestPath.js'
import { autoText, getFigmaTestData } from '../test/testCases'
import { Scraped } from '../scraped'
import { convertToFigma } from '../converter/figmaConverter'

describe('filter scraped', () => {
  test('filter', async () => {
    const scraped: Scraped = [
      { id: '0', type: 'root', ...autoText('demo'), next: '1' },
      { id: '1', type: 'script', variant: 'script', ...autoText('Some script'), next: '2' },
      { id: '2', type: 'gateway', ...autoText('Gateway'), options: { 3: 'A' }, variant: 'gateway' },
      { id: '3', next: '4', ...autoText('Show A'), type: 'script', variant: 'script' },
      {
        'actions': {
          '6': 'Click Button'
        },
        'id': '4',
        'next': 'end',
        ...autoText('action'),
        'type': 'userAction',
        variant: 'userAction'
      },
      {
        'id': '6',
        'next': '7',
        ...autoText('Clicked Button'),
        'type': 'script',
        variant: 'script'
      },
      {
        'id': '7',
        'link': '8',
        'next': 'after',
        ...autoText('Some subprocess'),
        'tableKey': undefined,
        'type': 'subprocess'
      },
      {
        'id': '8',
        'next': '9',
        ...autoText('Some subprocess'),
        'type': 'start'
      },
      {
        'id': '9',
        'next': undefined,
        ...autoText('In subprocess'),
        'type': 'script',
        variant: 'script'
      },
      {
        'id': 'end',
        ...autoText('end'),
        'type': 'end'
      },
      {
        'id': 'after',
        'next': undefined,
        ...autoText('After subprocess'),
        'type': 'script',
        variant: 'script'
      },
      { id: 'OtherId', type: 'script', variant: 'script', ...autoText('other') }
    ]

    const filtered = filterScraped(scraped, 'demo')
    const expected: Scraped = [
      {
        distance: 0,
        'id': '0',
        'next': '1',
        ...autoText('demo'),
        'type': 'root'
      },
      {
        distance: 1,
        'id': '1',
        'next': '2',
        ...autoText('Some script'),
        'type': 'script',
        variant: 'script'
      },
      {
        distance: 2,
        'id': '2',
        'options': {
          '3': 'A'
        },
        ...autoText('Gateway'),
        'type': 'gateway',
        variant: 'gateway'
      },
      {
        distance: 3,
        'id': '3',
        'next': '4',
        ...autoText('Show A'),
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
        ...autoText('action'),
        'type': 'userAction',
        variant: 'userAction'
      },
      {
        distance: 5,
        'id': '6',
        'next': '7',
        ...autoText('Clicked Button'),
        'type': 'script',
        variant: 'script'
      },
      {
        distance: 6,
        'id': '7',
        'link': '8',
        'next': 'after',
        ...autoText('Some subprocess'),
        'tableKey': undefined,
        'type': 'subprocess'
      },
      {
        distance: 7,
        'id': '8',
        'next': '9',
        ...autoText('Some subprocess'),
        'type': 'start'
      },
      {
        distance: 8,
        'id': '9',
        'next': undefined,
        ...autoText('In subprocess'),
        'type': 'script',
        variant: 'script'
      },
      {
        distance: 5,
        'id': 'end',
        ...autoText('end'),
        'type': 'end'
      },
      {
        distance: 7,
        'id': 'after',
        'next': undefined,
        ...autoText('After subprocess'),
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
  test('filter unlinked tables', async () => {
    const scraped: Scraped = [
      { id: '0', type: 'root', ...autoText('demo'), next: '1' },
      { id: '1', type: 'subprocess', ...autoText('Validate: Table1') },
      { id: 'table1Id', type: 'table', rows: [['Table1']], ...autoText('Table1') },
      { id: 'table2Id', type: 'table', rows: [['Table2']], ...autoText('Table2') }
    ]
    const processed = await processFigma(await convertToFigma(scraped))
    const filtered = filterScraped(processed, 'demo')
    expect(filtered.filter(n => n.type === 'table').length).toEqual(1)
  })
})
