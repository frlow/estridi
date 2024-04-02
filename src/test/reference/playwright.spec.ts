import { test, Page, BrowserContext } from '@playwright/test'
import { createTester, Handles } from 'estridi'
import scraped from './scraped.json'
import { handles, State } from './playwright.handles.js'
const { allPaths, testNode, testPath } = createTester(scraped, '1:115', handles)
const t = (id: string) => ({context, page}: {context: BrowserContext, page: Page}) => testNode(id, {context, page})
test.describe('playwright', () => {
  test('message: Could not load page, 1:127', t('1:127'))
  test('message: Display stuff, 1:124', t('1:124'))
  test('subprocess: Some subflow, 4:215', t('4:215'))
  test('script: Show box, 4:252', t('4:252'))
  test('subprocess: Validate fields My fields, 4:456', t('4:456'))
  test('script: Clear page, 4:357', t('4:357'))
  test('script: Do thing with thing, 100:594', t('100:594'))
  if (process.env.TEST_ALL_PATHS === 'true')
    test.describe('all paths', () => {
      for (const path of allPaths) {
        test(path.join(', '), ({ context, page }) => testPath(path, { context, page }))
      }
    })
})

export type GatewayKey = 
  | '1:117: Errors from demo'
  | '4:199: A or B'
  | '35:527: Has more'
export type ServiceCallKey = 
  | '1:116: api call demo'
export type ActionKey = 
  | '4:322: Cancel'
export type TestNodeKey = 
  | '1:127: Could not load page'
  | '1:124: Display stuff'
  | '4:215: Some subflow'
  | '4:252: Show box'
  | '4:456: Validate fields My fields'
  | '4:357: Clear page'
  | '100:594: Do thing with thing'
export type TableKeys = 
  | '1:601: My Fields'

export type PlaywrightHandles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  {page: Page, context: BrowserContext},
  TableKeys
>