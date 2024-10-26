import { describe, expect, test } from 'vitest'
import { processFigma } from '../sources/figma.js'
import { figmaConnectorNode, figmaNodes, getBaseFigmaNode } from '../sources/test/figmaGenerator.js'
import { getRootName } from './root.js'

describe('find root node', () => {
  test('RootName is undefined and there is only one root', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: '0' }),
        ...figmaConnectorNode({ id: '0-1', text: 'root:demo', start: '0', end: '1' })
      ])
    )
    expect(getRootName(scraped, undefined)).toEqual("demo")
  })

  test('RootName is set and there is only one root', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: '0' }),
        ...figmaConnectorNode({ id: '0-1', text: 'root:demo', start: '0', end: '1' })
      ])
    )
    expect(getRootName(scraped, "demo")).toEqual("demo")
  })

  test('RootName is set but missing and there is only one root', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: '0' }),
        ...figmaConnectorNode({ id: '0-1', text: 'root:demo', start: '0', end: '1' })
      ])
    )
    expect(getRootName(scraped, "wrong")).toEqual(undefined)
  })

  test('RootName is undefined and there are multiple roots', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: '0' }),
        ...figmaConnectorNode({ id: '0-1', text: 'root:demo', start: '0', end: '1' }),
        figmaNodes.start({ id: '2' }),
        ...figmaConnectorNode({ id: '2-3', text: 'root:other', start: '2', end: '3' })
      ])
    )
    expect(getRootName(scraped, undefined)).toEqual(undefined)
  })

  test('RootName is set and there are multiple roots', async () => {
    const scraped = await processFigma(
      getBaseFigmaNode([
        figmaNodes.start({ id: '0' }),
        ...figmaConnectorNode({ id: '0-1', text: 'root:demo', start: '0', end: '1' }),
        figmaNodes.start({ id: '2' }),
        ...figmaConnectorNode({ id: '2-3', text: 'root:other', start: '2', end: '3' })
      ])
    )
    expect(getRootName(scraped, "other")).toEqual("other")
  })
})
