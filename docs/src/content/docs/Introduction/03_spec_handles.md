---
title: Spec & Handles
---

The generated tests are split into two types of files: The "spec" file and the "handles" file. 

## Spec

The spec file is auto generated and reflects the flowchart from FigJam
It contains the actual tests:

```typescript
test('my awesome test', async ({ page, context }) => {
  const gateways: GatewayCollection = {}
  const state = await handles.setup({ gateways, page, context } as any)
  const args = { gateways, state, page, context } as any
  await handleServiceCalls(args)
  await handles.start(args)

  await handles.test_testingSomethingHere(args)
})
```

It also contains the typescript definition for all the test implementations
```typescript
export type Main<TState={}, TPageExtensions={}> = {
  setup: (args: Omit<TestArgs<TState, TPageExtensions>, 'state'>) => Promise<TState>
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
  test_testingSomethingHere: (args: TestArgs<TState, TPageExtensions>) => Promise<void>
}
```

## Handles

