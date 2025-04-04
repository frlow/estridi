import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { startServer } from './server'
import * as snapshot from './snapshot'
import path from 'node:path'
import fs from 'node:fs'

const testCaseFilePath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'core',
  'src',
  'test',
  's3d.json',
)

describe('server', () => {
  let server: ReturnType<typeof startServer>
  beforeAll(() => {
    vi.spyOn(snapshot, 'loadSnapshot').mockImplementation(() =>
      JSON.parse(fs.readFileSync(testCaseFilePath, 'utf8')),
    )
    vi.spyOn(snapshot, 'saveSnapshot').mockImplementation((data) => {})
    server = startServer('dummy')
  })
  afterAll(() => {
    server.close()
  })

  test('get roots', async () => {
    const roots = await fetch('http://localhost:4005/api/roots').then((r) =>
      r.json(),
    )
    expect(roots.length).toBeGreaterThan(5)
    for (const root of roots) {
      expect(typeof root).toEqual('string')
    }
    expect(roots).toContain('standard')
  })

  test('get targets', async () => {
    const roots = await fetch('http://localhost:4005/api/targets').then((r) =>
      r.json(),
    )
    expect(roots.length).toBeGreaterThan(0)
    for (const root of roots) {
      expect(typeof root).toEqual('string')
    }
    expect(roots).toContain('playwright')
  })

  test('get code', async () => {
    const response = await fetch(
      'http://localhost:4005/api/code/standard/playwright',
    ).then((r) => r.json())
    const code = response.code
    expect(response.code).toContain('import { handles } from "./standard.js"')
    expect(response.fileName).toEqual('standard.spec.ts')
  })
})
