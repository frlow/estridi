#!/usr/bin/env node
import path from 'node:path'
import { Scraped } from './scraped.js'
import fs from 'fs'
import * as tsImport from 'ts-import'

const source = process.argv[2]
const target = process.argv[3] || 'flowchart.md'

const generate = async () => {
  const { scraped }: { scraped: Scraped } = await tsImport.load(
    path.join(process.cwd(), source),
  )
  const lines: string[] = ['```mermaid', 'flowchart LR']

  // Add all nodes
  scraped.forEach((n) => lines.push(`    ${n.id}["${n.text || '.'}"]`))

  // Add all next
  scraped.forEach((n: any) => {
    if (n.next) lines.push(`    ${n.id}-->${n.next}`)
    if (n.options)
      Object.entries(n.options).forEach(([key, text]) =>
        lines.push(`    ${n.id}-- ${text} -->${key}`),
      )
    if (n.actions)
      Object.entries(n.actions).forEach(([key, text]) =>
        lines.push(`    ${n.id}-- User does: ${text} -->${key}`),
      )
    if (n.link) lines.push(`    ${n.id}-->${n.link}`)
  })

  lines.push('```')
  fs.writeFileSync('flowchart.md', lines.join('\n'), 'utf8')
}

generate().then()
