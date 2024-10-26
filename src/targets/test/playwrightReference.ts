import { BrowserContext, Page, test } from '@playwright/test'
import { handles } from './main.js'

test.describe('main', () => {
  test('Could not load page', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_couldNotLoadPage(args)
  })
  test('No available accounts', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_noAvailableAccounts(args)
  })
  test('Display Sections Från Till Betalning Granska Godkänn', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_displaySectionsFranTillBetalningGranskaGodkann(args)
  })
  test('Display dropdown Välj Konto with values account number account currenctBalance account name account availableBalance', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_displayDropdownValjKontoWithValuesAccountNumberAccountCurrenctbalanceAccountNameAccountAvailablebalance(args)
  })
  test('Open section Från', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_openSectionFran(args)
  })
  test('Hide button Fortsätt', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_hideButtonFortsatt(args)
  })
  test('Open section Till', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_openSectionTill(args)
  })
  test('Display Mottagarens fullstndiga namn Adress', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayMottagarensFullstndigaNamnAdress(args)
  })
  test('Display dropdown Land country name', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayDropdownLandCountryName(args)
  })
  test('Display Kontonummer with label IBAN', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayKontonummerWithLabelIban(args)
  })
  test('Clear validation errors for Kontonummer Banknummer', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_clearValidationErrorsForKontonummerBanknummer(args)
  })
  test('Show BIC SWIFT NID infotext', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBicSwiftNidInfotext(args)
  })
  test('Set Kontonummer field label to BBAN', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setKontonummerFieldLabelToBban(args)
  })
  test('*Show Banknummer field', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBanknummerField(args)
  })
  test('Set Banknummer field label to BIC SWIFT eller Nationellt ID', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setBanknummerFieldLabelToBicSwiftEllerNationelltId(args)
  })
  test('Show country ibanLength and update infotext', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showCountryIbanlengthAndUpdateInfotext(args)
  })
  test('*Set Kontonummer field label to IBAN', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setKontonummerFieldLabelToIban(args)
  })
  test('Show BIC SWIF optional infotext', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBicSwifOptionalInfotext(args)
  })
  test('*Show Banknummer field 1', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBanknummerField(args)
  })
  test('Set Banknummer field label to BIC SWIFT Optional', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setBanknummerFieldLabelToBicSwiftOptional(args)
  })
  test('*Hide Banknummer field', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'yes',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_hideBanknummerField(args)
  })
  test('Show BIC SWIFT infotext', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBicSwiftInfotext(args)
  })
  test('*Set Kontonummer field label to BBAN', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setKontonummerFieldLabelToBban(args)
  })
  test('*Show Banknummer field 2', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBanknummerField(args)
  })
  test('Set Banknummer field label to BIC SWIFT', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      ' country isEuEesCountry': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setBanknummerFieldLabelToBicSwift(args)
  })
  test('https www lansforsakringar se 49bd3e globalassets aa global dokument information landinformation pdf', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_linkToCountriesYouCanSendTo(args)
    await handles.test_httpsWwwLansforsakringarSe49bd3eGlobalassetsAaGlobalDokumentInformationLandinformationPdf(args)
  })

  test('Open section Betalning', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_openSectionBetalning(args)
  })
  test('Display currency code currency discription in currencies dropdown', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_displayCurrencyCodeCurrencyDiscriptionInCurrenciesDropdown(args)
  })
  test('Display Valuta Belopp Betala i SEK Meddelande till mottagaren', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_displayValutaBeloppBetalaISekMeddelandeTillMottagaren(args)
  })
  test('*Hide avgift section', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_hideAvgiftSection(args)
  })
  test('Display currency code in Amount field', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_displayCurrencyCodeInAmountField(args)
  })
  test('*Hide avgift section 1', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideAvgiftSection(args)
  })
  test('*Show betalningsreferens', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'currency code is EUR': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_showBetalningsreferens(args)
  })
  test('*Hide betalningsreferens', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'currency code is EUR': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideBetalningsreferens(args)
  })
  test('*Hide betalningsreferens 1', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideBetalningsreferens(args)
  })
  test('*Show avgift section', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'no',
      'currency code is SEK': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_showAvgiftSection(args)
  })
  test('*Hide avgift section 2', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'no',
      'currency code is SEK': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideAvgiftSection(args)
  })
  test('Set currencyCode to SEK', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_beloppISekChecked(args)
    await handles.test_setCurrencycodeToSek(args)
  })
  test('Open info about currency', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_hurSkaJagTankaKringValutaClicked(args)
    await handles.test_openInfoAboutCurrency(args)
  })
  test('https www dnb se se sv markets valuta rentor kurslista overforing daglig', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_hurSkaJagTankaKringValutaClicked(args)
    await handles.action_preliminaraAktuellaValutaKurserClicked(args)
    await handles.test_httpsWwwDnbSeSeSvMarketsValutaRentorKurslistaOverforingDaglig(args)
  })

  test('Show meddelande och eller referens måste fyllas i', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_showMeddelandeOchEllerReferensMasteFyllasI(args)
  })
  test('Clear all alerts and validation errors', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    const actions = [
      'action_franFortsattClicked',
      'action_mottagareFortsattClicked',
      'action_signeraMottagreLaggTillButtonClicked'
    ]
    await handles.test_clearAllAlertsAndValidationErrors(args, { actions })
  })
  test('', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_(args)
  })
  test('Show error', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.test_showError(args)
  })

  test('Close recipient summary modal', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_avbrytClicked(args)
    await handles.test_closeRecipientSummaryModal(args)
  })

  test('Show all Alert Messages', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'yes',
      'More than 3 alerts': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_showAllAlertMessages(args)
  })
  test('Show 3 Alert Messages', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'yes',
      'More than 3 alerts': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_show3AlertMessages(args)
  })
  test('Go back to Payment', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_goBackToPayment(args)
  })
  test('Show avgift section', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_showAvgiftSection(args)
  })
  test('Open info about avgift', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_vadSkaJagBetalaForAvgiftClicked(args)
    await handles.test_openInfoAboutAvgift(args)
  })
  test('https www lansforsakringar se 49334d globalassets aa global dokument prislistor 08198 prislista privat pdf', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_vadSkaJagBetalaForAvgiftClicked(args)
    await handles.action_prislistaClicked(args)
    await handles.test_httpsWwwLansforsakringarSe49334dGlobalassetsAaGlobalDokumentPrislistor08198PrislistaPrivatPdf(args)
  })
  test('Go back to Payee', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_goBackToPayee(args)
  })
  test('Display error Ange Konto', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context }
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayErrorAngeKonto(args)
  })
})

export const Gateways = [
  'Any errors loading data',
  'empty array from getAccounts',
  'Is Konto selected',
  ' country isEuEesCountry',
  'is country ibanLength 0',
  'Any validation errors from mottagare',
  'currency code is EUR',
  'currency code is SEK',
  'Both meddelande and referens are shown and empty',
  'Any validation errors from betalning',
  'Error from validate service',
  'Any errors',
  'More than 3 alerts'
] as const

export type GatewayKey = (typeof Gateways)[number]
export type GatewayCollection = Partial<Record<GatewayKey, string>>

export type TestArgs<TState> = {
  gateways: GatewayCollection
  state: TState
  page: Page
  context: BrowserContext
  tableRow?: Record<string,string>
}

export type TestOptions = {
  actions?: string[]
}

const handleServiceCalls = async (args: TestArgs<any>)=>{
  await handles.serviceCall_imJsonOverviewGetaccountsEsbBankDepositGetaccounts201411(args)
  await handles.serviceCall_bankPaymentCrossborderCountries(args)
  await handles.serviceCall_bankPaymentCrossborderCurrencies(args)
  await handles.serviceCall_bankPaymentCrossborderCrossborderPayments(args)
  await handles.serviceCall_postPayeeSign(args)
}

export type Main<TState={}> = {
  setup: (args: { gateways: GatewayCollection, page: Page, context: BrowserContext }) => Promise<TState>
  start: (args: TestArgs<TState>) => Promise<void>
  serviceCall_imJsonOverviewGetaccountsEsbBankDepositGetaccounts201411: (args: TestArgs<TState>) => Promise<void>
  serviceCall_bankPaymentCrossborderCountries: (args: TestArgs<TState>) => Promise<void>
  serviceCall_bankPaymentCrossborderCurrencies: (args: TestArgs<TState>) => Promise<void>
  serviceCall_bankPaymentCrossborderCrossborderPayments: (args: TestArgs<TState>) => Promise<void>
  serviceCall_postPayeeSign: (args: TestArgs<TState>) => Promise<void>
  action_franFortsattClicked: (args: TestArgs<TState>) => Promise<void>
  action_selectCountry: (args: TestArgs<TState>) => Promise<void>
  action_linkToCountriesYouCanSendTo: (args: TestArgs<TState>) => Promise<void>
  action_mottagareFortsattClicked: (args: TestArgs<TState>) => Promise<void>
  action_selectCurrency: (args: TestArgs<TState>) => Promise<void>
  action_beloppISekChecked: (args: TestArgs<TState>) => Promise<void>
  action_hurSkaJagTankaKringValutaClicked: (args: TestArgs<TState>) => Promise<void>
  action_signeraMottagreLaggTillButtonClicked: (args: TestArgs<TState>) => Promise<void>
  action_preliminaraAktuellaValutaKurserClicked: (args: TestArgs<TState>) => Promise<void>
  action_signeraClicked: (args: TestArgs<TState>) => Promise<void>
  action_avbrytClicked: (args: TestArgs<TState>) => Promise<void>
  action_vadSkaJagBetalaForAvgiftClicked: (args: TestArgs<TState>) => Promise<void>
  action_prislistaClicked: (args: TestArgs<TState>) => Promise<void>
  test_couldNotLoadPage: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_noAvailableAccounts: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displaySectionsFranTillBetalningGranskaGodkann: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayDropdownValjKontoWithValuesAccountNumberAccountCurrenctbalanceAccountNameAccountAvailablebalance: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_openSectionFran: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_hideButtonFortsatt: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_openSectionTill: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayMottagarensFullstndigaNamnAdress: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayDropdownLandCountryName: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayKontonummerWithLabelIban: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_clearValidationErrorsForKontonummerBanknummer: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showBicSwiftNidInfotext: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_setKontonummerFieldLabelToBban: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showBanknummerField: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_setBanknummerFieldLabelToBicSwiftEllerNationelltId: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showCountryIbanlengthAndUpdateInfotext: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_setKontonummerFieldLabelToIban: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showBicSwifOptionalInfotext: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_setBanknummerFieldLabelToBicSwiftOptional: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_hideBanknummerField: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showBicSwiftInfotext: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_setBanknummerFieldLabelToBicSwift: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_httpsWwwLansforsakringarSe49bd3eGlobalassetsAaGlobalDokumentInformationLandinformationPdf: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_openSectionBetalning: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayCurrencyCodeCurrencyDiscriptionInCurrenciesDropdown: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayValutaBeloppBetalaISekMeddelandeTillMottagaren: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_hideAvgiftSection: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayCurrencyCodeInAmountField: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showBetalningsreferens: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_hideBetalningsreferens: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showAvgiftSection: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_setCurrencycodeToSek: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_openInfoAboutCurrency: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_httpsWwwDnbSeSeSvMarketsValutaRentorKurslistaOverforingDaglig: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showMeddelandeOchEllerReferensMasteFyllasI: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_clearAllAlertsAndValidationErrors: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showError: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_closeRecipientSummaryModal: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_showAllAlertMessages: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_show3AlertMessages: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_goBackToPayment: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_openInfoAboutAvgift: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_httpsWwwLansforsakringarSe49334dGlobalassetsAaGlobalDokumentPrislistor08198PrislistaPrivatPdf: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_goBackToPayee: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
  test_displayErrorAngeKonto: (args: TestArgs<TState>, options?: TestOptions) => Promise<void>
}
