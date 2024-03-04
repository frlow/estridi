import { Feature } from '../figma/feature'
import { GenerationResult, getFileName } from './index'
import * as path from 'node:path'
// import * as fs from 'node:fs'
// import * as path from 'node:path'
// import * as glob from 'glob'

type PropNames = Record<string, string>
const tableValueCutoff = 50
const createScenarioDefinitions = (feature: Feature, propNames: PropNames) => {
  const propNamesTemp: PropNames = {}
  let text = ''
  const givenValues: Record<string, Record<string, boolean>> = {}
  for (const scenario of feature.scenarios) {
    for (const given of scenario.given) {
      const key = `Given ${given.text}`
      propNamesTemp[key] = '(state, value)'
      givenValues[key] = { ...givenValues[key], [given.value || 'N/A']: true }
    }
    for (const when of scenario.when) propNamesTemp[`When ${when.text}`] = 'state'
    for (const then of scenario.then) propNamesTemp[`Then ${getThenLabel(then.type)}: ${then.text}`] = 'state'
  }
  Object.keys(propNamesTemp).forEach((key) => {
    text += `\n  '${key}': (state: T${givenValues[key] ? `, value: ${Object.keys(givenValues[key]).sort().map(k => `'${k}'`).join('|')}` : ''}) => Promise<void>`
  })
  Object.keys(propNamesTemp).forEach(key => propNames[key] = propNamesTemp[key])
  return text
}

const createTableDefinitions = (feature: Feature, propNames: PropNames) => {
  const propNamesTemp: PropNames = {}
  let text = ''
  for (const table of feature.tables)
    for (const row of table.rows)
      propNamesTemp[`Validate ${row.label}: ${row.values.map(v => v.substring(0, tableValueCutoff)).join(', ')}`] = '()'
  Object.keys(propNamesTemp).forEach((key) =>
    text += `\n  '${key}': () => Promise<void>`
  )
  Object.keys(propNamesTemp).forEach(key => propNames[key] = propNamesTemp[key])
  return text
}

const getThenLabel = (type: string) => {
  switch (type) {
    case 'message':
      return 'Message'
    case 'serviceCall':
      return 'ServiceCall'
    case 'script':
      return 'Script'
    case "subprocess":
      return "Subprocess"
    default:
      return 'N/A'
  }
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
        '\n    await steps[\'Given ' +
        given.text +
        `\'](state,'${given.value}')`
    text +=
      '\n    if (steps.BaseGiven) await steps.BaseGiven(state)'
    for (const when of scenario.when)
      text +=
        '\n    await steps[\'When ' + when.text + '\'](state)'
    for (const then of scenario.then)
      text +=
        '\n    await steps[\'Then ' + getThenLabel(then.type) + ': ' + then.text + '\'](state)'
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

export const generateVitest = (dir: string, features: Feature[]): GenerationResult[] => {
  // const testFiles: string[] = []
  const ret: GenerationResult[] = []
  for (const feature of features) {
    const propNames: PropNames = {}
    const name = getFileName(feature.name)
    let out = '// WARNING!!'
    out +=
      '\n// this file is auto-generated and will change when updating the system design'
    out += '\n// don\'t change this file!\n'
    out += '\nimport { describe, test } from \'vitest\''
    out += '\nimport { steps } from \'./' + name + '.steps\''
    out += '\nexport type Steps<T = any> = {'
    out += '\n  enable: boolean'
    out += '\n  Before?: () => Promise<T>'
    out += '\n  BaseGiven?: (state: T) => Promise<void>'
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


    ret.push({ file: path.join(dir, `${name}.test.ts`), content: out, overwrite: true })
    // writeFile(path.join(dir, `${name}.test.ts`), out)
    // testFiles.push(path.join(dir, `${name}.test.ts`))
    // if (!fs.existsSync(path.join(dir, `${name}.steps.ts`))) {
    let implementation = `import { Steps } from './${name}.test'`
    implementation += '\nexport const steps: Steps = {'
    implementation += '\n  enable: false,'
    const keys = Object.keys(propNames)
    keys.sort()
    keys.forEach((key) => {
      implementation += `\n  "${key}": async ${propNames[key]} => {debugger ;throw "Not implemented"},`
    })
    implementation += '\n}'
    ret.push({ file: path.join(dir, `${name}.steps.ts`), content: implementation, overwrite: false })
    // writeFile(path.join(dir, `${name}.steps.ts`), implementation)
  }
// const existingTestFiles = glob.sync(`${dir}/**/*.test.ts`)
// const filtered = existingTestFiles.filter(t => !testFiles.includes(t))
// filtered.forEach(f => fs.rmSync(f))
  return ret
}
