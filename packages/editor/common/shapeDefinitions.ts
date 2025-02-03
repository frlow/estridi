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
    icon: 'letter'
  },
  signalSend: {
    name: 'signalSend',
    props: {
      ...props
    },
    icon: 'letter'
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
    icon: 'letter'
  },
  serviceCall: {
    name: 'serviceCall',
    props: {
      ...props
    },
    icon: 'letter'
  },
  userAction: {
    name: 'userAction',
    props: {
      ...props
    },
    icon: 'letter'
  },
  gateway: {
    name: 'gateway',
    props: {
      ...props
    },
    icon: 'letter'
  },
  signalListen: {
    name: 'signalListen',
    props: {
      ...props
    },
    icon: 'letter'
  },
  other: {
    name: 'other',
    props: {
      ...props
    },
    icon: 'circle'
  }
} as const
export const ShapeNames: (keyof typeof Shapes)[] = Object.keys(Shapes) as (keyof typeof Shapes)[]
export type ShapeName = keyof typeof Shapes
