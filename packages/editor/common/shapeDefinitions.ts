import { T } from 'tldraw'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validator<infer U> ? U : never

export const Shapes = {
  message: {
    name: 'message',
    props: {
      w: T.positiveNumber,
      h: T.positiveNumber,
      count: T.number
    },
    icon: 'color'
  },
  start: {
    name: 'start',
    props: {
      w: T.positiveNumber,
      h: T.positiveNumber,
    },
    icon: 'color'
  }
} as const
export const ShapeNames = Object.keys(Shapes)
