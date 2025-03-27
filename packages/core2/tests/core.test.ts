import { test, expect, describe } from "vitest";
import { handles } from "./core.js";

describe("core", () => {
  describe("Load Scraped", () => {
    describe("Process Figma", () => {
      test("Load From Figma API", async () => {
        const gateways: GatewayCollection = {
          "Source type": "figma",
        };
        const state = await handles.setup({ gateways } as any);
        const args = { gateways, state } as any;
        await handleServiceCalls(args);

        let testFunc = handles.test_loadFromFigmaApi;
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
        await handles.start(args);
        expect(await testFunc(args)).toBeUndefined();
      });
      describe("Parse Figma To Scraped Node Type", () => {
        const testNode = async ({
          tableRow,
        }: {
          tableRow: Record<string, string>;
        }) => {
          const gateways: GatewayCollection = {
            "Source type": "figma",
          };
          const state = await handles.setup({ gateways, tableRow } as any);
          const args = { gateways, state, tableRow } as any;
          await handleServiceCalls(args);

          let testFunc = handles.test_parseFigmaToScrapedNodeType;
          if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
          await handles.start(args);
          expect(await testFunc(args)).toBeUndefined();
        };

        test("base", async () => {
          const tableRow = {
            Id: "base",
            Properties: "",
          };
          await testNode({ tableRow });
        });

        test("connector", async () => {
          const tableRow = {
            Id: "connector",
            Properties: "next",
          };
          await testNode({ tableRow });
        });

        test("table", async () => {
          const tableRow = {
            Id: "table",
            Properties: "rows",
          };
          await testNode({ tableRow });
        });

        test("script", async () => {
          const tableRow = {
            Id: "script",
            Properties: "variant, next",
          };
          await testNode({ tableRow });
        });

        test("message", async () => {
          const tableRow = {
            Id: "message",
            Properties: "variant, next",
          };
          await testNode({ tableRow });
        });

        test("signalSend", async () => {
          const tableRow = {
            Id: "signalSend",
            Properties: "variant, next",
          };
          await testNode({ tableRow });
        });

        test("serviceCall", async () => {
          const tableRow = {
            Id: "serviceCall",
            Properties: "next",
          };
          await testNode({ tableRow });
        });

        test("start", async () => {
          const tableRow = {
            Id: "start",
            Properties: "next",
          };
          await testNode({ tableRow });
        });

        test("root", async () => {
          const tableRow = {
            Id: "root",
            Properties: "next",
          };
          await testNode({ tableRow });
        });

        test("end", async () => {
          const tableRow = {
            Id: "end",
            Properties: "",
          };
          await testNode({ tableRow });
        });

        test("gateway", async () => {
          const tableRow = {
            Id: "gateway",
            Properties: "options, variant",
          };
          await testNode({ tableRow });
        });

        test("loop", async () => {
          const tableRow = {
            Id: "loop",
            Properties: "options, variant",
          };
          await testNode({ tableRow });
        });

        test("parallel", async () => {
          const tableRow = {
            Id: "parallel",
            Properties: "options, variant",
          };
          await testNode({ tableRow });
        });

        test("subprocess", async () => {
          const tableRow = {
            Id: "subprocess",
            Properties: "next, link",
          };
          await testNode({ tableRow });
        });

        test("subprocessTable", async () => {
          const tableRow = {
            Id: "subprocessTable",
            Properties: "next, link, tableKey",
          };
          await testNode({ tableRow });
        });

        test("subprocessActions", async () => {
          const tableRow = {
            Id: "subprocessActions",
            Properties: "next, actions",
          };
          await testNode({ tableRow });
        });

        test("userAction", async () => {
          const tableRow = {
            Id: "userAction",
            Properties: "next, actions",
          };
          await testNode({ tableRow });
        });
      });
    });
  });
  describe("Prepare Testable Nodes", () => {
    // table Roots Cases not found!
    test("Filter nodes connected to root", async () => {
      const gateways: GatewayCollection = {
        "Each root": "",
      };
      const state = await handles.setup({ gateways } as any);
      const args = { gateways, state } as any;
      await handleServiceCalls(args);

      let testFunc = handles.test_filterNodesConnectedToRoot;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.start(args);
      expect(await testFunc(args)).toBeUndefined();
    });
    test("Filter connected tables", async () => {
      const gateways: GatewayCollection = {
        "Each root": "",
      };
      const state = await handles.setup({ gateways } as any);
      const args = { gateways, state } as any;
      await handleServiceCalls(args);

      let testFunc = handles.test_filterConnectedTables;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.start(args);
      expect(await testFunc(args)).toBeUndefined();
    });
    test("Inject virtual nodes", async () => {
      const gateways: GatewayCollection = {
        "Each root": "",
        "Virtual nodes enabled": "yes",
      };
      const state = await handles.setup({ gateways } as any);
      const args = { gateways, state } as any;
      await handleServiceCalls(args);

      let testFunc = handles.test_injectVirtualNodes;
      if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
      await handles.start(args);
      expect(await testFunc(args)).toBeUndefined();
    });
  });
  describe("Generate Test File", () => {
    describe("Generate Playwright", () => {
      test("Generate testable node tree", async () => {
        const gateways: GatewayCollection = {
          "Target Type": "playwright",
          "": "",
        };
        const state = await handles.setup({ gateways } as any);
        const args = { gateways, state } as any;
        await handleServiceCalls(args);

        let testFunc = handles.test_generateTestableNodeTree;
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
        await handles.start(args);
        expect(await testFunc(args)).toBeUndefined();
      });
      test("Generate type objects", async () => {
        const gateways: GatewayCollection = {
          "Target Type": "playwright",
          "": "",
        };
        const state = await handles.setup({ gateways } as any);
        const args = { gateways, state } as any;
        await handleServiceCalls(args);

        let testFunc = handles.test_generateTypeObjects;
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
        await handles.start(args);
        expect(await testFunc(args)).toBeUndefined();
      });
      test("Generate test block", async () => {
        const gateways: GatewayCollection = {
          "Target Type": "playwright",
          "": "",
        };
        const state = await handles.setup({ gateways } as any);
        const args = { gateways, state } as any;
        await handleServiceCalls(args);

        let testFunc = handles.test_generateTestBlock;
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
        await handles.start(args);
        expect(await testFunc(args)).toBeUndefined();
      });
      test("Generate handles type block", async () => {
        const gateways: GatewayCollection = {
          "Target Type": "playwright",
          "": "",
        };
        const state = await handles.setup({ gateways } as any);
        const args = { gateways, state } as any;
        await handleServiceCalls(args);

        let testFunc = handles.test_generateHandlesTypeBlock;
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
        await handles.start(args);
        expect(await testFunc(args)).toBeUndefined();
      });
      test("Generate test file", async () => {
        const gateways: GatewayCollection = {
          "Target Type": "playwright",
          "": "",
        };
        const state = await handles.setup({ gateways } as any);
        const args = { gateways, state } as any;
        await handleServiceCalls(args);

        let testFunc = handles.test_generateTestFile;
        if (testFunc.length === 2) testFunc = (await testFunc(args)) as any;
        await handles.start(args);
        expect(await testFunc(args)).toBeUndefined();
      });
    });
  });
});

export const Gateways = [
  "Target Type",
  "",
  "Each root",
  "Virtual nodes enabled",
  "More root nodes",
  "Source type",
] as const;

export type GatewayKey = (typeof Gateways)[number];
export type GatewayCollection = Partial<Record<GatewayKey, string>>;

export type TestArgs<TState, TPageExtensions> = {
  gateways: GatewayCollection;
  state: TState & TPageExtensions;

  tableRow?: Record<string, string>;
};

export type TestFunction<TState, TPageExtensions> = (
  args: TestArgs<TState, TPageExtensions>,
  usesPrepareFunction?: undefined,
) => Promise<void | (() => Promise<void>)>;

const handleServiceCalls = async (args: TestArgs<any, any>) => {
  // Load From Figma API
  await handles.serviceCall_loadFromFigmaApi(args);
};

export type Core<TState = {}, TPageExtensions = {}> = {
  setup: (
    args: Omit<TestArgs<TState, TPageExtensions>, "state">,
  ) => Promise<TState>;
  start: (args: TestArgs<TState, TPageExtensions>) => Promise<void>;
} & CoreRoot<TState, TPageExtensions> &
  CoreGenerateTestFile<TState, TPageExtensions> &
  CoreGeneratePlaywright<TState, TPageExtensions> &
  CorePrepareTestableNodes<TState, TPageExtensions> &
  CoreLoadScraped<TState, TPageExtensions> &
  CoreProcessFigma<TState, TPageExtensions>;

export type HandlesGenerics<U = typeof handles> =
  U extends Core<infer A, infer B> ? [A, B] : never;

export type CoreRoot<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {};

export type CoreGenerateTestFile<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {};

export type CoreGeneratePlaywright<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  test_generateTestableNodeTree: TestFunction<TState, TPageExtensions>;
  test_generateTestBlock: TestFunction<TState, TPageExtensions>;
  test_generateTestFile: TestFunction<TState, TPageExtensions>;
  test_generateTypeObjects: TestFunction<TState, TPageExtensions>;
  test_generateHandlesTypeBlock: TestFunction<TState, TPageExtensions>;
};

export type CorePrepareTestableNodes<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  test_findRootsRootsCases: TestFunction<TState, TPageExtensions>;
  test_filterNodesConnectedToRoot: TestFunction<TState, TPageExtensions>;
  test_filterConnectedTables: TestFunction<TState, TPageExtensions>;
  test_injectVirtualNodes: TestFunction<TState, TPageExtensions>;
};

export type CoreLoadScraped<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {};

export type CoreProcessFigma<
  TState = HandlesGenerics[0],
  TPageExtensions = HandlesGenerics[1],
> = {
  serviceCall_loadFromFigmaApi: (
    args: TestArgs<TState, TPageExtensions>,
  ) => Promise<void>;
  test_loadFromFigmaApi: TestFunction<TState, TPageExtensions>;
  test_parseFigmaToScrapedNodeType: TestFunction<TState, TPageExtensions>;
};
