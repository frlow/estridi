import { expect } from '@playwright/test'
import { Main } from './playwrightReference.spec.js'
import { CallHandler, partialHandles } from './utils.js'

const endpoints = {
  accounts: '/api/accounts',
  countries: '/api/countries'
}

export const handles = partialHandles<Main<{ callHandler: CallHandler }>>({
  async setup() {
    return { callHandler: new CallHandler() }
  },
  async start(args) {
    await args.page.context().route('/', async (route) => {
      await route.fulfill({
        contentType: 'text/html',
        body: `<!DOCTYPE html>
<html>
<head>
<title>Title of the document</title>
<script>
  window.setTimeout(() => {
        fetch('${endpoints.accounts}', {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: 'dummy' })
        })
        fetch('${endpoints.countries}', {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: 'dummy' })
        })
      }, 500)
</script>
</head>

<body>
The content of the document......
</body>

</html>`
      })
    })
    await args.page.goto('/')
  },
  async serviceCall_imJsonOverviewGetaccountsEsbBankDepositGetaccounts201411(args) {
    await args.context.route(endpoints.accounts, async route => {
      args.state.callHandler.handleCall(endpoints.accounts, route.request().postDataJSON())
      await route.fulfill({
        contentType: 'application/json',
        json: { value: 'some response' }
      })
    })
  },
  async serviceCall_bankPaymentCrossborderCountries(args) {
    await args.context.route(endpoints.countries, async route => {
      args.state.callHandler.handleCall(endpoints.countries, route.request().postDataJSON())
      await route.fulfill({
        contentType: 'application/json',
        json: { value: 'some response' }
      })
    })
  },
  async test_imJsonOverviewGetaccountsEsbBankDepositGetaccounts201411(args) {
    /*
    Waiting for call that has not happened yet
     */
    expect(await args.state.callHandler.waitForCall(endpoints.accounts)).toStrictEqual({ value: 'dummy' })
  },
  async test_bankPaymentCrossborderCountries(args) {
    /*
    Waiting for call that has already happened
     */
    await new Promise(r => setTimeout(() => r(''), 1000))
    expect(await args.state.callHandler.waitForCall(endpoints.countries)).toStrictEqual({ value: 'dummy' })
  }
})
