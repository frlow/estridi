import type { RunnerHandles } from './runner.test.js'

export type State = {}
export const handles: RunnerHandles = {
  handleSetup: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleStart: async (args) => {
    debugger
    throw 'Not implemented'
  },
  handleServiceCall: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw `${args.key} not implemented`
    }
  },
  handleAction: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw `${args.key} not implemented`
    }
  },
  handleTestNode: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw `${args.key} not implemented`
    }
  }
}
