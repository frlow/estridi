import { type Mermaid, type MermaidConfig } from 'mermaid'
import {
  type Browser,
  type BrowserType,
  chromium,
  type LaunchOptions,
  type Page,
} from 'playwright-core'
import * as path from 'node:path'
import * as url from 'node:url'

declare const mermaid: Mermaid

export interface CreateMermaidRendererOptions {
  browser?: BrowserType
  launchOptions?: LaunchOptions
}

export interface RenderOptions {
  // css?: Iterable<URL | string> | URL | string | undefined
  // screenshot?: boolean
  mermaidConfig?: MermaidConfig
  // prefix?: string | undefined
}

export type MermaidRenderer = (
  diagrams: string[],
  options?: RenderOptions,
) => Promise<any[]>

interface RenderDiagramsOptions
  extends Required<Pick<RenderOptions, 'mermaidConfig'>> {
  diagrams: string[]
}

async function renderDiagrams({
  diagrams,
  mermaidConfig,
}: RenderDiagramsOptions): Promise<PromiseSettledResult<any>[]> {
  mermaid.initialize(mermaidConfig)
  return Promise.allSettled(
    diagrams.map(async (diagram) => {
      // @ts-ignore
      const diagramResult = await mermaid.mermaidAPI.getDiagramFromText(diagram)
      // @ts-ignore
      const parser = diagramResult.getParser().yy
      return parser.getData()
    }),
  )
}

export function createMermaidRenderer(
  options: CreateMermaidRendererOptions = {},
): MermaidRenderer {
  const { browser = chromium, launchOptions } = options

  let browserPromise: Promise<Browser> | undefined
  let count = 0

  return async (diagrams, renderOptions) => {
    count += 1
    if (!browserPromise) {
      browserPromise = browser?.launch(launchOptions)
    }

    const browserInstance = await browserPromise

    let page: Page | undefined
    let renderResults: PromiseSettledResult<any>[]

    try {
      page = await browserInstance.newPage({ bypassCSP: true })
      // @ts-ignore
      const html = url
        .pathToFileURL(path.join(__dirname, 'index.html'))
        .toString()
      const mermaidScript = { path: path.resolve('mermaid/dist/mermaid.js') }
      await page?.context().route(html, async (route: any) => {
        route.fulfill({
          contentType: 'text/html',
          body: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
</html>
`,
        })
      })
      await page.goto(html)
      const promises = [page.addScriptTag(mermaidScript)]
      await Promise.all(promises)

      renderResults = await page.evaluate(renderDiagrams, {
        diagrams,
        mermaidConfig: {
          fontFamily: 'arial,sans-serif',
          ...renderOptions?.mermaidConfig,
        },
      })
    } finally {
      await page?.close()
      count -= 1
      if (!count) {
        browserPromise = undefined
        browserInstance.close()
      }
    }

    for (const result of renderResults) {
      if (result.status !== 'rejected') {
        continue
      }

      const { reason } = result

      if (
        reason &&
        'name' in reason &&
        'message' in reason &&
        'stack' in reason
      ) {
        Object.setPrototypeOf(reason, Error.prototype)
      }
    }

    return renderResults
  }
}
