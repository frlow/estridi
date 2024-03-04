// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { test, Page, BrowserContext } from '@playwright/test'
import { steps } from './some_feature.steps'
export type Steps<T extends {page: Page, context: BrowserContext} = {page: Page, context: BrowserContext}> = {
  enable: boolean
  Before?: (args: {page: Page, context: BrowserContext}) => Promise<T>
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
  'Validate Gatuadress: Input field, RequiredString Format 135 characters, ': (state: {page: Page, context: BrowserContext}) => Promise<void>
  'Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Sverige': (state: {page: Page, context: BrowserContext}) => Promise<void>
  'Validate Mottagarens namn: Input field, RequiredString Format 135 characters, ': (state: {page: Page, context: BrowserContext}) => Promise<void>
  'Validate Postnummer: Input field, Required String Format 135 characters, ': (state: {page: Page, context: BrowserContext}) => Promise<void>
}
test.describe('Some feature', () => {
  test.skip(!steps.enable)
  test('api call demo Display stuff Some subflow Validate fields Payment data - no A', async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}) : {page, context}
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'A')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Subprocess: Some subflow'](state)
    await steps['Subprocess: Validate fields Payment data'](state)
  })
  test('api call demo Display stuff Show box Cancel Clear page - no B', async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}) : {page, context}
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Script: Show box'](state)
    await steps['Action: Cancel'](state)
    await steps['Script: Clear page'](state)
  })
  test('api call demo Display stuff Show box Take action Hide box Saved payee Yet another subflow - no B', async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}) : {page, context}
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
  test('api call demo Display stuff Show box Validate fields Payment data - no B', async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}) : {page, context}
    await steps['Given Errors from demo'](state,'no')
    await steps['Given A or B'](state,'B')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Display stuff'](state)
    await steps['Script: Show box'](state)
    await steps['Subprocess: Validate fields Payment data'](state)
  })
  test('api call demo Could not load page - yes', async ({page, context}) => {
    let state: any = steps.Before ? await steps.Before({page, context}) : {page, context}
    await steps['Given Errors from demo'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['ServiceCall: api call demo'](state)
    await steps['Message: Could not load page'](state)
  })
  test("Validate Gatuadress", async ({page, context})=>await steps["Validate Gatuadress: Input field, RequiredString Format 135 characters, "]({page, context}))
  test("Validate Land", async ({page, context})=>await steps["Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Sverige"]({page, context}))
  test("Validate Mottagarens namn", async ({page, context})=>await steps["Validate Mottagarens namn: Input field, RequiredString Format 135 characters, "]({page, context}))
  test("Validate Postnummer", async ({page, context})=>await steps["Validate Postnummer: Input field, Required String Format 135 characters, "]({page, context}))
})
