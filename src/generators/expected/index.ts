import { Handles } from './utils'

export const handles: Handles = {
  handleStart: async (args) => {
    debugger
    throw("Start not implemented")
  },
  handleServiceCall: async (key, gateways, args) => {
    debugger
    switch (key){
      default: throw(`${key} not implemented`)
    }
  },
  handleAction: async (args, key) => {
    debugger
    switch (key){
      default: throw(`${key} not implemented`)
    }
  },
  handleTestNode: async (args, key) => {
    debugger
    switch (key){
      default: throw(`${key} not implemented`)
    }
  }
}
