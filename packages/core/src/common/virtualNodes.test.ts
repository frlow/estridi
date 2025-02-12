import { describe, expect, test } from 'vitest'
import { Scraped, ScrapedGateway } from '../scraped'
import { injectVirtualNodes } from './virtualNodes'
import { autoText } from './texts'
import { editorTestCases } from '../test/editorTestCases'

describe('inject virtual nodes', () => {
  const gwName = 'is?'

  test('inject one virtual node', async () => {
    const scraped: Scraped = [{ type: 'root', id: 'RootId', ...autoText('main'), next: 'GatewayId' },
      {
        type: 'gateway', id: 'GatewayId', ...autoText(gwName), variant: 'gateway', options: {
          'ConnectorId': 'no',
          'ScriptId': 'yes'
        }
      },
      { type: 'script', variant: 'script', id: 'ScriptId', ...autoText('script'), next: 'ConnectorId' },
      { type: 'connector', id: 'ConnectorId', ...autoText('') }]
    const injected = await injectVirtualNodes(scraped)
    const expected = structuredClone(scraped)
    expected.find(n => n.type === 'gateway').options = {
      'GatewayId-Virtual': 'no',
      'ScriptId': 'yes'
    }
    expected.push({
      'id': 'GatewayId-Virtual',
      'next': 'ConnectorId',
      ...autoText('Negative: script'),
      'type': 'script',
      'variant': 'virtual' as any
    })
    expect(injected).toStrictEqual(expected)
  })

  test('inject two nodes, joined gateways', async () => {
    const scraped: Scraped = [{ type: 'root', id: 'RootId', ...autoText('main'), next: 'GatewayId' },
      {
        type: 'gateway', id: 'GatewayId', ...autoText(gwName), variant: 'gateway', options: {
          'ConnectorId': 'no',
          'ScriptId': 'yes'
        }
      },
      { type: 'script', variant: 'script', id: 'ScriptId', ...autoText('script'), next: 'ConnectorId' },
      { type: 'connector', id: 'ConnectorId', ...autoText(''), next: 'Gateway2Id' },
      {
        type: 'gateway', id: 'Gateway2Id', ...autoText(gwName), variant: 'gateway', options: {
          'Connector2Id': 'no',
          'Script2Id': 'yes'
        }
      },
      { type: 'script', variant: 'script', id: 'Script2Id', ...autoText('script2'), next: 'Connector2Id' },
      { type: 'connector', id: 'Connector2Id', ...autoText('') }]
    const injected = await injectVirtualNodes(scraped)
    const expected = structuredClone(scraped)
    ;(expected.find(n => n.id === 'GatewayId') as ScrapedGateway).options = {
      'GatewayId-Virtual': 'no',
      'ScriptId': 'yes'
    }
    ;(expected.find(n => n.id === 'Gateway2Id') as ScrapedGateway).options = {
      'Gateway2Id-Virtual': 'no',
      'Script2Id': 'yes'
    }
    expected.push({
      'id': 'GatewayId-Virtual',
      'next': 'ConnectorId',
      ...autoText('Negative: script'),
      'type': 'script',
      'variant': 'virtual' as any
    })
    expected.push({
      'id': 'Gateway2Id-Virtual',
      'next': 'Connector2Id',
      ...autoText('Negative: script2'),
      'type': 'script',
      'variant': 'virtual' as any
    })
    expect(injected).toStrictEqual(expected)
  })
})

describe('text on virtual nodes', () => {
  test('base case', async () => {
    const injected = await injectVirtualNodes(editorTestCases.base)
    const virtualNodes = injected.filter((n: any) => n.variant === 'virtual')
    expect(virtualNodes.length).toEqual(1)
    for(const vn of virtualNodes){
      expect(vn.raw).toEqual('Negative: Show Thing')
    }
  })

  test('double case', async () => {
    const injected = await injectVirtualNodes(editorTestCases.double)
    const virtualNodes = injected.filter((n: any) => n.variant === 'virtual')
    expect(virtualNodes.length).toEqual(1)
    for(const vn of virtualNodes){
      expect(vn.raw).toEqual('Negative: Show Warning')
    }
  })

  test('stair case', async () => {
    const injected = await injectVirtualNodes(editorTestCases.stair)
    const virtualNodes = injected.filter((n: any) => n.variant === 'virtual')
    expect(virtualNodes.length).toEqual(2)
    for(const vn of virtualNodes){
      expect(vn.raw).toEqual('Negative: Show Thing')
    }
  })

  test('wrong path case', async () => {
    const injected = await injectVirtualNodes(editorTestCases.wrongpath)
    const virtualNodes = injected.filter((n: any) => n.variant === 'virtual')
    expect(virtualNodes.length).toEqual(2)
    for(const vn of virtualNodes){
      expect(vn.raw).toEqual('Negative: Show Thing')
    }
  })

  test('closed path case', async () => {
    const injected = await injectVirtualNodes(editorTestCases.closedpath)
    const virtualNodes = injected.filter((n: any) => n.variant === 'virtual')
    expect(virtualNodes.length).toEqual(1)
    for(const vn of virtualNodes){
      expect(vn.raw).toEqual('Negative: Show Thing')
    }
  })
})
