import { prettifyCode } from '../texts'
import path from 'node:path'
import fs from 'node:fs'
import { expect } from 'vitest'

export const compareToReferenceFile = async (
  name: string,
  code: string,
  override: boolean,
) => {
  const prettyCode = await prettifyCode(code)
  const filePath = path.join(__dirname, "references",`${name}Reference.ts`)
  const referenceFileContent = `// @ts-nocheck\n${prettyCode}`
  if (override) fs.writeFileSync(filePath, referenceFileContent, 'utf8')
  const reference = fs.readFileSync(filePath, 'utf8')
  const normalizeLineEndings = (str, normalized = '\n') =>
    str.replace(/\r?\n/g, normalized)
  expect(normalizeLineEndings(referenceFileContent)).toStrictEqual(
    normalizeLineEndings(reference),
  )
}
