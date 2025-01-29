import { T } from 'tldraw'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validator<infer U> ? U : never

const wh = {
  w: T.positiveNumber,
  h: T.positiveNumber
}

export const Shapes = {
  message: {
    name: 'message',
    props: {
      ...wh
    },
    icon: 'letter'
  },
  start: {
    name: 'start',
    props: {
      ...wh
    },
    icon: 'circle'
  }
} as const
export const ShapeNames = Object.keys(Shapes)
