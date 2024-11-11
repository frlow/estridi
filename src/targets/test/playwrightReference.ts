import { BrowserContext, Page, test } from '@playwright/test'
import { handles } from './main.js'

test.describe('main', () => {
  test('Could not load page', async ({ page, context }) => {
    /*
    Could not load page
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_couldNotLoadPage(args)
  })
  test('No available accounts', async ({ page, context }) => {
    /*
    No available accounts
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_noAvailableAccounts(args)
  })
  test('Display Sections Från Till Betalning Granska Godkänn', async ({ page, context }) => {
    /*
    Display Sections:
    Från
    Till
    Betalning
    Granska & Godkänn
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_displaySectionsFranTillBetalningGranskaGodkann(args)
  })
  test('Display dropdown Välj Konto with values account number account currenctBalance account name account availableBalance', async ({ page, context }) => {
    /*
    Display dropdown “Välj Konto” with values
    [account.number]
    [account.currenctBalance]
    [account.name]
    [account.availableBalance]
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_displayDropdownValjKontoWithValuesAccountNumberAccountCurrenctbalanceAccountNameAccountAvailablebalance(args)
  })
  test('Open section Från', async ({ page, context }) => {
    /*
    Open section “Från”
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)

    await handles.test_openSectionFran(args)
  })
  test('Hide button Fortsätt', async ({ page, context }) => {
    /*
    Hide button Fortsätt
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_hideButtonFortsatt(args)
  })
  test('Open section Till', async ({ page, context }) => {
    /*
    Open section “Till”
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_openSectionTill(args)
  })
  test('Display Mottagarens fullstndiga namn Adress', async ({ page, context }) => {
    /*
    Display “Mottagarens fullstndiga namn”     ”Adress”     
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayMottagarensFullstndigaNamnAdress(args)
  })
  test('Display dropdown Land country name', async ({ page, context }) => {
    /*
    Display dropdown “Land”      [country.name]
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayDropdownLandCountryName(args)
  })
  test('Display Kontonummer with label IBAN', async ({ page, context }) => {
    /*
    Display “Kontonummer” with label IBAN
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.test_displayKontonummerWithLabelIban(args)
  })
  test('Clear validation errors for Kontonummer Banknummer', async ({ page, context }) => {
    /*
    _Clear validation errors for      ”Kontonummer”
    “Banknummer”
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    // manually implement start in test
    const actions = [
      'action_franFortsattClicked',
      'action_selectCountry'
    ]
    await handles.test_clearValidationErrorsForKontonummerBanknummer(args, { actions })
  })
  test('Show BIC SWIFT NID infotext', async ({ page, context }) => {
    /*
    Show BIC/SWIFT/NID infotext
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBicSwiftNidInfotext(args)
  })
  test('*Set Kontonummer field label to BBAN', async ({ page, context }) => {
    /*
    *Set “Kontonummer” field label to BBAN
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setKontonummerFieldLabelToBban(args)
  })
  test('*Show Banknummer field', async ({ page, context }) => {
    /*
    *Show “Banknummer” field
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBanknummerField(args)
  })
  test('Set Banknummer field label to BIC SWIFT eller Nationellt ID', async ({ page, context }) => {
    /*
    Set “Banknummer” field label to BIC/SWIFT eller Nationellt ID
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setBanknummerFieldLabelToBicSwiftEllerNationelltId(args)
  })
  test('Show country ibanLength and update infotext', async ({ page, context }) => {
    /*
    Show [country.ibanLength] and update infotext
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showCountryIbanlengthAndUpdateInfotext(args)
  })
  test('Set Kontonummer field label to IBAN', async ({ page, context }) => {
    /*
    Set “Kontonummer” field label to IBAN
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setKontonummerFieldLabelToIban(args)
  })
  test('Show BIC SWIFT optional infotext', async ({ page, context }) => {
    /*
    Show BIC/SWIFT optional infotext
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'yes',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBicSwiftOptionalInfotext(args)
  })
  test('*Show Banknummer field 1', async ({ page, context }) => {
    /*
    *Show “Banknummer” field
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'yes',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBanknummerField(args)
  })
  test('Set Banknummer field label to BIC SWIFT Optional', async ({ page, context }) => {
    /*
    Set “Banknummer” field label to BIC/SWIFT Optional
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'yes',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setBanknummerFieldLabelToBicSwiftOptional(args)
  })
  test('*Hide Banknummer field', async ({ page, context }) => {
    /*
    *Hide “Banknummer” field
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'yes',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_hideBanknummerField(args)
  })
  test('Show BIC SWIFT infotext', async ({ page, context }) => {
    /*
    Show BIC/SWIFT infotext
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBicSwiftInfotext(args)
  })
  test('*Set Kontonummer field label to BBAN 1', async ({ page, context }) => {
    /*
    *Set “Kontonummer” field label to BBAN
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setKontonummerFieldLabelToBban(args)
  })
  test('*Show Banknummer field 2', async ({ page, context }) => {
    /*
    *Show “Banknummer” field
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_showBanknummerField(args)
  })
  test('Set Banknummer field label to BIC SWIFT', async ({ page, context }) => {
    /*
    Set “Banknummer” field label to BIC/SWIFT
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Is country US': 'no',
      'is country ibanLength 0': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_selectCountry(args)
    await handles.test_setBanknummerFieldLabelToBicSwift(args)
  })
  test('https www lansforsakringar se 49bd3e globalassets aa global dokument information landinformation pdf', async ({ page, context }) => {
    /*
    https://www.lansforsakringar.se/49bd3e/globalassets/aa-global/dokument/information/landinformation.pdf
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
      const state = await handles.setup({ gateways, page, context, tableRow } as any)
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
      const actions = [
        'action_franFortsattClicked',
        'action_mottagareFortsattClicked'
      ]
      await handles.test_validateFieldsRecipientData(args, { actions })
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
        'Length': '8-11',
        'Placeholder': '',
        'Notes': 'infotext: BIC/SWIFT är en internationell identifieringskod, varje bank har en unik. Kan vara 8 eller 11 tecken.'
      }
      await testNode({tableRow, page, context})
    })

    test("BIC SWIFT eller Nationellt ID", async ({ page, context }) => {
      const tableRow = {
        'Id': 'BIC/SWIFT eller Nationellt ID',
        'Component type': 'Input field',
        'Length': '8-11',
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
    /*
    Open section “Betalning”
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_openSectionBetalning(args)
  })
  test('Display currency code currency discription in currencies dropdown', async ({ page, context }) => {
    /*
    Display 
    [currency.code]
    [currency.discription]
    in currencies dropdown
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_displayCurrencyCodeCurrencyDiscriptionInCurrenciesDropdown(args)
  })
  test('Display Valuta Belopp Betala i SEK Meddelande till mottagaren', async ({ page, context }) => {
    /*
    Display
    “Valuta”
    “Belopp”
    “Betala i SEK”
    “Meddelande till mottagaren”
    
    
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_displayValutaBeloppBetalaISekMeddelandeTillMottagaren(args)
  })
  test('*Hide avgift section', async ({ page, context }) => {
    /*
    *Hide avgift section
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_hideAvgiftSection(args)
  })
  test('Display currency code in Amount field', async ({ page, context }) => {
    /*
    Display [currency.code] in Amount field
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_displayCurrencyCodeInAmountField(args)
  })
  test('*Hide avgift section 1', async ({ page, context }) => {
    /*
    *Hide avgift section
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideAvgiftSection(args)
  })
  test('*Show betalningsreferens', async ({ page, context }) => {
    /*
    *Show betalningsreferens
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'currency code is EUR': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_showBetalningsreferens(args)
  })
  test('*Hide betalningsreferens', async ({ page, context }) => {
    /*
    *Hide betalningsreferens
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'currency code is EUR': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideBetalningsreferens(args)
  })
  test('*Hide betalningsreferens 1', async ({ page, context }) => {
    /*
    *Hide betalningsreferens
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideBetalningsreferens(args)
  })
  test('*Show avgift section', async ({ page, context }) => {
    /*
    *Show avgift section
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'no',
      'currency code is SEK': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_showAvgiftSection(args)
  })
  test('*Hide avgift section 2', async ({ page, context }) => {
    /*
    *Hide avgift section
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'no',
      'currency code is SEK': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_selectCurrency(args)
    await handles.test_hideAvgiftSection(args)
  })
  test('Set currencyCode to SEK', async ({ page, context }) => {
    /*
    Set currencyCode to SEK
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_beloppISekChecked(args)
    await handles.test_setCurrencycodeToSek(args)
  })
  test('Open info about currency', async ({ page, context }) => {
    /*
    Open info about currency
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_hurSkaJagTankaKringValutaClicked(args)
    await handles.test_openInfoAboutCurrency(args)
  })
  test('https www dnb se se sv markets valuta rentor kurslista overforing daglig', async ({ page, context }) => {
    /*
    https://www.dnb.se/se/sv/markets/valuta-rentor/kurslista/overforing/daglig
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_hurSkaJagTankaKringValutaClicked(args)
    await handles.action_preliminaraAktuellaValutaKurserClicked(args)
    await handles.test_httpsWwwDnbSeSeSvMarketsValutaRentorKurslistaOverforingDaglig(args)
  })
  test.describe("Validate fields Payment data", ()=>{
    const testNode = async ({tableRow, context, page}: {tableRow: Record<string,string>, page: Page, context: BrowserContext}) => {
      const gateways: GatewayCollection = {
        'Any errors loading data': 'no',
        'empty array from getAccounts': 'no',
        'Is Konto selected': 'yes',
        'Any validation errors from mottagare': 'no',
        'country isEuEesCountry': 'yes'
      }
      const state = await handles.setup({ gateways, page, context, tableRow } as any)
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
      const actions = [
        'action_franFortsattClicked',
        'action_mottagareFortsattClicked',
        'action_signeraMottagreLaggTillButtonClicked'
      ]
      await handles.test_validateFieldsPaymentData(args, { actions })
    }
    
    test("Valuta", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Valuta',
        'Component type': 'DropdownInputSelect',
        'Properties': 'Required',
        'Specific requirements': 'Default value “Välj land”'
      }
      await testNode({tableRow, page, context})
    })

    test("Belopp", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Belopp',
        'Component type': 'Input field',
        'Properties': 'Required\nDecimal [Format: 1-14 integers, 0-2 decimals]',
        'Specific requirements': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Betala i SEK", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Betala i SEK',
        'Component type': 'Checkbox',
        'Properties': 'Optional',
        'Specific requirements': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Avgift", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Avgift',
        'Component type': 'Radio button',
        'Properties': 'Required if shown',
        'Specific requirements': 'Preselect “Jag betalar samtliga avgifter”'
      }
      await testNode({tableRow, page, context})
    })

    test("Meddelande till mottagaren", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Meddelande till mottagaren',
        'Component type': 'textarea',
        'Properties': 'Optional \nString [Format: 1-140 characters]',
        'Specific requirements': ''
      }
      await testNode({tableRow, page, context})
    })

    test("Betalningsreferens", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Betalningsreferens',
        'Component type': 'Input field',
        'Properties': 'Optional\nString [Format: 1-35 characters]',
        'Specific requirements': ''
      }
      await testNode({tableRow, page, context})
    })
  })
  test('Show meddelande och eller referens måste fyllas i', async ({ page, context }) => {
    /*
    Show meddelande och/eller referens måste fyllas i
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_showMeddelandeOchEllerReferensMasteFyllasI(args)
  })
  test('Clear all alerts and validation errors', async ({ page, context }) => {
    /*
    _Clear all alerts and      validation errors
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    // manually implement start in test
    const actions = [
      'action_franFortsattClicked',
      'action_mottagareFortsattClicked',
      'action_signeraMottagreLaggTillButtonClicked'
    ]
    await handles.test_clearAllAlertsAndValidationErrors(args, { actions })
  })
  test('Display recipient summary modal creditorDetails creditorName creditorDetails creditorAddress addressLine1 creditorDetails creditorAddress addressLine2 creditorDetails creditorAddress addressLine3 creditorDetails creditorAccount creditorDetails creditorAgentIdentification creditorDetails creditorAgentName', async ({ page, context }) => {
    /*
    Display recipient summary modal
    [creditorDetails.creditorName]
    [creditorDetails.creditorAddress.addressLine1]
    [creditorDetails. creditorAddress.addressLine2]
    [creditorDetails.creditorAddress.addressLine3]?
    [creditorDetails.creditorAccount]
    [creditorDetails.creditorAgentIdentification]
    [creditorDetails.creditorAgentName]
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_displayRecipientSummaryModalCreditordetailsCreditornameCreditordetailsCreditoraddressAddressline1CreditordetailsCreditoraddressAddressline2CreditordetailsCreditoraddressAddressline3CreditordetailsCreditoraccountCreditordetailsCreditoragentidentificationCreditordetailsCreditoragentname(args)
  })
  test('Show error for sign payee', async ({ page, context }) => {
    /*
    Show error for sign payee
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Close recipient signing modal
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Display 
    [creditorDetails.creditorAccount]
    [creditorDetails.creditorName]
    [creditorDetails.creditorAgentIdentification]
    [creditorDetails.creditorAddress.addressLine1]
    [creditorDetails.creditorAddress.addressLine2]
    [creditorDetails.creditorAddress.addressLine3]?
    [creditorDetails.creditorAgentName]
    [creditorDetails.creditorAgentIdentificationType]
    [creditorDetails.creditorAgentAddress.addressLine1]
    
    [paymentDetails.requestedExecutionDate]
    [paymentDetails.equivalentAmount]
    [paymentDetails.equivalentCurrency]
    [paymentDetails.transactionAmount]
    [paymentDetails.transactionCurrency]
    [paymentDetails.endToEndIdentification]
    [paymentDetails.remittanceInformation]
    [paymentDetails.exchangeRate]
    [paymentDetails.fee]
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Show error for sign payment
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Display sign payment modal
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    *Close sign payment modal
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
  test('Go back to payment summary page', async ({ page, context }) => {
    /*
    Go back to payment summary page
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    await handles.test_goBackToPaymentSummaryPage(args)
  })
  test('*Close sign payment modal 1', async ({ page, context }) => {
    /*
    *Close sign payment modal
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Show error for execute payment
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no',
      'Is payment status completed': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Show
    [paymentDetails.exchangeRate]
    [paymentDetails.transactionAmount]
    [paymentDetails.fee]
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no',
      'Is payment status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Initiate registerView
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes',
      'Any errors from sign payment': 'no',
      'Is payment status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Go back to registration page
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Display some error
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no',
      'Any errors from sign payee': 'no',
      'Is payee status completed': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Close recipient summary modal
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
        'country isEuEesCountry': 'yes',
        'Both meddelande and referens are shown and empty': 'no',
        'Any validation errors from betalning': 'no',
        'Error from validate service': 'yes'
      }
      const state = await handles.setup({ gateways, page, context, tableRow } as any)
      const args = { gateways, state, page, context, tableRow } as any
      await handleServiceCalls(args)
      const actions = [
        'action_franFortsattClicked',
        'action_mottagareFortsattClicked',
        'action_signeraMottagreLaggTillButtonClicked'
      ]
      await handles.test_validateErrorsErrorsFromValidateService(args, { actions })
    }
    
    test("10", async ({ page, context }) => {
      const tableRow = {
        'Id': '10',
        'Cause': 'Sessionen har gått ut.',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Du behöver logga in igen – din session eller behörighet har gått ut.'
      }
      await testNode({tableRow, page, context})
    })

    test("11 100 111 113 121 124 126 130 131 132 133 134 135 143 145 146 149 150 152 155 157 159 161 163", async ({ page, context }) => {
      const tableRow = {
        'Id': '11 \r\n100-111 \r\n113-121 \r\n124 \r\n126 \r\n130 \r\n131 \r\n132 \r\n133 \r\n134 \r\n135 \r\n143 \r\n145 \r\n146 \r\n149 \r\n150 \r\n152 \r\n155 \r\n157-159 \r\n161 \r\n163',
        'Cause': 'Ska inte hända',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Något gick fel - försök gärna igen eller kontakta oss om felet kvarstår'
      }
      await testNode({tableRow, page, context})
    })

    test("105", async ({ page, context }) => {
      const tableRow = {
        'Id': '105',
        'Cause': 'Generellt fel om användarens valda konto',
        'Component': 'field',
        'Field': 'Frånkonto',
        'Error message to display': 'Kontrollera konto'
      }
      await testNode({tableRow, page, context})
    })

    test("112", async ({ page, context }) => {
      const tableRow = {
        'Id': '112',
        'Cause': 'För företag ska en \'tax code\' anges vid större betalningar. Generellt fel om den',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Kontrollera betalkod\n// Senare field när vi gör Färetag'
      }
      await testNode({tableRow, page, context})
    })

    test("122", async ({ page, context }) => {
      const tableRow = {
        'Id': '122',
        'Cause': 'Generellt fel om mottagarens kontonummer',
        'Component': 'field',
        'Field': 'Mottagarens konto',
        'Error message to display': 'Kontrollera kontonummer'
      }
      await testNode({tableRow, page, context})
    })

    test("123", async ({ page, context }) => {
      const tableRow = {
        'Id': '123',
        'Cause': 'Generellt fel om mottagarens namn',
        'Component': 'field',
        'Field': 'Mottagarens namn',
        'Error message to display': 'Kontrollera mottagarens namn'
      }
      await testNode({tableRow, page, context})
    })

    test("125", async ({ page, context }) => {
      const tableRow = {
        'Id': '125',
        'Cause': 'Generellt fel om BIC/SWIFT/NID',
        'Component': 'field',
        'Field': 'Banknummer',
        'Error message to display': 'Kontrollera bankens identifieringskod'
      }
      await testNode({tableRow, page, context})
    })

    test("127", async ({ page, context }) => {
      const tableRow = {
        'Id': '127',
        'Cause': 'Generellt fel om mottagarens adress 1',
        'Component': 'field',
        'Field': 'Adress',
        'Error message to display': 'Kontrollera mottagarens adress'
      }
      await testNode({tableRow, page, context})
    })

    test("128", async ({ page, context }) => {
      const tableRow = {
        'Id': '128',
        'Cause': 'Generellt fel om mottagarens adress 2',
        'Component': 'field',
        'Field': 'Adress',
        'Error message to display': 'Kontrollera mottagarens adress'
      }
      await testNode({tableRow, page, context})
    })

    test("129", async ({ page, context }) => {
      const tableRow = {
        'Id': '129',
        'Cause': 'Generellt fel om mottagarens adress 3',
        'Component': 'field',
        'Field': 'Adress',
        'Error message to display': 'Kontrollera mottagarens adress'
      }
      await testNode({tableRow, page, context})
    })

    test("136", async ({ page, context }) => {
      const tableRow = {
        'Id': '136',
        'Cause': 'Tax kod saknas vid betalning? Behövs vid belopp X?',
        'Component': '',
        'Field': '',
        'Error message to display': 'Ange betalningskod\n// Företag'
      }
      await testNode({tableRow, page, context})
    })

    test("137", async ({ page, context }) => {
      const tableRow = {
        'Id': '137',
        'Cause': 'Format på IBAN stämmer ej',
        'Component': 'field',
        'Field': 'Mottagarens konto',
        'Error message to display': 'Kontrollera formatet på IBAN'
      }
      await testNode({tableRow, page, context})
    })

    test("138", async ({ page, context }) => {
      const tableRow = {
        'Id': '138',
        'Cause': 'Valt konto är blockerat',
        'Component': 'alert + field',
        'Field': 'Frånkonto',
        'Error message to display': 'Alert: Vänligen kontakta telefonbanken på 0771-666555 och välj knappval 2. Öppettider för utlandsbetalningar är vardagar 07:30-16:00\n\nField: Kontot kan inte användas för utlandsbetalning'
      }
      await testNode({tableRow, page, context})
    })

    test("139", async ({ page, context }) => {
      const tableRow = {
        'Id': '139',
        'Cause': 'Valt konto har felaktig status, exempelvis att kontot är inaktivt.\nGenerellt, ev misstänk aktivitet men vi vill ej säga det till kunden',
        'Component': 'field',
        'Field': 'Frånkonto',
        'Error message to display': ' Kontrollera kontonummer'
      }
      await testNode({tableRow, page, context})
    })

    test("140", async ({ page, context }) => {
      const tableRow = {
        'Id': '140',
        'Cause': 'Vet inte när detta inträffar - vad är beloppsgränsen?',
        'Component': 'field',
        'Field': 'Belopp',
        'Error message to display': 'Maxbelopp per transaktion uppnått, välj ett lägre belopp'
      }
      await testNode({tableRow, page, context})
    })

    test("141", async ({ page, context }) => {
      const tableRow = {
        'Id': '141',
        'Cause': 'Betalningen är för stor för \'personligt\' inställningar/limit',
        'Component': 'field',
        'Field': 'Belopp',
        'Error message to display': 'Maxbelopp per transaktion uppnått, välj ett lägre belopp'
      }
      await testNode({tableRow, page, context})
    })

    test("142", async ({ page, context }) => {
      const tableRow = {
        'Id': '142',
        'Cause': 'När betalningar senaste sju dagar överskider personlig \'inställningar/limit\'',
        'Component': 'field',
        'Field': 'Belopp',
        'Error message to display': 'Maxbelopp per 7 dagar uppnått, välj ett lägre belopp'
      }
      await testNode({tableRow, page, context})
    })

    test("144", async ({ page, context }) => {
      const tableRow = {
        'Id': '144',
        'Cause': 'Saknar täckning',
        'Component': 'field',
        'Field': 'Belopp',
        'Error message to display': 'Tillgängligt saldo för lågt'
      }
      await testNode({tableRow, page, context})
    })

    test("147", async ({ page, context }) => {
      const tableRow = {
        'Id': '147',
        'Cause': 'När mottagerns bank är i annat land än valt land',
        'Component': 'field x3',
        'Field': 'Land\nMottagarens konto\nBanknummer',
        'Error message to display': 'Country field: Kontrollera val av land\n\nRecipient account number field: Kontrollera IBAN or Kontrollera BBAN\n\nRecipient bank number field: Kontrollera BIC/SWIFT eller National ID'
      }
      await testNode({tableRow, page, context})
    })

    test("148", async ({ page, context }) => {
      const tableRow = {
        'Id': '148',
        'Cause': 'När användaren exempelvis enbart angett IBAN där IBAN + BIC krävs?',
        'Component': 'field',
        'Field': 'Banknummer',
        'Error message to display': 'Kontrollera bankens identifierngskod\n'
      }
      await testNode({tableRow, page, context})
    })

    test("149", async ({ page, context }) => {
      const tableRow = {
        'Id': '149',
        'Cause': '??????',
        'Component': 'field x2',
        'Field': 'Banknummer\nValuta',
        'Error message to display': 'Recipient bank field: Kontrollera bankens identifieringskod\n\nCurrency field: För nationell identifieringskod krävs valt lands valuta'
      }
      await testNode({tableRow, page, context})
    })

    test("151", async ({ page, context }) => {
      const tableRow = {
        'Id': '151',
        'Cause': 'Fel kombination av land och valuta',
        'Component': 'field',
        'Field': 'Valuta',
        'Error message to display': 'Valutan går inte att betala med till det land du har valt'
      }
      await testNode({tableRow, page, context})
    })

    test("153", async ({ page, context }) => {
      const tableRow = {
        'Id': '153',
        'Cause': 'Användaren har inte tillgång till \'utlandstjänsten\' - behöver exempelvis uppdatera KYC',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Du har inte tjänsten för utlandsbetalningar – Vänligen kontakta telefonbanken på 0771-666555 och välj knappval 2. Öppettider för utlandsbetalningar är vardagar 07:30-16:00'
      }
      await testNode({tableRow, page, context})
    })

    test("154", async ({ page, context }) => {
      const tableRow = {
        'Id': '154',
        'Cause': 'Generellt fel om tax code',
        'Component': '',
        'Field': '',
        'Error message to display': 'Kontrollera betalningskod\n// Företag'
      }
      await testNode({tableRow, page, context})
    })

    test("156", async ({ page, context }) => {
      const tableRow = {
        'Id': '156',
        'Cause': '????',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Din betalning kunde inte genomföras – försök gärna igen eller kontakta oss om problemet kvarstår'
      }
      await testNode({tableRow, page, context})
    })

    test("160", async ({ page, context }) => {
      const tableRow = {
        'Id': '160',
        'Cause': 'När något är fel hos DnB (de genomför utlandsbetalningar åt LF)',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Tekniken är inte med oss just nu – det går inte att göra utlandsbetalningar, försök igen om en stund'
      }
      await testNode({tableRow, page, context})
    })

    test("162", async ({ page, context }) => {
      const tableRow = {
        'Id': '162',
        'Cause': 'Spärrad mottagare i utlandet exempelvis',
        'Component': 'alert',
        'Field': '',
        'Error message to display': 'Vi kan inte genomföra din transaktion – Vänligen kontakta telefonbanken på 0771-666555 och välj knappval 2. Öppettider för utlandsbetalningar är vardagar 07:30-16:00'
      }
      await testNode({tableRow, page, context})
    })

    test("Empty response", async ({ page, context }) => {
      const tableRow = {
        'Id': 'Empty response',
        'Cause': 'Server svarar men det finns inget innehll i svaret',
        'Component': '',
        'Field': '',
        'Error message to display': ''
      }
      await testNode({tableRow, page, context})
    })
  })
  test('Show all Alert Messages', async ({ page, context }) => {
    /*
    Show all Alert Messages
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'yes',
      'More than 3 alerts': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_showAllAlertMessages(args)
  })
  test('Show 3 Alert Messages', async ({ page, context }) => {
    /*
    Show 3 Alert Messages
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'no',
      'Error from validate service': 'yes',
      'More than 3 alerts': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_show3AlertMessages(args)
  })
  test('Go back to Payment', async ({ page, context }) => {
    /*
    Go back to Payment
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'yes',
      'Both meddelande and referens are shown and empty': 'no',
      'Any validation errors from betalning': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_signeraMottagreLaggTillButtonClicked(args)
    await handles.test_goBackToPayment(args)
  })
  test('*Show avgift section 1', async ({ page, context }) => {
    /*
    *Show avgift section
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_showAvgiftSection(args)
  })
  test('Open info about avgift', async ({ page, context }) => {
    /*
    Open info about avgift
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.action_vadSkaJagBetalaForAvgiftClicked(args)
    await handles.test_openInfoAboutAvgift(args)
  })
  test('https www lansforsakringar se 49334d globalassets aa global dokument prislistor 08198 prislista privat pdf', async ({ page, context }) => {
    /*
    https://www.lansforsakringar.se/49334d/globalassets/aa-global/dokument/prislistor/08198-prislista-privat.pdf
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'no',
      'country isEuEesCountry': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
    /*
    Go back to Payee
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'yes',
      'Any validation errors from mottagare': 'yes'
    }
    const state = await handles.setup({ gateways, page, context } as any)
    const args = { gateways, state, page, context } as any
    await handleServiceCalls(args)
    await handles.start(args)
    await handles.action_franFortsattClicked(args)
    await handles.action_mottagareFortsattClicked(args)
    await handles.test_goBackToPayee(args)
  })
  test('Display error Ange Konto', async ({ page, context }) => {
    /*
    Display error: Ange Konto
    */
    const gateways: GatewayCollection = {
      'Any errors loading data': 'no',
      'empty array from getAccounts': 'no',
      'Is Konto selected': 'no'
    }
    const state = await handles.setup({ gateways, page, context } as any)
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
  'Is country US',
  'is country ibanLength 0',
  'country isEuEesCountry',
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

const handleServiceCalls = async (args: TestArgs<any, any>)=>{
  // im/json/overview/getaccounts  -> ESB/bank/deposit/getAccounts/201411
  await handles.serviceCall_imJsonOverviewGetaccountsEsbBankDepositGetaccounts201411(args)
  // bank/payment/crossborder/countries
  await handles.serviceCall_bankPaymentCrossborderCountries(args)
  // bank/payment/crossborder/currencies
  await handles.serviceCall_bankPaymentCrossborderCurrencies(args)
  // bank/payment/crossborder/crossborder-payments
  await handles.serviceCall_bankPaymentCrossborderCrossborderPayments(args)
  // POST: /payee/sign
  await handles.serviceCall_postPayeeSign(args)
  // POST: /payee/execute
  await handles.serviceCall_postPayeeExecute(args)
  // POST: /payment/sign
  await handles.serviceCall_postPaymentSign(args)
  // POST: payment/execute
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
  test_showBicSwiftOptionalInfotext: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
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
  test_goBackToPaymentSummaryPage: (args: TestArgs<TState, TPageExtensions>, options?: TestOptions) => Promise<void>
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
