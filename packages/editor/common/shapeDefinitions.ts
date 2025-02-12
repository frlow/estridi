import { T } from 'tldraw'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validator<infer U> ? U : never

const props = {
  w: T.positiveNumber,
  h: T.positiveNumber,
  text: T.string
}

export type ShapeDefinition = {
  name: ShapeName,
  props: Record<string, T.Validator<any>>,
  icon: string
}
export const Shapes = {
  message: {
    name: 'message',
    props: {
      ...props
    },
    icon: 'letter'
  },
  script: {
    name: 'script',
    props: {
      ...props
    },
    icon: 'cross'
  },
  signalSend: {
    name: 'signalSend',
    props: {
      ...props
    },
    icon: 'cross'
  }, start: {
    name: 'start',
    props: {
      ...props
    },
    icon: 'circle'
  },
  subprocess: {
    name: 'subprocess',
    props: {
      ...props
    },
    icon: 'cross'
  },
  serviceCall: {
    name: 'serviceCall',
    props: {
      ...props
    },
    icon: 'cross'
  },
  userAction: {
    name: 'userAction',
    props: {
      ...props
    },
    icon: 'cross'
  },
  gateway: {
    name: 'gateway',
    props: {
      ...props
    },
    icon: 'diamond'
  },
  signalListen: {
    name: 'signalListen',
    props: {
      ...props
    },
    icon: 'cross'
  },
  table: {
    name: 'table',
    props: {
      ...props,
      rows: T.array
    },
    icon: 'cross'
  },
  other: {
    name: 'other',
    props: {
      ...props
    },
    icon: 'cross'
  },
  connector: {
    name: 'connector',
    props: {
      ...props
    },
    icon: 'diamond-black'
  }
} as const
export const ShapeNames: (keyof typeof Shapes)[] = Object.keys(Shapes) as (keyof typeof Shapes)[]
export type ShapeName = keyof typeof Shapes
