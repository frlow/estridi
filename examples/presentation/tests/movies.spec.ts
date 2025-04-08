import { test, expect } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";
import { handles } from "./movies.js";

test.describe("movies", () => {
  test("Show Title The Movies Page", async ({ page, context }) => {
    const gateways: GatewayCollection = {};
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);

    let testFunc = handles.test_showTitleTheMoviesPage;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.start(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Show input Search", async ({ page, context }) => {
    const gateways: GatewayCollection = {};
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);

    let testFunc = handles.test_showInputSearch;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.start(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Search for movies api movies", async ({ page, context }) => {
    const gateways: GatewayCollection = {};
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);
    await handles.start(args);
    let testFunc = handles.test_searchForMoviesApiMovies;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.action_searchingForMovies(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Show error page", async ({ page, context }) => {
    const gateways: GatewayCollection = {
      "Error from search": "yes",
    };
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);
    await handles.start(args);
    let testFunc = handles.test_showErrorPage;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.action_searchingForMovies(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test("Show No results", async ({ page, context }) => {
    const gateways: GatewayCollection = {
      "Error from search": "no",
      "No movies found": "yes",
    };
    const state = await handles.setup({ gateways, page, context } as any);
    const args = { gateways, state, page, context } as any;
    await handleServiceCalls(args);
    await handles.start(args);
    let testFunc = handles.test_showNoResults;
    if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
    await handles.action_searchingForMovies(args);
    expect(await testFunc(args)).toBeUndefined();
  });
  test.describe("Search Results", () => {
    test("Show movie title movie franchise", async ({ page, context }) => {
      const gateways: GatewayCollection = {
        "Error from search": "no",
        "No movies found": "no",
      };
      const state = await handles.setup({ gateways, page, context } as any);
      const args = { gateways, state, page, context } as any;
      await handleServiceCalls(args);
      await handles.start(args);
      let testFunc = handles.test_showMovieTitleMovieFranchise;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.action_searchingForMovies(args);
      expect(await testFunc(args)).toBeUndefined();
    });
  });
});

export const Gateways = [
  "Error from search",
  "No movies found",
  "Any more",
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
  await handles.serviceCall_searchForMoviesApiMovies(args);
};

export type Movies<TState = {}, TPageExtensions = {}> = {
  setup: (
    args: Omit<TestArgs<TState, TPageExtensions>, "state">,
  ) => Promise<TState>;
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>;
} & MoviesRoot<TState, TPageExtensions> &
  MoviesSearchResults<TState, TPageExtensions>;

export type HandlesGenerics<U = typeof handles> =
  U extends Movies<infer A, infer B> ? [A, B] : never;

export type MoviesRoot<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  serviceCall_searchForMoviesApiMovies: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>;
  action_searchingForMovies: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>;
  test_showTitleTheMoviesPage: TestFunction<TState, TPageExtensions>;
  test_showInputSearch: TestFunction<TState, TPageExtensions>;
  test_searchForMoviesApiMovies: TestFunction<TState, TPageExtensions>;
  test_showErrorPage: TestFunction<TState, TPageExtensions>;
  test_showNoResults: TestFunction<TState, TPageExtensions>;
};

export type MoviesSearchResults<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  test_showMovieTitleMovieFranchise: TestFunction<TState, TPageExtensions>;
};

