import type { VitestHandles } from './vitest.test.js'

export type State = {}
export const handles: VitestHandles = {
  handleSetup: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleStart: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleServiceCall: async (key, gateways, args) => {
    switch (key) {
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleAction: async (key, gateways, args) => {
    switch (key) {
      default:
        debugger
        throw `${key} not implemented`
    }
  },
  handleTestNode: async (key, paths, args) => {
    switch (key) {
      default:
        debugger
        throw `${key} not implemented`
    }
  }
}
