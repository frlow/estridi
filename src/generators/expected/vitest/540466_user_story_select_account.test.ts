// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { describe, test } from 'vitest'
import { steps } from './540466_user_story_select_account.steps'
export type Steps<T = any> = {
  enable: boolean
  Before?: () => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
  'Given Error from getaccounts': (state: T, value: 'no'|'yes') => Promise<void>
  'Then im json overview getaccounts ESB bank deposit getAccounts 201411': (state: T) => Promise<void>
  'Then Could not load page': (state: T) => Promise<void>
  'Given Error from savedPayees': (state: T, value: 'no'|'yes') => Promise<void>
  'Then Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance': (state: T) => Promise<void>
  'Given Error from listDrafts': (state: T, value: 'no'|'yes') => Promise<void>
  'Then business payment listdraftforeignpayment v1 0': (state: T) => Promise<void>
  'Given Has recipients': (state: T, value: 'no'|'yes') => Promise<void>
  'Then Hide radiobuttons Hide saved recipient dropdown': (state: T) => Promise<void>
  'Then Show radiobuttons New saved recipient': (state: T) => Promise<void>
}
describe.skipIf(!steps.enable)('540466 User Story: Select Account', () => {
  test('im json overview getaccounts ESB bank deposit getAccounts 201411 Could not load page  -  yes', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Error from getaccounts'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then im json overview getaccounts ESB bank deposit getAccounts 201411'](state)
    await steps['Then Could not load page'](state)
  })
  test('im json overview getaccounts ESB bank deposit getAccounts 201411 Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance Could not load page  -  no yes', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Error from getaccounts'](state,'no')
    await steps['Given Error from savedPayees'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then im json overview getaccounts ESB bank deposit getAccounts 201411'](state)
    await steps['Then Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance'](state)
    await steps['Then Could not load page'](state)
  })
  test('im json overview getaccounts ESB bank deposit getAccounts 201411 Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance business payment listdraftforeignpayment v1 0 Could not load page  -  no no yes', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Error from getaccounts'](state,'no')
    await steps['Given Error from savedPayees'](state,'no')
    await steps['Given Error from listDrafts'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then im json overview getaccounts ESB bank deposit getAccounts 201411'](state)
    await steps['Then Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance'](state)
    await steps['Then business payment listdraftforeignpayment v1 0'](state)
    await steps['Then Could not load page'](state)
  })
  test('im json overview getaccounts ESB bank deposit getAccounts 201411 Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance business payment listdraftforeignpayment v1 0 Hide radiobuttons Hide saved recipient dropdown  -  no no no no', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Error from getaccounts'](state,'no')
    await steps['Given Error from savedPayees'](state,'no')
    await steps['Given Error from listDrafts'](state,'no')
    await steps['Given Has recipients'](state,'no')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then im json overview getaccounts ESB bank deposit getAccounts 201411'](state)
    await steps['Then Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance'](state)
    await steps['Then business payment listdraftforeignpayment v1 0'](state)
    await steps['Then Hide radiobuttons Hide saved recipient dropdown'](state)
  })
  test('im json overview getaccounts ESB bank deposit getAccounts 201411 Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance business payment listdraftforeignpayment v1 0 Show radiobuttons New saved recipient  -  no no no yes', async () => {
    let state: any = steps.Before ? await steps.Before() : undefined
    await steps['Given Error from getaccounts'](state,'no')
    await steps['Given Error from savedPayees'](state,'no')
    await steps['Given Error from listDrafts'](state,'no')
    await steps['Given Has recipients'](state,'yes')
    if (steps.BaseGiven) await steps.BaseGiven(state)
    await steps['Then im json overview getaccounts ESB bank deposit getAccounts 201411'](state)
    await steps['Then Show fromAccounts AccountNumber DefinedAccount Name CurrentBalance'](state)
    await steps['Then business payment listdraftforeignpayment v1 0'](state)
    await steps['Then Show radiobuttons New saved recipient'](state)
  })
})
