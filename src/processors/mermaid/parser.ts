import { createRequire } from 'node:module'

import { type Mermaid, type MermaidConfig } from 'mermaid'
import { type Browser, type BrowserType, chromium, type LaunchOptions, type Page } from 'playwright-core'

declare const mermaid: Mermaid

const require = createRequire(import.meta.url)
const html = String(new URL('./index.html', import.meta.url))
const mermaidScript = { path: require.resolve('mermaid/dist/mermaid.js') }

export interface CreateMermaidRendererOptions {
  /**
   * The Playwright browser to use.
   *
   * @default chromium
   */
  browser?: BrowserType

  /**
   * The options used to launch the browser.
   */
  launchOptions?: LaunchOptions
}

// export interface RenderResult {
//   /**
//    * The aria description of the diagram.
//    */
//   description?: string
//
//   /**
//    * The height of the resulting SVG.
//    */
//   height: number
//
//   /**
//    * The DOM id of the SVG node.
//    */
//   id: string
//
//   /**
//    * The diagram SVG rendered as a PNG buffer.
//    */
//   screenshot?: Buffer
//
//   /**
//    * The diagram rendered as an SVG.
//    */
//   svg: string
//
//   /**
//    * The title of the rendered diagram.
//    */
//   title?: string
//
//   /**
//    * The width of the resulting SVG.
//    */
//   width: number
// }

export interface RenderOptions {
  /**
   * A URL that points to a custom CSS file to load.
   *
   * Use this to load custom fonts.
   *
   * This option is ignored in the browser. You need to include the CSS in your build manually.
   */
  css?: Iterable<URL | string> | URL | string | undefined

  /**
   * If true, a PNG screenshot of the diagram will be added.
   *
   * This is only supported in the Node.js.
   */
  screenshot?: boolean

  /**
   * The mermaid configuration.
   *
   * By default `fontFamily` is set to `arial,sans-serif`.
   *
   * This option is ignored in the browser. You need to call `mermaid.initialize()` manually.
   */
  mermaidConfig?: MermaidConfig

  /**
   * The prefix of the id.
   *
   * @default 'mermaid'
   */
  prefix?: string | undefined
}

/**
 * Render Mermaid diagrams in the browser.
 *
 * @param diagrams The Mermaid diagrams to render.
 * @param options Additional options to use when rendering the diagrams.
 * @returns A list of settled promises that contains the rendered Mermaid diagram. Each result
 *   matches the same index of the input diagrams.
 */
export type MermaidRenderer = (
  diagrams: string[],
  options?: RenderOptions
) => Promise<any[]>

interface RenderDiagramsOptions
  extends Required<Pick<RenderOptions, 'mermaidConfig'>> {
  /**
   * The diagrams to process.
   */
  diagrams: string[]
}

/* c8 ignore start */
/**
 * Render mermaid diagrams in the browser.
 *
 * @param options The options used to render the diagrams
 * @returns A settled promise that holds the rendering results.
 */
async function renderDiagrams({
                                diagrams,
                                mermaidConfig
                              }: RenderDiagramsOptions): Promise<PromiseSettledResult<any>[]> {
  mermaid.initialize(mermaidConfig)
  return Promise.allSettled(
    diagrams.map(async (diagram) => {
      // @ts-ignore
      const diagramResult = await mermaid.mermaidAPI.getDiagramFromText(diagram)
      // @ts-ignore
      const parser = diagramResult.getParser().yy
      const edges = parser.getEdges()
      const data = parser.getData()
      return data
    })
  )
}

export function createMermaidRenderer(options: CreateMermaidRendererOptions = {}): MermaidRenderer {
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
`
        })
      })
      await page.goto(html)
      const promises = [page.addScriptTag(mermaidScript)]
      await Promise.all(promises)

      renderResults = await page.evaluate(renderDiagrams, {
        diagrams,
        mermaidConfig: {
          fontFamily: 'arial,sans-serif',
          ...renderOptions?.mermaidConfig
        }
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

      if (reason && 'name' in reason && 'message' in reason && 'stack' in reason) {
        Object.setPrototypeOf(reason, Error.prototype)
      }
    }

    return renderResults
  }
}
