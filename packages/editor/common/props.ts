import { T } from 'tldraw'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>}

type ExtractGenericArgs<T> = T extends T.Validator<infer U> ? U : never

export const CounterShapeProps = {
  w: T.positiveNumber,
  h: T.positiveNumber,
  count: T.number
}
