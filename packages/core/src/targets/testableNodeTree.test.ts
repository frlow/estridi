import { describe, expect, test } from 'vitest'
import { getTestableNodeTree } from './testableNodeTree'
import { autoText, standardTestCase } from '../test/testCases'
import { generatePlaywright } from './playwright'
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
})
