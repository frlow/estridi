// WARNING!!
// this file is auto-generated and will change when updating the system design
// don't change this file!

import { describe, test } from 'vitest'
import { steps } from './fields_new_recipient_data.steps'
export type Steps<T = any> = {
  enable: boolean
  Before?: () => Promise<T>
  BaseGiven?: (state: T) => Promise<void>
  'Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Välj land': () => Promise<void>
  'Validate Mottagarens fullständiga namn: Input field, RequiredString Format 135 characters, ': () => Promise<void>
  'Validate Gatuadress: Input field, RequiredString Format 135 characters, ': () => Promise<void>
  'Validate Postnummer: Input field, Required String Format 135 characters, ': () => Promise<void>
}
describe.skipIf(!steps.enable)('Fields: New recipient data', () => {
  test("Validate Land", async ()=>await steps["Validate Land: DropdownInputSelectDesktop, RequiredString Format 12 characters, Default value Välj land"]())
  test("Validate Mottagarens fullständiga namn", async ()=>await steps["Validate Mottagarens fullständiga namn: Input field, RequiredString Format 135 characters, "]())
  test("Validate Gatuadress", async ()=>await steps["Validate Gatuadress: Input field, RequiredString Format 135 characters, "]())
  test("Validate Postnummer", async ()=>await steps["Validate Postnummer: Input field, Required String Format 135 characters, "]())
})