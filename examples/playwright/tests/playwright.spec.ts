import { test, expect } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";
import { handles } from "./playwright.js";

test.describe("playwright", () => {
  test("api colors", async ({ page, context }) => {
    const gateways: GatewayCollection = {};
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);

    let testFunc = handles.test_apiColors;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.start(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Show inputs First name Last name Color", async ({ page, context }) => {
    const gateways: GatewayCollection = {
      "Errors loading colors": "no",
    };
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);

    let testFunc = handles.test_showInputsFirstNameLastNameColor;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.start(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Show Error loading colors", async ({ page, context }) => {
    const gateways: GatewayCollection = {
      "Errors loading colors": "yes",
    };
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);

    let testFunc = handles.test_showErrorLoadingColors;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.start(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Display errors", async ({ page, context }) => {
    const gateways: GatewayCollection = {
      "Errors loading colors": "no",
      "Any User validation errors": "yes",
    };
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);
    await handles.start(args);
    let testFunc = handles.test_displayErrors;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.action_addUserClicked(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test.describe("Validate Fields User", () => {
    test("Validate Fields User First name", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Errors loading colors": "no",
        "Validate Fields User": "First name",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      let testFunc = handles.test_validateFieldsUserFirstName;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_addUserClicked(args);
      expect(await testFunc(args)).toBeUndefined();
    });
    test("Validate Fields User Last name", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Errors loading colors": "no",
        "Validate Fields User": "Last name",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      let testFunc = handles.test_validateFieldsUserLastName;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_addUserClicked(args);
      expect(await testFunc(args)).toBeUndefined();
    });
    test("Validate Fields User Color", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Errors loading colors": "no",
        "Validate Fields User": "Color",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      let testFunc = handles.test_validateFieldsUserColor;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_addUserClicked(args);
      expect(await testFunc(args)).toBeUndefined();
    });
  });
  test.describe("Show Welcome page", () => {
    test("Show Welcome header with color", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Errors loading colors": "no",
        "Any User validation errors": "no",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      let testFunc = handles.test_showWelcomeHeaderWithColor;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_addUserClicked(args);
      expect(await testFunc(args)).toBeUndefined();
    });
    test("Show First name Last name", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Errors loading colors": "no",
        "Any User validation errors": "no",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      let testFunc = handles.test_showFirstNameLastName;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_addUserClicked(args);
      expect(await testFunc(args)).toBeUndefined();
    });
    test("Rotate color", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Errors loading colors": "no",
        "Any User validation errors": "no",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      await handles.action_addUserClicked(args);
      let testFunc = handles.test_rotateColor;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_welcomeClicked(args);
      expect(await testFunc(args)).toBeUndefined();
    });
  });
});

export const Gateways = [
  "Errors loading colors",
  "Any User validation errors",
  "Validate Fields User",
] as const;

export type GatewayKey = (typeof Gateways)[number];
export type GatewayCollection = Partial<Record<GatewayKey, string>>;

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection;
  state: TState;
  page: Page & TPageExtensions;
  context: BrowserContext;
};

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined,
) => Promise<void | (() => Promise<void>)>;

const handleServiceCalls = async (args: TestArgs<any, any>) => {
  await handles.serviceCall_apiColors(args);
};

export type Playwright<TState = {}, TPageExtensions = {}> = {
  setup: (
    args: Omit<TestArgs<TState, TPageExtensions>, "state">,
  ) => Promise<TState>;
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>;
} & PlaywrightRoot<TState, TPageExtensions> &
  PlaywrightValidateFieldsUser<TState, TPageExtensions> &
  PlaywrightShowWelcomePage<TState, TPageExtensions>;

export type HandlesGenerics<U = typeof handles> =
  U extends Playwright<infer A, infer B> ? [A, B] : never;

export type PlaywrightRoot<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  serviceCall_apiColors: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>;
  action_addUserClicked: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>;
  test_apiColors: TestFunction<TState, TPageExtensions>;
  test_showInputsFirstNameLastNameColor: TestFunction<TState, TPageExtensions>;
  test_showErrorLoadingColors: TestFunction<TState, TPageExtensions>;
  test_displayErrors: TestFunction<TState, TPageExtensions>;
};

export type PlaywrightValidateFieldsUser<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  test_validateFieldsUserFirstName: TestFunction<TState, TPageExtensions>;
  test_validateFieldsUserLastName: TestFunction<TState, TPageExtensions>;
  test_validateFieldsUserColor: TestFunction<TState, TPageExtensions>;
};

export type PlaywrightShowWelcomePage<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  action_welcomeClicked: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>;
  test_showWelcomeHeaderWithColor: TestFunction<TState, TPageExtensions>;
  test_showFirstNameLastName: TestFunction<TState, TPageExtensions>;
  test_rotateColor: TestFunction<TState, TPageExtensions>;
};
