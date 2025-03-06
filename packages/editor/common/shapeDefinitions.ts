import { DefaultColorStyle, DefaultDashStyle, T } from 'tldraw'
import { icons } from './icons'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validator<infer U> ? U : never

const props = {
  w: T.positiveNumber,
  h: T.positiveNumber,
  text: T.string,
}

export type ShapeDefinition = {
  name: ShapeName
  props: Record<string, T.Validator<any>>
  icon: keyof typeof icons
}
export const Shapes = {
  message: {
    name: 'message',
    props: {
      ...props,
      color: DefaultColorStyle,
      dash: DefaultDashStyle,
    },
    icon: 'letter',
  },
  script: {
    name: 'script',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'script',
  },
  signalSend: {
    name: 'signalSend',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'triangle',
  },
  start: {
    name: 'start',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'circle',
  },
  end: {
    name: 'end',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'circle',
  },
  subprocess: {
    name: 'subprocess',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'sub-process',
  },
  serviceCall: {
    name: 'serviceCall',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'gear',
  },
  userAction: {
    name: 'userAction',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'user-action',
  },
  gateway: {
    name: 'gateway',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'diamond',
  },
  loop: {
    name: 'loop',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'loop',
  },
  signalListen: {
    name: 'signalListen',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'triangle-white',
  },
  table: {
    name: 'table',
    props: {
      ...props,
      rows: T.arrayOf(T.any),
      columns: T.arrayOf(T.any),
    },
    icon: 'cross',
  },
  other: {
    name: 'other',
    props: {
      ...props,
    },
    icon: 'cross',
  },
  connector: {
    name: 'connector',
    props: {
      ...props,
    },
    icon: 'diamond-black',
  },
  customNote: {
    name: 'customNote',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'diamond-black',
  },
} as const

export const ShapeNames: (keyof typeof Shapes)[] = Object.keys(
  Shapes,
) as (keyof typeof Shapes)[]
export type ShapeName = keyof typeof Shapes
