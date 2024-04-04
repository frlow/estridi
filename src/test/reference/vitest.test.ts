import { test, describe } from 'vitest'
import { createTester, Handles } from 'estridi'
import scraped from './scraped.json'
import { handles, State } from './vitest.handles.js'
const { allPaths, testNode, testPath } = createTester(scraped, '3085:4043', handles)
const t = (id: string) => () => testNode(id)
describe('vitest', () => {
  test('message: Could not load page, 3085:4054', t('3085:4054'))
  test('message: Could not load page, 3085:4090', t('3085:4090'))
  test('message: Could not load page, 3085:4080', t('3085:4080'))
  test('message: Could not load page, 3085:4375', t('3085:4375'))
  test('message: Show Sections Från Till Betalning Granska Godkänn, 3229:5359', t('3229:5359'))
  test('message: Could not load page, 3085:4378', t('3085:4378'))
  test('script: Open section Från, 3229:5382', t('3229:5382'))
  test('subprocess: Display fields Payer data, 3229:5394', t('3229:5394'))
  test('subprocess: Validate fields Payer data, 3229:5526', t('3229:5526'))
  test('script: Hide button Fortsätt, 3501:5498', t('3501:5498'))
  test('message: Show Payer data validation errors, 3088:5070', t('3088:5070'))
  test('script: Open section Till, 3229:5589', t('3229:5589'))
  test('script: Hide radiobuttons Hide saved recipient dropdown, 3088:4958', t('3088:4958'))
  test('script: Show radiobuttons New saved recipient, 3088:4945', t('3088:4945'))
  test('script: Hide saved payee information Hide saved payee drop down, 3088:4994', t('3088:4994'))
  test('subprocess: Display fields New recipient data, 3088:5337', t('3088:5337'))
  test('script: Set IBAN BBAN label to IBAN, 3088:5551', t('3088:5551'))
  test('script: Hide fields New recipient data, 3088:5680', t('3088:5680'))
  test('script: Hide BIC SWIFT field, 3088:5558', t('3088:5558'))
  test('script: Hide custom name input field, 3088:5570', t('3088:5570'))
  test('script: Set dropdown to Välj No preselection, 3088:5690', t('3088:5690'))
  test('script: Preselect saved recipient, 3088:5788', t('3088:5788'))
  test('message: Show payee information, 3088:5822', t('3088:5822'))
  test('script: Show custom name input field, 3088:5334', t('3088:5334'))
  test('message: Show payee information, 3088:5679', t('3088:5679'))
  test('script: Hide BIC SWIFT field AND Show IBAN, 3088:5345', t('3088:5345'))
  test('subprocess: Validate fields recipient data, 3088:5196', t('3088:5196'))
  test('script: Show BIC SWIFT or National ID AND Show BBAN, 3088:5346', t('3088:5346'))
  test('script: Show BIC SWIFT field required AND Show BBAN, 3088:5348', t('3088:5348'))
  test('script: Show BIC SWIFT field optional AND Show IBAN, 3088:5347', t('3088:5347'))
  test('message: Show errors, 3088:5216', t('3088:5216'))
  test('script: Open section Betalning, 3229:5682', t('3229:5682'))
  test('subprocess: Display fields Payment data, 3088:5982', t('3088:5982'))
  test('script: Show betalningsreferens, 3088:6009', t('3088:6009'))
  test('script: Hide betalningsreferens, 3088:6006', t('3088:6006'))
  test('script: Fee to non changeable, 3088:5996', t('3088:5996'))
  test('script: Fee to changeable, 3088:5998', t('3088:5998'))
  test('message: Set ISO Curency Code in Amount field to SEK, 3088:6205', t('3088:6205'))
  test('message: Show ISO Curency Code in Amount field, 3088:6182', t('3088:6182'))
  test('script: Set label on button to Granska betalning, 3088:6917', t('3088:6917'))
  test('script: Set label on button to Signera mottagare, 3088:6900', t('3088:6900'))
  test('subprocess: Validate fields Payment data, 3229:5714', t('3229:5714'))
  test('subprocess: Validate payment, 3088:5993', t('3088:5993'))
  test('message: Show errors, 3229:5733', t('3229:5733'))
  if (process.env.TEST_ALL_PATHS === 'true')
    describe('all paths', () => {
      for (const path of allPaths) {
        test(path.join(', '), () => testPath(path))
      }
    })
})

export type GatewayKey =
  | '3085:4045: Error from getaccounts'
  | '3085:4084: Error from countries'
  | '3085:4078: Error from currencies'
  | '3085:4374: Error from savedPayees'
  | '3085:4376: Error from listDrafts'
  | '3230:5492: Errors from validation'
  | '3088:4937: Has saved recipients'
  | '3088:5770: more than one saved recipient'
  | '3088:5354: Is country EU EES'
  | '3088:5349: Is country US AU CA'
  | '3088:5350: is ibanLength 0'
  | '3088:5214: Any validation errors'
  | '3088:5984: Is country Is EU EES'
  | '3088:6897: New recipient'
  | '3229:5732: Any validation errors'
export type ServiceCallKey =
  | '3085:4044: im json overview getaccounts ESB bank deposit getAccounts 201411'
  | '3085:4083: bank payment crossborder countries'
  | '3085:4073: bank payment crossborder currencies'
  | '3085:4362: getSavedPayees not created yet'
  | '3085:4352: business payment listdraftforeignpayment v1 0'
export type ActionKey =
  | '3085:4575: Fortsätt clicked'
  | '3088:4993: Select new recipient'
  | '3088:4992: Select existing recipient'
  | '3088:5370: Save payee Checkbox checked'
  | '3088:5366: Link to countries you can send to'
  | '3088:5344: Select country'
  | '3088:5687: Select payee'
  | '3088:5162: Fortsätt clicked'
  | '3088:6259: Vilka avgifter finns det link clicked'
  | '3088:6230: Vad ska jag välja link clicked'
  | '3088:6206: Belopp i SEK checked'
  | '3088:6184: Select currency'
  | '3088:6367: Signera mottagre Lägg till button clicked'
export type TestNodeKey =
  | '3085:4054: Could not load page'
  | '3085:4090: Could not load page'
  | '3085:4080: Could not load page'
  | '3085:4375: Could not load page'
  | '3229:5359: Show Sections Från Till Betalning Granska Godkänn'
  | '3085:4378: Could not load page'
  | '3229:5382: Open section Från'
  | '3229:5394: Display fields Payer data'
  | '3229:5526: Validate fields Payer data'
  | '3501:5498: Hide button Fortsätt'
  | '3088:5070: Show Payer data validation errors'
  | '3088:4584: Register recipient page'
  | '3229:5589: Open section Till'
  | '3088:4958: Hide radiobuttons Hide saved recipient dropdown'
  | '3088:4945: Show radiobuttons New saved recipient'
  | '3088:6277: New payee information'
  | '3088:4994: Hide saved payee information Hide saved payee drop down'
  | '3088:4996: Saved payee information'
  | '3088:5337: Display fields New recipient data'
  | '3088:4999: New payee information'
  | '3088:5551: Set IBAN BBAN label to IBAN'
  | '3088:5680: Hide fields New recipient data'
  | '3088:5558: Hide BIC SWIFT field'
  | '3088:5570: Hide custom name input field'
  | '3088:5690: Set dropdown to Välj No preselection'
  | '3088:5788: Preselect saved recipient'
  | '3088:5822: Show payee information'
  | '3088:5334: Show custom name input field'
  | '3088:5679: Show payee information'
  | '3088:5345: Hide BIC SWIFT field AND Show IBAN'
  | '3088:5196: Validate fields recipient data'
  | '3088:5346: Show BIC SWIFT or National ID AND Show BBAN'
  | '3088:5348: Show BIC SWIFT field required AND Show BBAN'
  | '3088:5347: Show BIC SWIFT field optional AND Show IBAN'
  | '3088:4771: Payment information page'
  | '3088:5216: Show errors'
  | '3229:5682: Open section Betalning'
  | '3088:5982: Display fields Payment data'
  | '3088:6009: Show betalningsreferens'
  | '3088:6006: Hide betalningsreferens'
  | '3088:5996: Fee to non changeable'
  | '3088:5998: Fee to changeable'
  | '3088:6205: Set ISO Curency Code in Amount field to SEK'
  | '3088:6182: Show ISO Curency Code in Amount field'
  | '3088:6917: Set label on button to Granska betalning'
  | '3088:6900: Set label on button to Signera mottagare'
  | '3229:5714: Validate fields Payment data'
  | '3088:5993: Validate payment'
  | '3229:5733: Show errors'
export type TableKeys =
  | '3088:5874: Recipient Data'
  | '3230:5359: Payer Data'

export type VitestHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  void,
  TableKeys
>
