import type { Core } from './core.spec'

export const handles: Core = {
  async setup(args) {
    return {}
  },
  async start(args) {

  },
  async serviceCall_loadFromFigmaApi(args) {},
  async test_parseFigmaToScrapedNodeType(args){
    throw "not implemented"
  }
}
