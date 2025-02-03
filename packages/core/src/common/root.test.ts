import { describe, expect, test } from 'vitest'
import { getRootName } from './root.js'
import { autoText } from '../test/testCases'
import { Scraped } from '../scraped'

describe('find root node', () => {
  test('RootName is undefined and there is only one root', async () => {
    const scraped: Scraped = [{ type: 'root', id: 'rootId', ...autoText('demo') }]
    expect(getRootName(scraped, undefined)).toEqual('demo')
  })

  test('RootName is set and there is only one root', async () => {
    const scraped: Scraped = [{ type: 'root', id: 'rootId', ...autoText('demo') }]
    expect(getRootName(scraped, 'demo')).toEqual('demo')
  })

  test('RootName is set but missing and there is only one root', async () => {
    const scraped: Scraped = [{ type: 'root', id: 'rootId', ...autoText('demo') }]
    expect(getRootName(scraped, 'wrong')).toEqual(undefined)
  })

  test('RootName is undefined and there are multiple roots', async () => {
    const scraped: Scraped = [
      { type: 'root', id: 'rootId', ...autoText('demo') },
      { type: 'root', id: 'rootId2', ...autoText('other') }
    ]
    expect(getRootName(scraped, undefined)).toEqual(undefined)
  })

  test('RootName is set and there are multiple roots', async () => {
    const scraped: Scraped = [
      { type: 'root', id: 'rootId', ...autoText('demo') },
      { type: 'root', id: 'rootId2', ...autoText('other') }
    ]
    expect(getRootName(scraped, 'other')).toEqual('other')
  })
})
