import { format } from 'prettier'

export const prettifyCode = async (code: string) =>
  await format(code, {
    parser: 'typescript',
    semi: false,
    singleQuote: true,
  })
