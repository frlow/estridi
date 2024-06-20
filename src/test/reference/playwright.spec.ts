import { test, Page, BrowserContext } from '@playwright/test'
import { createTester, Handles, loadScraped } from 'estridi'
import { handles, State } from './playwright.handles.js'
const scraped = loadScraped()
const { testNode, getVariants } = createTester(scraped, '3085:4043', handles)
const t = (id: string) => () => {
  for (const variant of getVariants(id))
    test(variant, ({ context, page }) =>
      testNode(id, { context, page, variant })
    )
}
test.describe('playwright', () => {
  test.describe('message: Could not load page, 3085:4054', t('3085:4054'))
  test.describe('message: Could not load page, 3085:4090', t('3085:4090'))
  test.describe('message: Show Sections Från Till Betalning Granska Godkänn, 3229:5359', t('3229:5359'))
  test.describe('message: Could not load page, 3085:4080', t('3085:4080'))
  test.describe('script: Open section Från, 3229:5382', t('3229:5382'))
  test.describe('subprocess: Display fields Payer data, 3229:5394', t('3229:5394'))
  test.describe('subprocess: Validate fields Payer data, 3229:5526', t('3229:5526'))
  test.describe('script: Hide button Fortsätt, 3501:5498', t('3501:5498'))
  test.describe('message: Show Payer data validation errors, 3088:5070', t('3088:5070'))
  test.describe('script: Open section Till, 3229:5589', t('3229:5589'))
  test.describe('subprocess: Display fields New recipient data, 3088:5337', t('3088:5337'))
  test.describe('script: Set IBAN BBAN label to IBAN, 3088:5551', t('3088:5551'))
  test.describe('script: Hide BIC SWIFT field, 3088:5558', t('3088:5558'))
  test.describe('signalSend: https www lansforsakringar se 49bd3e globalassets aa global dokument information landinformation pdf, 3088:5333', t('3088:5333'))
  test.describe('script: Show BIC SWIFT or National ID AND Show BBAN, 3088:5346', t('3088:5346'))
  test.describe('subprocess: Validate fields recipient data, 3088:5196', t('3088:5196'))
  test.describe('script: IBAN length is applied to field and infotext is updated, 4893:6573', t('4893:6573'))
  test.describe('script: Show BIC SWIFT field required AND Show BBAN, 3088:5348', t('3088:5348'))
  test.describe('message: Show errors, 3088:5216', t('3088:5216'))
  test.describe('script: Show BIC SWIFT field optional AND Show IBAN, 3088:5347', t('3088:5347'))
  test.describe('script: Hide BIC SWIFT field AND Show IBAN, 3088:5345', t('3088:5345'))
  test.describe('script: Open section Betalning, 3229:5682', t('3229:5682'))
  test.describe('subprocess: Display fields Payment data, 3088:5982', t('3088:5982'))
  test.describe('script: Show avgift section, 3885:5933', t('3885:5933'))
  test.describe('script: Hide avgift section, 3885:5932', t('3885:5932'))
  test.describe('script: Open info about avgift, 3781:5751', t('3781:5751'))
  test.describe('subprocess: Validate fields Payment data, 3229:5714', t('3229:5714'))
  test.describe('script: Open info about currency, 3781:5673', t('3781:5673'))
  test.describe('script: Set currencyCode to SEK, 3781:5651', t('3781:5651'))
  test.describe('message: Show ISO Curency Code in Amount field, 3088:6182', t('3088:6182'))
  test.describe('message: Show errors, 3229:5733', t('3229:5733'))
  test.describe('script: Show betalningsreferens, 3088:6009', t('3088:6009'))
  test.describe('script: Hide betalningsreferens, 3088:6006', t('3088:6006'))
  test.describe('signalSend: https www lansforsakringar se 49334d globalassets aa global dokument prislistor 08198 prislista privat pdf, 3781:5750', t('3781:5750'))
  test.describe('signalSend: https www lansforsakringar se 48efa3 globalassets aa global dokument information landinformation pdf, 4238:4585', t('4238:4585'))
  test.describe('signalSend: https www dnb se se sv markets valuta rentor kurslista overforing daglig, 3088:6241', t('3088:6241'))
  test.describe('message: Display correct errors for incorrect fields, 3895:5990', t('3895:5990'))
  test.describe('message: Show Modal Validated recipient fields, 3895:6006', t('3895:6006'))
  test.describe('message: Show Last 3 Alert Messages, 4893:6322', t('4893:6322'))
  test.describe('message: Show All Alert Messages, 4893:6282', t('4893:6282'))
  test.describe('script: Close recipient summary modal, 3973:6779', t('3973:6779'))
  test.describe('subprocess: view security authentication id2, 3895:6017', t('3895:6017'))
  test.describe('message: Show error, 3895:6015', t('3895:6015'))
  test.describe('script: Close recipient signing modal, 3895:6032', t('3895:6032'))
  test.describe('message: Display some error, 3904:6623', t('3904:6623'))
  test.describe('subprocess: Payment summary page, 3895:6028', t('3895:6028'))
})

export type GatewayKey =
  | '3085:4045: Error from getaccounts'
  | '3085:4084: Error from countries'
  | '3085:4078: Error from currencies'
  | '3230:5492: Errors from validation'
  | '3088:4937: Has saved recipients'
  | '3088:5349: Is country US AU CA'
  | '3088:5350: is ibanLength 0'
  | '3088:5214: Any validation errors'
  | '3088:5354: Is country EU EES'
  | '3088:5984: Is country EU EES'
  | '3229:5732: Any validation errors'
  | '3885:5897: Is currencyCode EUR AND countryCode EU ESS'
  | '3895:5989: Error from validate service'
  | '4894:4493: More than three alert messages'
  | '3895:5998: Any errors'
  | '3904:6572: Is status completed'
export type ServiceCallKey =
  | '3085:4044: im json overview getaccounts ESB bank deposit getAccounts 201411'
  | '3085:4083: bank payment crossborder countries'
  | '3085:4073: bank payment crossborder currencies'
  | '3895:5983: bank payment crossborder crossborder payments'
  | '3895:5997: POST payee sign'
  | '3903:6495: POST payee execute'
export type ActionKey =
  | '3085:4575: Fortsätt clicked'
  | '3088:5366: Link to countries you can send to'
  | '3088:5344: Select country'
  | '3088:5162: Fortsätt clicked'
  | '3781:5749: Vad ska jag betala för avgift clicked'
  | '3088:6367: Signera mottagre Lägg till button clicked'
  | '3088:6230: Vad ska jag välja clicked'
  | '3088:6206: Belopp i SEK checked'
  | '3088:6184: Select currency'
  | '3781:5754: Prislista clicked'
  | '4238:4522: Landinformation Clicked'
  | '3781:5710: Aktuella preliminära vauta kurser clicked'
  | '3895:6010: Signera clicked'
  | '3895:6007: Avbryt clicked'
  | '3973:6900: Signing completed'
  | '3974:3970: Cancel signing'
export type TestNodeKey =
  | '3085:4054: Could not load page'
  | '3085:4090: Could not load page'
  | '3229:5359: Show Sections Från Till Betalning Granska Godkänn'
  | '3085:4080: Could not load page'
  | '3229:5382: Open section Från'
  | '3229:5394: Display fields Payer data'
  | '3229:5526: Validate fields Payer data'
  | '3501:5498: Hide button Fortsätt'
  | '3088:5070: Show Payer data validation errors'
  | '3229:5589: Open section Till'
  | '3088:5337: Display fields New recipient data'
  | '3088:5551: Set IBAN BBAN label to IBAN'
  | '3088:5558: Hide BIC SWIFT field'
  | '3088:5333: https www lansforsakringar se 49bd3e globalassets aa global dokument information landinformation pdf'
  | '3088:5346: Show BIC SWIFT or National ID AND Show BBAN'
  | '3088:5196: Validate fields recipient data'
  | '4893:6573: IBAN length is applied to field and infotext is updated'
  | '3088:5348: Show BIC SWIFT field required AND Show BBAN'
  | '3088:5216: Show errors'
  | '3088:5347: Show BIC SWIFT field optional AND Show IBAN'
  | '3088:5345: Hide BIC SWIFT field AND Show IBAN'
  | '3229:5682: Open section Betalning'
  | '3088:5982: Display fields Payment data'
  | '3885:5933: Show avgift section'
  | '3885:5932: Hide avgift section'
  | '3781:5751: Open info about avgift'
  | '3229:5714: Validate fields Payment data'
  | '3781:5673: Open info about currency'
  | '3781:5651: Set currencyCode to SEK'
  | '3088:6182: Show ISO Curency Code in Amount field'
  | '3229:5733: Show errors'
  | '3088:6009: Show betalningsreferens'
  | '3088:6006: Hide betalningsreferens'
  | '3781:5750: https www lansforsakringar se 49334d globalassets aa global dokument prislistor 08198 prislista privat pdf'
  | '4238:4585: https www lansforsakringar se 48efa3 globalassets aa global dokument information landinformation pdf'
  | '3088:6241: https www dnb se se sv markets valuta rentor kurslista overforing daglig'
  | '3895:5990: Display correct errors for incorrect fields'
  | '3895:6006: Show Modal Validated recipient fields'
  | '4893:6322: Show Last 3 Alert Messages'
  | '4893:6282: Show All Alert Messages'
  | '3973:6779: Close recipient summary modal'
  | '3895:6017: view security authentication id2'
  | '3895:6015: Show error'
  | '3895:6032: Close recipient signing modal'
  | '3904:6623: Display some error'
  | '3895:6028: Payment summary page'
export type TableKeys =
  | '3088:5874: Recipient Data'
  | '3088:6484: Payment Data'
  | '3230:5359: Payer Data'

export type PlaywrightHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  {page: Page, context: BrowserContext},
  TableKeys
>
