import type { Playwright } from './playwright.spec'
import { expect } from '@playwright/test'


const page = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Starter Page</title>
    <script src="//unpkg.com/alpinejs" defer></script>
</head>
<body x-data="{ colors: [], state: 'loading', error: '', firstName: '', lastName: '', color: '', errors: {}, colorIndex: 0 }" 
      x-init="fetch('/api/colors').then(r=>{if(!r.ok) throw new Error('Failed to load colors'); return r.json()}).then(data=>{colors=data; state='user'}).catch(e=>{error='Failed to load colors'; state='user'})">
    <template x-if="state === 'loading'">
    <div id="loading-block">...Loading</div>
    </template>
    <template x-if="state === 'user'">
      <div id="user-block">
        <template x-if="error">
          <div class="error" x-text="error"></div>
        </template>
        <label for="first-name">First Name</label>
        <input id="first-name" x-model="firstName">
        <template x-if="errors.firstName">
          <div class="error" x-text="errors.firstName"></div>
        </template>
        <label for="last-name">Last Name</label>
        <input id="last-name" x-model="lastName">
        <template x-if="errors.lastName">
          <div class="error" x-text="errors.lastName"></div>
        </template>
        <label for="color">Color</label>
        <select id="color" x-model="color">
          <template x-for="color in colors">
            <option x-text="color"></option>
          </template>
        </select>
        <button @click="if(!firstName) errors.firstName='First name is required'; if(!lastName) errors.lastName='Last name is required'; if(!firstName || !lastName) return; $dispatch('user-added'); state='welcome'">Add user</button>
      </div>
    </template>
    <template x-if="state === 'welcome'">
      <div id="welcome-block">
        <h1 :style="{ color: colorIndex === 0 ? color : colors[colorIndex] }" @click="colorIndex = (colorIndex + 1) % colors.length">Welcome</h1>
        <p x-text="firstName + ' ' + lastName"></p>
      </div>
    </template>
</body>
</html>
`

export const handles: Playwright = {

  async setup({ context }) {
    await context.route('https://example.com', (route, request) => {
      route.fulfill({
        status: 200,
        headers: {
          'content-type': 'text/html',
        },
        body: page,
      })
    })
    return {}
  },

  async start({ page }) {
    await page.goto('https://example.com')
  },

  async serviceCall_apiColors({ context, gateways }) {
    await context.route('https://example.com/api/colors', (route, request) => {
      if (gateways["Errors loading colors"] === "yes") {
        route.fulfill({
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ error: 'Failed to load colors' }),
        })
      } else {
        route.fulfill({
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(['red', 'blue', 'green']),
        })
      }
    })
  },

  async test_apiColors({ page }, _) {
    const requestPromise = page.waitForRequest('https://example.com/api/colors')
    return async () => {
      const request = await requestPromise
      expect(request).toBeTruthy()
    }
  },

  async test_showInputsFirstNameLastNameColor({page}){
    await expect(page.getByLabel("First name")).toBeVisible()
    await expect(page.getByLabel("Last name")).toBeVisible()
    await expect(page.getByLabel("Color")).toBeVisible()
  },

  async action_addUserClicked({ page, gateways }) {
    if (gateways["Any User validation errors"] !== "yes") {
      if (gateways["Validate Fields User"] !== "First name") {
        await page.getByLabel("First name").fill("John");
      }
      if (gateways["Validate Fields User"] !== "Last name") {
        await page.getByLabel("Last name").fill("Doe");
      }
      await page.getByLabel("Color").selectOption("red");
    }
    await page.getByRole('button', { name: 'Add user' }).click();
  },

  async test_showErrorLoadingColors({ page }) {
    await expect(page.getByText("Failed to load colors")).toBeVisible();
  },

  async action_welcomeClicked({ page }) {
    await page.getByRole('heading', { name: 'Welcome' }).click();
  },

  async test_showWelcomeHeaderWithColor({ page }) {
    await expect(page.locator("#user-block")).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome' })).toHaveCSS('color', 'rgb(255, 0, 0)'); // red color
  },

  async test_showFirstNameLastName({ page }) {
    await expect(page.getByText("John Doe")).toBeVisible();
  },

  async test_rotateColor({ page }) {
    await expect(page.getByRole('heading', { name: 'Welcome' })).toHaveCSS('color', 'rgb(0, 0, 255)'); // blue color
  },

  async test_validateFieldsUserFirstName({ page }) {
    await expect(page.getByText("First name is required")).toBeVisible();
  },

  async test_validateFieldsUserLastName({ page }) {
    await expect(page.getByText("Last name is required")).toBeVisible();
  },

  async test_validateFieldsUserColor({ page }) {
    // Color is optional, no validation needed
  },

  async test_displayErrors({ page }) {
    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Last name is required")).toBeVisible();
  },
}
