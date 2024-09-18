export const handlesContent = (
  name: string,
  testFileName: string,
) => `import type { ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles } from './${testFileName}'

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
  handleServiceCall: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw \`\${args.key} not implemented\`
    }
  },
  handleAction: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw \`\${args.key} not implemented\`
    }
  },
  handleTestNode: async (args) => {
    switch (args.key) {
      default:
        debugger
        throw \`\${args.key} not implemented\`
    }
  }
}
`

export const handlesKeys = (
  name: string,
  argsType: string,
) => `export type ${name.charAt(0).toUpperCase()}${name.substring(1)}Handles = Handles<
  State,
  GatewayKey,
  ServiceCallKey,
  TestNodeKey,
  ActionKey,
  ${argsType},
  TableKeys
>`
