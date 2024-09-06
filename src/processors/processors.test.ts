import { describe, expect, test } from 'vitest'
import { loadDocumentFromFigma } from './figma/client.js'
import fs from 'fs'
import path from 'node:path'
import { processFigmaDocument } from './figma/common.js'
import { getTeNodeMetadata } from './figma/te.js'
import { normalizeScraped } from './normalizer.js'
import { getOpenNodeMetadata } from './figma/open.js'
import { processMermaid } from './mermaid/index.js'

const figmaTEFile = path.join(__dirname, 'testdata', 'figmaTE.json')
const figmaOpenFile = path.join(__dirname, 'testdata', 'figmaOpen.json')
const mermaidFile = path.join(__dirname, 'testdata', 'mermaid.md')
const expectedNormalizedFile = path.join(__dirname, 'testdata', 'expectedNormalized.json')

const getExpected = () => JSON.parse(fs.readFileSync(expectedNormalizedFile, 'utf8'))

describe('processors', async () => {
  test.skipIf(!process.env.UPDATE_DATA)('update test data', async () => {
    // Load TE figma document
    fs.writeFileSync(figmaOpenFile, JSON.stringify(
      await loadDocumentFromFigma({
        token: process.env.TOKEN,
        fileId: '44ec05MSJrjjmxnJWG55By'
      }), null, 2), 'utf-8')

    // Load Open Figma document
    fs.writeFileSync(figmaTEFile, JSON.stringify(
      await loadDocumentFromFigma({
        token: process.env.TOKEN,
        fileId: 'hERI5lpQhUIlONvwsE03d1'
      }), null, 2), 'utf-8')

    // Use normalized TE file as reference
    const document = JSON.parse(fs.readFileSync(figmaTEFile, 'utf8'))
    const scraped = processFigmaDocument(document, getTeNodeMetadata)
    const normalized = normalizeScraped(scraped)
    fs.writeFileSync(expectedNormalizedFile, JSON.stringify(normalized, null, 2), 'utf8')
  })

  test.skipIf(!process.env.UPDATE_DATA)('update only normalized', async () => {
    // Use normalized TE file as reference
    const document = JSON.parse(fs.readFileSync(figmaTEFile, 'utf8'))
    const scraped = processFigmaDocument(document, getTeNodeMetadata)
    const normalized = normalizeScraped(scraped)
    fs.writeFileSync(expectedNormalizedFile, JSON.stringify(normalized, null, 2), 'utf8')
  })

  test('process TE Figma document', () => {
    const document = JSON.parse(fs.readFileSync(figmaTEFile, 'utf8'))
    const scraped = processFigmaDocument(document, getTeNodeMetadata)
    const normalized = normalizeScraped(scraped)
    expect(normalized).toStrictEqual(getExpected())
  })

  test('process Open Figma document', () => {
    const document = JSON.parse(fs.readFileSync(figmaOpenFile, 'utf8'))
    const scraped = processFigmaDocument(document, getOpenNodeMetadata)
    const normalized = normalizeScraped(scraped)
    expect(normalized).toStrictEqual(getExpected())
  })

  test('process Mermaid Markdown file', async () => {
    const scraped = await  processMermaid({ file: mermaidFile })
    const normalized = normalizeScraped(scraped)
    expect(normalized).toStrictEqual(getExpected())
  })
})
