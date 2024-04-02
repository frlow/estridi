import { describe, expect, test, vi } from 'vitest'
import { Handles } from 'estridi'
import { processFigmaDocument } from '../figma/process.js'
import { createTester } from '../runners/runner.js'

describe('runner', () => {
  const baseHandles: (state?: any) => Handles & { mock: typeof vi.fn } = (state) => {
    const mock = vi.fn()
    return ({
      handleSetup: (...args) => {
        mock('handleSetup', ...args)
        return state
      },
      handleAction: (...args) => mock('handleAction', ...args),
      handleStart: (...args) => mock('handleStart', ...args),
      handleServiceCall: (...args) => mock('handleServiceCall', ...args),
      handleTestNode: (...args) => mock('handleTestNode', ...args),
      mock
    })
  }
  test('setup should be called', async () => {
    const { testDocument } = await import('./reference/testdata.js')
    const data = processFigmaDocument(testDocument)
    const handles = baseHandles({ stateProp: 'value' })
    const tester = createTester(data, '1:115', handles)
    await tester.testNode('4:348', { dummy: 0 })
    let counter = 1
    expect(handles.mock).toHaveBeenNthCalledWith(counter++, 'handleSetup', { dummy: 0 })
    expect(handles.mock).toHaveBeenNthCalledWith(counter++, 'handleServiceCall',
      '1:116: api call demo',
      {
        '1:117: Errors from demo': 'no',
        '4:199: A or B': 'B'
      },
      {
        dummy: 0,
        getTable: expect.any(Function),
        state: { stateProp: 'value' }
      })
    expect(handles.mock).toHaveBeenNthCalledWith(counter++, 'handleStart',
      {
        dummy: 0,
        getTable: expect.any(Function),
        state: {
          stateProp: 'value'
        }
      })
    expect(handles.mock).toHaveBeenNthCalledWith(counter++, 'handleAction',
      '4:322: Cancel',
      {
        '1:117: Errors from demo': 'no',
        '4:199: A or B': 'B'
      },
      {
        'dummy': 0,
        'getTable': expect.any(Function),
        'state': {
          'stateProp': 'value'
        }
      })
    expect(handles.mock).toHaveBeenNthCalledWith(counter++, 'handleTestNode',
      '4:348: Go back to registration page',
      [
        'root:Some feature',
        'api call demo',
        'Errors from demo',
        'Display stuff',
        'A or B',
        'Show box',
        'action',
        'Cancel',
        'Clear page',
        'Go back to registration page'
      ],
      {
        'dummy': 0,
        'getTable': expect.any(Function),
        'state': {
          'stateProp': 'value'
        }
      })
    expect(handles.mock).toHaveBeenCalledTimes(counter-1)
  })
})
