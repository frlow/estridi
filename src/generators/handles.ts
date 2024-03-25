export const handlesContent = (name: string, testFileName: string)=>`import type { ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles } from './${testFileName}'

export type State = {}
export const handles: ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles = {
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
        throw \`\${key} not implemented\`
    }
  },
  handleAction: async (key, gateways, args) => {
    switch (key) {
      default:
        debugger
        throw \`\${key} not implemented\`
    }
  },
  handleTestNode: async (key, paths, args) => {
    switch (key) {
      default:
        debugger
        throw \`\${key} not implemented\`
    }
  }
}
`
