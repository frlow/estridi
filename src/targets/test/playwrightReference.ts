import { BrowserContext, Page, test } from '@playwright/test'
import { handles } from './main.js'

test.describe('main', () => {
  test('Could not load page', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_linkToCountriesYouCanSendTo(args)
    await handles.test_httpsWwwLansforsakringarSe49bd3eGlobalassetsAaGlobalDokumentInformationLandinformationPdf(args)
  })
  test.describe("Validate fields Recipient data", ()=>{
    const testNode = async ({tableRow, context, page}: {tableRow: Record<string,string>, page: Page, context: BrowserContext}) => {
      const gateways: GatewayCollection = {
        'Any errors loading data': 'no',
        'empty array from getAccounts': 'no',
        'Is Konto selected': 'yes'
      }
      const state = await handles.setup({ gateways, page, context, tableRow })
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
      await handles.start(args)
      await handles.action_franFortsattClicked(args)
      await handles.action_mottagareFortsattClicked(args)
      await handles.test_validateFieldsRecipientData(args)
    }
    
    test("Land", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Land',
        'Component type': 'DropdownInputSelect',
        'Length': '1',
        'Placeholder': 'Välj land',
        'Notes': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Mottagarens fullständiga namn", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Mottagarens fullständiga namn',
        'Component type': 'Input field',
        'Length': '1-35',
        'Placeholder': '',
        'Notes': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Adress", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Adress',
        'Component type': 'Input field x3',
        'Length': '1-35',
        'Placeholder': '',
        'Notes': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Internationellt kontonummer IBAN", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Internationellt kontonummer (IBAN)',
        'Component type': 'Input field',
        'Length': '1-35',
        'Placeholder': '',
        'Notes': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Kontonummer BBAN", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Kontonummer (BBAN)',
        'Component type': 'Input field',
        'Length': '1-35',
        'Placeholder': '',
        'Notes': ''
      }
      await testNode({tableRow, page, context})
    })

    test("BIC SWIFT", async ({ page, context }) => {
      const tableRow = {
        'Id': 'BIC/SWIFT',
        'Component type': 'Input field',
        'Length': '',
        'Placeholder': '',
        'Notes': 'infotext: BIC/SWIFT är en internationell identifieringskod, varje bank har en unik. Kan vara 8 eller 11 tecken.'
      }
      await testNode({tableRow, page, context})
    })

    test("BIC SWIFT eller Nationellt ID", async ({ page, context }) => {
      const tableRow = {
        'Id': 'BIC/SWIFT eller Nationellt ID',
        'Component type': 'Input field',
        'Length': '',
        'Placeholder': '',
        'Notes': 'infotext: BIC/SWIFT är en internationell identifieringskod, varje bank har en unik. Kan vara 8 eller 11 tecken. Nationellt ID är en nationell identifieringskod ska vara 11 tecken.'
      }
      await testNode({tableRow, page, context})
    })

    test("BIC SWIFT frivilligt", async ({ page, context }) => {
      const tableRow = {
        'Id': 'BIC/SWIFT (frivilligt)',
        'Component type': 'Input field',
        'Length': '',
        'Placeholder': '',
        'Notes': 'infotext: BIC/SWIFT är en internationell identifieringskod, varje bank har en unik. Kan vara 8 eller 11 tecken.\n'
      }
      await testNode({tableRow, page, context})
    })
  })
  test('Open section Betalning', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_hurSkaJagTankaKringValutaClicked(args)
    await handles.action_preliminaraAktuellaValutaKurserClicked(args)
    await handles.test_httpsWwwDnbSeSeSvMarketsValutaRentorKurslistaOverforingDaglig(args)
  })
// table Payment data not found!
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    const actions = [
      'action_franFortsattClicked',
      'action_mottagareFortsattClicked',
      'action_signeraMottagreLaggTillButtonClicked'
    ]
    await handles.test_clearAllAlertsAndValidationErrors(args, { actions })
  })
  test('Display recipient summary modal creditorDetails creditorName creditorDetails creditorAddress addressLine1 creditorDetails creditorAddress addressLine2 creditorDetails creditorAddress addressLine3 creditorDetails creditorAccount creditorDetails creditorAgentIdentification creditorDetails creditorAgentName', async ({ page, context }) => {
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
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_displayRecipientSummaryModalCreditordetailsCreditornameCreditordetailsCreditoraddressAddressline1CreditordetailsCreditoraddressAddressline2CreditordetailsCreditoraddressAddressline3CreditordetailsCreditoraccountCreditordetailsCreditoragentidentificationCreditordetailsCreditoragentname(args)
  })
  test('Show error for sign payee', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.test_showErrorForSignPayee(args)
  })
  test('Close recipient signing modal', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_cancelPayeeSigning(args)
    await handles.test_closeRecipientSigningModal(args)
  })
  test('Display creditorDetails creditorAccount creditorDetails creditorName creditorDetails creditorAgentIdentification creditorDetails creditorAddress addressLine1 creditorDetails creditorAddress addressLine2 creditorDetails creditorAddress addressLine3 creditorDetails creditorAgentName creditorDetails creditorAgentIdentificationType creditorDetails creditorAgentAddress addressLine1 paymentDetails requestedExecutionDate paymentDetails equivalentAmount paymentDetails equivalentCurrency paymentDetails transactionAmount paymentDetails transactionCurrency paymentDetails endToEndIdentification paymentDetails remittanceInformation paymentDetails exchangeRate paymentDetails fee', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.test_displayCreditordetailsCreditoraccountCreditordetailsCreditornameCreditordetailsCreditoragentidentificationCreditordetailsCreditoraddressAddressline1CreditordetailsCreditoraddressAddressline2CreditordetailsCreditoraddressAddressline3CreditordetailsCreditoragentnameCreditordetailsCreditoragentidentificationtypeCreditordetailsCreditoragentaddressAddressline1PaymentdetailsRequestedexecutiondatePaymentdetailsEquivalentamountPaymentdetailsEquivalentcurrencyPaymentdetailsTransactionamountPaymentdetailsTransactioncurrencyPaymentdetailsEndtoendidentificationPaymentdetailsRemittanceinformationPaymentdetailsExchangeratePaymentdetailsFee(args)
  })
  test('Show error for sign payment', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.test_showErrorForSignPayment(args)
  })
  test('Display sign payment modal', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.test_displaySignPaymentModal(args)
  })
  test('*Close sign payment modal', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.action_cancelPaymentSigning(args)
    await handles.test_closeSignPaymentModal(args)
  })
  test('*Close sign payment modal 1', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.action_paymentSigningComplete(args)
    await handles.test_closeSignPaymentModal(args)
  })
  test('Show error for execute payment', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no',
      'Is payment status completed': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.action_paymentSigningComplete(args)
    await handles.test_showErrorForExecutePayment(args)
  })
  test('Show paymentDetails exchangeRate paymentDetails transactionAmount paymentDetails fee', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no',
      'Is payment status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.action_paymentSigningComplete(args)
    await handles.test_showPaymentdetailsExchangeratePaymentdetailsTransactionamountPaymentdetailsFee(args)
  })
  test('Initiate registerView', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no',
      'Is payment status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_godkannClicked(args)
    await handles.action_paymentSigningComplete(args)
    await handles.action_nyBetalningClicked(args)
    await handles.test_initiateRegisterview(args)
  })
  test('Go back to registration page', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.action_andraClicked(args)
    await handles.test_goBackToRegistrationPage(args)
  })
  test('Display some error', async ({ page, context }) => {
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      ' country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'no'
    }
    const state = await handles.setup({ gateways, page, context })
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_signeraClicked(args)
    await handles.action_payeeSigningCompleted(args)
    await handles.test_displaySomeError(args)
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
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.action_avbrytClicked(args)
    await handles.test_closeRecipientSummaryModal(args)
  })
  test.describe("Validate errors Errors from validate service", ()=>{
    const testNode = async ({tableRow, context, page}: {tableRow: Record<string,string>, page: Page, context: BrowserContext}) => {
      const gateways: GatewayCollection = {
        'Any errors loading data': 'no',
        'empty array from getAccounts': 'no',
        'Is Konto selected': 'yes',
        'Any validation errors from mottagare': 'no',
        ' country isEuEesCountry': 'yes',
        'Both meddelande and referens are shown and empty': 'no',
        'Any validation errors from betalning': 'no',
        'Error from validate service': 'yes'
      }
      const state = await handles.setup({ gateways, page, context, tableRow })
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
      await handles.start(args)
      await handles.action_franFortsattClicked(args)
      await handles.action_mottagareFortsattClicked(args)
      await handles.action_signeraMottagreLaggTillButtonClicked(args)
      await handles.test_validateErrorsErrorsFromValidateService(args)
    }
    
    test("10", async ({ page, context }) => {
      const tableRow = {
        'Id': '10',
        'Cause': 'Sessionen har gått ut.',
        'Component': 'alert',
        'Error message to display': 'Du behöver logga in igen – din session eller behörighet har gått ut.\n(IMPLEMENT)'
      }
      await testNode({tableRow, page, context})
    })

    test("11 100 111 113 121 124 126 130 131 132 133 134 135 143 145 146 149 150 152 155 157 159 161 163", async ({ page, context }) => {
      const tableRow = {
        'Id': '11 \r\n100-111 \r\n113-121 \r\n124 \r\n126 \r\n130 \r\n131 \r\n132 \r\n133 \r\n134 \r\n135 \r\n143 \r\n145 \r\n146 \r\n149 \r\n150 \r\n152 \r\n155 \r\n157-159 \r\n161 \r\n163',
        'Cause': 'Ska inte hända',
        'Component': 'Alert',
        'Error message to display': 'Något gick fel - försök gärna igen eller kontakta oss om felet kvarstår'
      }
      await testNode({tableRow, page, context})
    })

    test("105", async ({ page, context }) => {
      const tableRow = {
        'Id': '105',
        'Cause': 'Generellt fel om användarens valda konto',
        'Component': 'field',
        'Error message to display': 'Kontrollera konto'
      }
      await testNode({tableRow, page, context})
    })

    test("112", async ({ page, context }) => {
      const tableRow = {
        'Id': '112',
        'Cause': 'För företag ska en \'tax code\' anges vid större betalningar. Generellt fel om den',
        'Component': 'field',
        'Error message to display': 'Kontrollera betalkod'
      }
      await testNode({tableRow, page, context})
    })

    test("122", async ({ page, context }) => {
      const tableRow = {
        'Id': '122',
        'Cause': 'Generellt fel om mottagarens kontonummer',
        'Component': 'field',
        'Error message to display': 'Kontrollera kontonummer'
      }
      await testNode({tableRow, page, context})
    })

    test("123", async ({ page, context }) => {
      const tableRow = {
        'Id': '123',
        'Cause': 'Generellt fel om mottagarens namn',
        'Component': 'field',
        'Error message to display': 'Kontrollera mottagarens namn'
      }
      await testNode({tableRow, page, context})
    })

    test("125", async ({ page, context }) => {
      const tableRow = {
        'Id': '125',
        'Cause': 'Generellt fel om BIC/SWIFT/NID',
        'Component': 'field',
        'Error message to display': 'Kontrollera bankens identifieringskod'
      }
      await testNode({tableRow, page, context})
    })

    test("127", async ({ page, context }) => {
      const tableRow = {
        'Id': '127',
        'Cause': 'Generellt fel om mottagarens adress 1',
        'Component': 'field',
        'Error message to display': 'Kontrollera mottagarens adress'
      }
      await testNode({tableRow, page, context})
    })

    test("128", async ({ page, context }) => {
      const tableRow = {
        'Id': '128',
        'Cause': 'Generellt fel om mottagarens adress 2',
        'Component': 'field',
        'Error message to display': 'Kontrollera mottagarens adress'
      }
      await testNode({tableRow, page, context})
    })

    test("129", async ({ page, context }) => {
      const tableRow = {
        'Id': '129',
        'Cause': 'Generellt fel om mottagarens adress 3',
        'Component': 'field',
        'Error message to display': 'Kontrollera mottagarens adress'
      }
      await testNode({tableRow, page, context})
    })

    test("136", async ({ page, context }) => {
      const tableRow = {
        'Id': '136',
        'Cause': 'Tax kod saknas vid betalning? Behövs vid belopp X?',
        'Component': 'field',
        'Error message to display': 'Ange betalningskod'
      }
      await testNode({tableRow, page, context})
    })

    test("137", async ({ page, context }) => {
      const tableRow = {
        'Id': '137',
        'Cause': 'Format på IBAN stämmer ej',
        'Component': 'field',
        'Error message to display': 'Kontrollera formatet på IBAN'
      }
      await testNode({tableRow, page, context})
    })

    test("138", async ({ page, context }) => {
      const tableRow = {
        'Id': '138',
        'Cause': 'Valt konto är blockerat',
        'Component': 'alert + field',
        'Error message to display': 'Alert: Vänligen kontakta telefonbanken på 0771-666555 och välj knappval 2. Öppettider för utlandsbetalningar är vardagar 07:30-16:00\n\nField: Kontot kan inte användas för utlandsbetalning'
      }
      await testNode({tableRow, page, context})
    })

    test("139", async ({ page, context }) => {
      const tableRow = {
        'Id': '139',
        'Cause': 'Valt konto har felaktig status, exempelvis att kontot är inaktivt. Generellt, ev misstänk aktivitet men vi vill ej säga det till kunden',
        'Component': 'field',
        'Error message to display': ' Kontrollera kontonummer'
      }
      await testNode({tableRow, page, context})
    })

    test("140", async ({ page, context }) => {
      const tableRow = {
        'Id': '140',
        'Cause': 'Vet inte när detta inträffar - vad är beloppsgränsen?',
        'Component': 'field',
        'Error message to display': 'Maxbelopp per transaktion uppnått, välj ett lägre belopp'
      }
      await testNode({tableRow, page, context})
    })

    test("141", async ({ page, context }) => {
      const tableRow = {
        'Id': '141',
        'Cause': 'Betalningen är för stor för \'personligt\' inställningar/limit',
        'Component': 'field',
        'Error message to display': 'Maxbelopp per transaktion uppnått, välj ett lägre belopp'
      }
      await testNode({tableRow, page, context})
    })

    test("142", async ({ page, context }) => {
      const tableRow = {
        'Id': '142',
        'Cause': 'När betalningar senaste sju dagar överskider personlig \'inställningar/limit\'',
        'Component': 'field',
        'Error message to display': 'Maxbelopp per 7 dagar uppnått, välj ett lägre belopp'
      }
      await testNode({tableRow, page, context})
    })

    test("144", async ({ page, context }) => {
      const tableRow = {
        'Id': '144',
        'Cause': 'Saknar täckning',
        'Component': 'field',
        'Error message to display': 'Tillgängligt saldo för lågt'
      }
      await testNode({tableRow, page, context})
    })

    test("147", async ({ page, context }) => {
      const tableRow = {
        'Id': '147',
        'Cause': 'När mottagerns bank är i annat land än valt land',
        'Component': 'field x3',
        'Error message to display': 'Country field: Kontrollera val av land\n\nRecipient account number field: Kontrollera IBAN or Kontrollera BBAN\n\nRecipient bank number field: Kontrollera BIC/SWIFT eller National ID'
      }
      await testNode({tableRow, page, context})
    })

    test("148", async ({ page, context }) => {
      const tableRow = {
        'Id': '148',
        'Cause': 'När användaren exempelvis enbart angett IBAN där IBAN + BIC krävs?',
        'Component': 'field',
        'Error message to display': 'Kontrollera bankens identifierngskod\n'
      }
      await testNode({tableRow, page, context})
    })

    test("149", async ({ page, context }) => {
      const tableRow = {
        'Id': '149',
        'Cause': '??????',
        'Component': 'field',
        'Error message to display': 'Recipient bank field: Kontrollera bankens identifieringskod\n\nCurrency field: För nationell identifieringskod krävs valt lands valuta'
      }
      await testNode({tableRow, page, context})
    })

    test("151", async ({ page, context }) => {
      const tableRow = {
        'Id': '151',
        'Cause': 'Fel kombination av land och valuta',
        'Component': 'field',
        'Error message to display': 'Valutan går inte att betala med till det land du har valt'
      }
      await testNode({tableRow, page, context})
    })

    test("153", async ({ page, context }) => {
      const tableRow = {
        'Id': '153',
        'Cause': 'Användaren har inte tillgång till \'utlandstjänsten\' - behöver exempelvis uppdatera KYC',
        'Component': 'alert',
        'Error message to display': 'Du har inte tjänsten för utlandsbetalningar – Vänligen kontakta telefonbanken på 0771-666555 och välj knappval 2. Öppettider för utlandsbetalningar är vardagar 07:30-16:00'
      }
      await testNode({tableRow, page, context})
    })

    test("154", async ({ page, context }) => {
      const tableRow = {
        'Id': '154',
        'Cause': 'Generellt fel om tax code',
        'Component': 'field',
        'Error message to display': 'Kontrollera betalningskod'
      }
      await testNode({tableRow, page, context})
    })

    test("156", async ({ page, context }) => {
      const tableRow = {
        'Id': '156',
        'Cause': '????',
        'Component': 'alert',
        'Error message to display': 'Din betalning kunde inte genomföras – försök gärna igen eller kontakta oss om problemet kvarstår'
      }
      await testNode({tableRow, page, context})
    })

    test("160", async ({ page, context }) => {
      const tableRow = {
        'Id': '160',
        'Cause': 'När något är fel hos DnB (de genomför utlandsbetalningar åt LF)',
        'Component': 'alert',
        'Error message to display': 'Tekniken är inte med oss just nu – det går inte att göra utlandsbetalningar, försök igen om en stund'
      }
      await testNode({tableRow, page, context})
    })

    test("162", async ({ page, context }) => {
      const tableRow = {
        'Id': '162',
        'Cause': 'Spärrad mottagare i utlandet exempelvis',
        'Component': 'alert',
        'Error message to display': 'Vi kan inte genomföra din transaktion – Vänligen kontakta telefonbanken på 0771-666555 och välj knappval 2. Öppettider för utlandsbetalningar är vardagar 07:30-16:00'
      }
      await testNode({tableRow, page, context})
    })
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
    const args = { gateways, state, page, context } as any
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
  'Any errors from sign payee',
  'Is payee status completed',
  'Any errors from sign payment',
  'Is payment status completed',
  'More than 3 alerts'
] as const

export type GatewayKey = (typeof Gateways)[number]
export type GatewayCollection = Partial<Record<GatewayKey, string>>

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection
  state: TState
  page: Page & TPageExtensions
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
  await handles.serviceCall_postPayeeExecute(args)
  await handles.serviceCall_postPaymentSign(args)
  await handles.serviceCall_postPaymentExecute(args)
}

export type Main<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_imJsonOverviewGetaccountsEsbBankDepositGetaccounts201411: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_bankPaymentCrossborderCountries: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_bankPaymentCrossborderCurrencies: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_bankPaymentCrossborderCrossborderPayments: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_postPayeeSign: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_postPayeeExecute: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_postPaymentSign: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  serviceCall_postPaymentExecute: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_franFortsattClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_selectCountry: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_linkToCountriesYouCanSendTo: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_mottagareFortsattClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_selectCurrency: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_beloppISekChecked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_hurSkaJagTankaKringValutaClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_signeraMottagreLaggTillButtonClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_preliminaraAktuellaValutaKurserClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_signeraClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_avbrytClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_cancelPayeeSigning: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_payeeSigningCompleted: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_godkannClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_andraClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_cancelPaymentSigning: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_paymentSigningComplete: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_nyBetalningClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_vadSkaJagBetalaForAvgiftClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  action_prislistaClicked: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_couldNotLoadPage: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_noAvailableAccounts: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displaySectionsFranTillBetalningGranskaGodkann: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayDropdownValjKontoWithValuesAccountNumberAccountCurrenctbalanceAccountNameAccountAvailablebalance: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_openSectionFran: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_hideButtonFortsatt: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_openSectionTill: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayMottagarensFullstndigaNamnAdress: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayDropdownLandCountryName: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayKontonummerWithLabelIban: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_clearValidationErrorsForKontonummerBanknummer: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showBicSwiftNidInfotext: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_setKontonummerFieldLabelToBban: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showBanknummerField: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_setBanknummerFieldLabelToBicSwiftEllerNationelltId: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showCountryIbanlengthAndUpdateInfotext: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_setKontonummerFieldLabelToIban: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showBicSwifOptionalInfotext: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_setBanknummerFieldLabelToBicSwiftOptional: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_hideBanknummerField: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showBicSwiftInfotext: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_setBanknummerFieldLabelToBicSwift: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_httpsWwwLansforsakringarSe49bd3eGlobalassetsAaGlobalDokumentInformationLandinformationPdf: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_validateFieldsRecipientData: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_openSectionBetalning: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayCurrencyCodeCurrencyDiscriptionInCurrenciesDropdown: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayValutaBeloppBetalaISekMeddelandeTillMottagaren: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_hideAvgiftSection: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayCurrencyCodeInAmountField: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showBetalningsreferens: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_hideBetalningsreferens: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showAvgiftSection: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_setCurrencycodeToSek: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_openInfoAboutCurrency: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_httpsWwwDnbSeSeSvMarketsValutaRentorKurslistaOverforingDaglig: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_validateFieldsPaymentData: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showMeddelandeOchEllerReferensMasteFyllasI: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_clearAllAlertsAndValidationErrors: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayRecipientSummaryModalCreditordetailsCreditornameCreditordetailsCreditoraddressAddressline1CreditordetailsCreditoraddressAddressline2CreditordetailsCreditoraddressAddressline3CreditordetailsCreditoraccountCreditordetailsCreditoragentidentificationCreditordetailsCreditoragentname: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showErrorForSignPayee: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_closeRecipientSigningModal: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayCreditordetailsCreditoraccountCreditordetailsCreditornameCreditordetailsCreditoragentidentificationCreditordetailsCreditoraddressAddressline1CreditordetailsCreditoraddressAddressline2CreditordetailsCreditoraddressAddressline3CreditordetailsCreditoragentnameCreditordetailsCreditoragentidentificationtypeCreditordetailsCreditoragentaddressAddressline1PaymentdetailsRequestedexecutiondatePaymentdetailsEquivalentamountPaymentdetailsEquivalentcurrencyPaymentdetailsTransactionamountPaymentdetailsTransactioncurrencyPaymentdetailsEndtoendidentificationPaymentdetailsRemittanceinformationPaymentdetailsExchangeratePaymentdetailsFee: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showErrorForSignPayment: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displaySignPaymentModal: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_closeSignPaymentModal: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showErrorForExecutePayment: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showPaymentdetailsExchangeratePaymentdetailsTransactionamountPaymentdetailsFee: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_initiateRegisterview: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_goBackToRegistrationPage: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displaySomeError: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_closeRecipientSummaryModal: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_validateErrorsErrorsFromValidateService: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_showAllAlertMessages: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_show3AlertMessages: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_goBackToPayment: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_openInfoAboutAvgift: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_httpsWwwLansforsakringarSe49334dGlobalassetsAaGlobalDokumentPrislistor08198PrislistaPrivatPdf: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_goBackToPayee: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
  test_displayErrorAngeKonto: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
}
