import { Feature } from '../feature'
import { getFileName } from './index'
import * as fs from 'node:fs'
import { writeFile } from './files'
import * as path from 'node:path'
import * as glob from 'glob'

const tableValueCutoff = 50
const createScenarioDefinitions = (feature: Feature, propNames: Record<string, boolean>) => {
  const propNamesTemp: Record<string, boolean> = {}
  let text = ''
  for (const scenario of feature.scenarios) {
    for (const given of scenario.given)
      propNamesTemp[`Given ${given.text}: ${given.value}`] = true
    for (const when of scenario.when) propNamesTemp[`When ${when.text}`] = true
    for (const then of scenario.then) propNamesTemp[`Then ${then.text}`] = true
  }
  Object.keys(propNamesTemp).forEach((key) => {
    text += `\n  '${key}': (state: T) => Promise<T|undefined>`
  })
  Object.keys(propNamesTemp).forEach(key=>propNames[key]=propNamesTemp[key])
  return text
}

const createTableDefinitions = (feature: Feature, propNames: Record<string, boolean>) => {
  const propNamesTemp: Record<string, boolean> = {}
  let text = ''
  for (const table of feature.tables)
    for (const row of table.rows)
      propNamesTemp[`Validate ${row.label}: ${row.values.map(v => v.substring(0, tableValueCutoff)).join(', ')}`] = false
  Object.keys(propNamesTemp).forEach((key) =>
    text += `\n  '${key}': () => Promise<void>`
  )
  Object.keys(propNamesTemp).forEach(key=>propNames[key]=propNamesTemp[key])
  return text
}

const createScenarioTests = (feature: Feature) => {
  let text = ''
  for (const scenario of feature.scenarios) {
    const label = [
      ...scenario.when.map((w) => w.text),
      ...scenario.then.map((t) => t.text),
      ' - ',
      ...scenario.given.map((g) => g.value)
    ].join(' ')
    text += '\n  test(\'' + label + '\', async () => {'
    text +=
      '\n    let state: any = steps.Before ? await steps.Before() : undefined'
    for (const given of scenario.given)
      text +=
        '\n    state = await steps[\'Given ' +
        given.text +
        ': ' +
        given.value +
        '\'](state) || state'
    text +=
      '\n    if (steps.BaseGiven) state = await steps.BaseGiven(state)|| state'
    for (const when of scenario.when)
      text +=
        '\n    state = await steps[\'When ' + when.text + '\'](state)|| state'
    for (const then of scenario.then)
      text +=
        '\n    state = await steps[\'Then ' + then.text + '\'](state)|| state'
    text += '\n  })'
  }
  return text
}

const createTableTests = (feature: Feature) => {
  let text = ''
  for (const table of feature.tables)
    for (const row of table.rows)
      text += `\n  test("Validate ${row.label}", async ()=>await steps["Validate ${
        row.label}: ${
        row.values.map(v => v.substring(0, tableValueCutoff)).join(', ')}"]())`
  return text
}

export const generateVitest = (dir: string, features: Feature[]) => {
  const testFiles: string[] = []
  fs.mkdirSync(dir, { recursive: true })
  for (const feature of features) {
    const propNames: Record<string, boolean> = {}
    const name = getFileName(feature.name)
    let out = '// WARNING!!'
    out +=
      '\n// this file is auto-generated and will change when updating the system design'
    out += '\n// don\'t change this file!\n'
    out += '\nimport { describe, test } from \'vitest\''
    out += '\nimport { steps } from \'./' + name + '.steps\''
    out += '\nexport type Steps<T = any> = {'
    out += '\n  enable: boolean'
    out += '\n  Before?: () => Promise<T|undefined>'
    out += '\n  BaseGiven?: (state: T) => Promise<T|undefined>'
    out += createScenarioDefinitions(feature, propNames)
    out += createTableDefinitions(feature, propNames)
    out += '\n}'
    out +=
      '\ndescribe.skipIf(!steps.enable)' +
      '(\'' +
      feature.name +
      '\', () => {'
    out += createScenarioTests(feature)
    out += createTableTests(feature)
    out += '\n})'

    writeFile(path.join(dir, `${name}.test.ts`), out)
    testFiles.push(path.join(dir, `${name}.test.ts`))
    if (!fs.existsSync(path.join(dir, `${name}.steps.ts`))) {
      let implementation = `import { Steps } from './${name}.test'`
      implementation += '\nexport const steps: Steps = {'
      implementation += '\n  enable: false,'
      const keys = Object.keys(propNames)
      keys.sort()
      keys.forEach((key) => {
        implementation += `\n  "${key}": async ${propNames[key] ? 'state' : '()'} => {debugger ;throw "Not implemented"},`
      })
      implementation += '\n}'

      writeFile(path.join(dir, `${name}.steps.ts`), implementation)
    }
  }
  const existingTestFiles = glob.sync(`${dir}/**/*.test.ts`)
  const filtered = existingTestFiles.filter(t => !testFiles.includes(t))
  filtered.forEach(f => fs.rmSync(f))
}
