// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { describe, test } from 'vitest'
import { steps } from './540466_user_story_select_account.steps'
export type Steps<T = any> = {
  enable: boolean
  Before?: () => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
  'Given Errors from demo': (state: T, value: 'no'|'yes') => Promise<void>
  'Then ServiceCall: api call demo': (state: T) => Promise<void>
  'Then Message: Could not load page': (state: T) => Promise<void>
  'Given A or B': (state: T, value: 'A'|'B') => Promise<void>
  'Then Message: Display stuff': (state: T) => Promise<void>
  'Then Subprocess: Some subflow': (state: T) => Promise<void>
  'Then Subprocess: Validate fields Payment data': (state: T) => Promise<void>
  'Then Script: Some script': (state: T) => Promise<void>
  'When Take action': (state: T) => Promise<void>
  'Then Script: Show something': (state: T) => Promise<void>
  'Then Subprocess: Saved payee Yet another subflow': (state: T) => Promise<void>
  'When Cancel': (state: T) => Promise<void>
  'Then Script: Clear page': (state: T) => Promise<void>
  'Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Sverige': () => Promise<void>
  'Validate Mottagarens namn: Input field, RequiredString Format 135 characters, ': () => Promise<void>
  'Validate Gatuadress: Input field, RequiredString Format 135 characters, ': () => Promise<void>
  'Validate Postnummer: Input field, Required String Format 135 characters, ': () => Promise<void>
}
describe.skipIf(!steps.enable)('540466 User Story: Select Account', () => {
  test('api call demo Could not load page  -  yes', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then ServiceCall: api call demo'](state)
    await steps['Then Message: Could not load page'](state)
  })
  test('api call demo Display stuff Some subflow Validate fields Payment data  -  no A', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'A')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then ServiceCall: api call demo'](state)
    await steps['Then Message: Display stuff'](state)
    await steps['Then Subprocess: Some subflow'](state)
    await steps['Then Subprocess: Validate fields Payment data'](state)
  })
  test('api call demo Display stuff Some script Validate fields Payment data  -  no B', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then ServiceCall: api call demo'](state)
    await steps['Then Message: Display stuff'](state)
    await steps['Then Script: Some script'](state)
    await steps['Then Subprocess: Validate fields Payment data'](state)
  })
  test('Take action api call demo Display stuff Some script Show something Saved payee Yet another subflow  -  no B', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['When Take action'](state)
    await steps['Then ServiceCall: api call demo'](state)
    await steps['Then Message: Display stuff'](state)
    await steps['Then Script: Some script'](state)
    await steps['Then Script: Show something'](state)
    await steps['Then Subprocess: Saved payee Yet another subflow'](state)
  })
  test('Cancel api call demo Display stuff Some script Clear page  -  no B', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['When Cancel'](state)
    await steps['Then ServiceCall: api call demo'](state)
    await steps['Then Message: Display stuff'](state)
    await steps['Then Script: Some script'](state)
    await steps['Then Script: Clear page'](state)
  })
  test("Validate Land", async ()=>await steps["Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Sverige"]())
  test("Validate Mottagarens namn", async ()=>await steps["Validate Mottagarens namn: Input field, RequiredString Format 135 characters, "]())
  test("Validate Gatuadress", async ()=>await steps["Validate Gatuadress: Input field, RequiredString Format 135 characters, "]())
  test("Validate Postnummer", async ()=>await steps["Validate Postnummer: Input field, Required String Format 135 characters, "]())
})