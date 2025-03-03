import { describe, expect, test } from 'vitest'
import { getTestableNodeTree } from './testableNodeTree'
import { autoText, standardTestCase } from '../test/testCases'
import { Scraped } from '../scraped'

describe('testable node tree', () => {
  test('standard case', async () => {
    const result = getTestableNodeTree(standardTestCase)
    expect(result).toStrictEqual({
      'name': 'main',
      'nodes': [
        {
          'id': 'ServiceCallId',
          'type': 'serviceCall',
          'raw': '/api/data',
          'text': 'api data',
          'next': 'ServiceCallErrorHandlingId',
          'extra': {
            'x': 350,
            'y': 0,
            'width': 80,
            'height': 80
          }
        },
        {
          'id': 'ShowErrorId',
          'type': 'script',
          'variant': 'message',
          'raw': 'Show an error message',
          'text': 'Show an error message',
          'extra': {
            'x': 700,
            'y': -350,
            'width': 80,
            'height': 80
          }
        },
        {
          'id': 'ScriptId',
          'type': 'script',
          'variant': 'script',
          'raw': 'Do something [here]',
          'text': 'Do something here',
          'next': 'UserActionId',
          'extra': {
            'x': 1100,
            'y': 0,
            'width': 80,
            'height': 80
          }
        },
        {
          'name': 'Next page',
          'nodes': [
            {
              'id': 'LinkId',
              'type': 'script',
              'variant': 'signalSend',
              'raw': 'Go to some page',
              'text': 'Go to some page',
              'extra': {
                'x': 350,
                'y': 500,
                'width': 80,
                'height': 80
              }
            }
          ],
          'blockPath': [
            {
              'id': 'RootId',
              'type': 'root',
              'raw': 'main',
              'text': 'main',
              'next': 'ServiceCallId',
              'extra': {
                'x': 0,
                'y': 0,
                'width': 80,
                'height': 80
              }
            },
            {
              'id': 'ServiceCallId',
              'type': 'serviceCall',
              'raw': '/api/data',
              'text': 'api data',
              'next': 'ServiceCallErrorHandlingId',
              'extra': {
                'x': 350,
                'y': 0,
                'width': 80,
                'height': 80
              }
            },
            {
              'id': 'ServiceCallErrorHandlingId',
              'type': 'gateway',
              'variant': 'gateway',
              'raw': 'Any errors from api call?',
              'text': 'Any errors from api call',
              'options': {
                'ShowErrorId': 'yes',
                'ScriptId': 'no'
              },
              'extra': {
                'x': 700,
                'y': 0,
                'width': 80,
                'height': 80
              }
            },
            {
              'id': 'ScriptId',
              'type': 'script',
              'variant': 'script',
              'raw': 'Do something [here]',
              'text': 'Do something here',
              'next': 'UserActionId',
              'extra': {
                'x': 1100,
                'y': 0,
                'width': 80,
                'height': 80
              }
            },
            {
              'id': 'UserActionId',
              'type': 'userAction',
              'variant': 'userAction',
              'raw': 'action',
              'text': 'action',
              'next': 'BaseEndId',
              'actions': {
                'SubprocessId': 'Click'
              },
              'extra': {
                'x': 1450,
                'y': 0,
                'width': 400,
                'height': 80
              }
            },
            {
              'id': 'SubprocessId',
              'raw': 'Next page',
              'text': 'Next page',
              'type': 'subprocess',
              'link': 'NextPageId',
              'extra': {
                'x': 1500,
                'y': 240,
                'width': 80,
                'height': 80
              }
            }
          ]
        }
      ],
      'blockPath': []
    })
  })
  test('dual subprocesses', async () => {
    const scraped: Scraped = [
      { id: 'root', next: 'sub1', type: 'root', ...autoText('main') },
      { id: 'sub1', type: 'subprocess', link: 'sub1start', next: 'sub2', ...autoText('Sub1') },
      { id: 'sub1start', next: 'script1', ...autoText('Sub1'), type: 'start' },
      { id: 'script1', next: undefined, ...autoText('Script1'), type: 'script', variant: 'message' },
      { id: 'sub2', type: 'subprocess', link: 'sub2start', next: undefined, ...autoText('Sub2') },
      { id: 'sub2start', next: 'script2', ...autoText('Sub2'), type: 'start' },
      { id: 'script2', next: undefined, ...autoText('Script2'), type: 'script', variant: 'message' }
    ]
    const tree = getTestableNodeTree(scraped)
    const f = (id: string) => scraped.find(n => n.id === id)
    const expected = {
      "blockPath": [],
      "name": "main",
      nodes: [
        {
          'name': 'Sub1',
          'nodes': [f('script1')],
          'blockPath': [
            f('root'),
            f('sub1')
          ]
        },
        {
          'name': 'Sub2',
          'nodes': [f('script2')],
          'blockPath': [
            f('root'),
            f('sub1'),
            f('sub2')
          ]
        }
      ]
    }
    expect(tree).toStrictEqual(expected)
  })
})
