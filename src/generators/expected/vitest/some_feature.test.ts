// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { describe, test } from 'vitest'
import { steps } from './some_feature.steps'
export type Steps<T = any> = {
  enable: boolean
  Before?: () => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
  'Action: Cancel': (state: T) => Promise<void>
  'Action: Take action': (state: T) => Promise<void>
  'Given A or B': (state: T, value: 'A'|'B') => Promise<void>
  'Given Errors from demo': (state: T, value: 'no'|'yes') => Promise<void>
  'Message: Could not load page': (state: T) => Promise<void>
  'Message: Display stuff': (state: T) => Promise<void>
  'Script: Clear page': (state: T) => Promise<void>
  'Script: Hide box': (state: T) => Promise<void>
  'Script: Show box': (state: T) => Promise<void>
  'ServiceCall: api call demo': (state: T) => Promise<void>
  'SignalSend: Go back to registration page': (state: T) => Promise<void>
  'Subprocess: Saved payee Yet another subflow': (state: T) => Promise<void>
  'Subprocess: Some subflow': (state: T) => Promise<void>
  'Subprocess: Validate fields Payment data': (state: T) => Promise<void>
  'Validate Gatuadress: Input field, RequiredString Format 135 characters, ': () => Promise<void>
  'Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Sverige': () => Promise<void>
  'Validate Mottagarens namn: Input field, RequiredString Format 135 characters, ': () => Promise<void>
  'Validate Postnummer: Input field, Required String Format 135 characters, ': () => Promise<void>
}
describe.skipIf(!steps.enable)('Some feature', () => {
  test('api call demo Display stuff Some subflow Validate fields Payment data - no A', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'A')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Subprocess: Some subflow'](state)
    await steps['Subprocess: Validate fields Payment data'](state)
  })
  test('api call demo Display stuff Show box Cancel Clear page - no B', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Script: Show box'](state)
    await steps['Action: Cancel'](state)
    await steps['Script: Clear page'](state)
  })
  test('api call demo Display stuff Show box Take action Hide box Saved payee Yet another subflow - no B', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Script: Show box'](state)
    await steps['Action: Take action'](state)
    await steps['Script: Hide box'](state)
    await steps['Subprocess: Saved payee Yet another subflow'](state)
  })
  test('api call demo Display stuff Show box Validate fields Payment data - no B', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Script: Show box'](state)
    await steps['Subprocess: Validate fields Payment data'](state)
  })
  test('api call demo Could not load page - yes', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Could not load page'](state)
  })
  test("Validate Gatuadress", async ()=>await steps["Validate Gatuadress: Input field, RequiredString Format 135 characters, "]())
  test("Validate Land", async ()=>await steps["Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Sverige"]())
  test("Validate Mottagarens namn", async ()=>await steps["Validate Mottagarens namn: Input field, RequiredString Format 135 characters, "]())
  test("Validate Postnummer", async ()=>await steps["Validate Postnummer: Input field, Required String Format 135 characters, "]())
})
