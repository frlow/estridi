import {describe, test} from 'vitest'
import fs from 'fs'
import path from 'node:path'
import { loadDocumentFromFigma } from './client.js'
import config from '../../estridi.json'
import { processFigmaDocument } from './process.js'
import { generateAll } from '../generators/index.js'

describe("process document", ()=>{
  test.skipIf(fs.existsSync(path.join(__dirname, "testdata.test.ts")))("prepare", async ()=>{
    const data = await loadDocumentFromFigma(config)
    fs.writeFileSync(path.join(__dirname, "testdata.test.ts"), `export const testDocument = ${JSON.stringify(data)}`, 'utf8')
  })
  test("dev", async ()=>{
    const document = await import('./testdata.test.js')
    const data = processFigmaDocument(document.testDocument)
    const tables = data.find(d=>d.type==="table")
    // generateAll(data, 'playwright')
    debugger
  })
})
