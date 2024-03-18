import { test } from '@playwright/test'
import { testNode } from './index'


test.describe('messages', () => {
  test('Could not load page', async ({ page, context }) => await testNode({ page, context }, '3085:4080'))
})

test.describe('scripts', () => {

})

