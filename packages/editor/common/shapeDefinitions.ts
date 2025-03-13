import { DefaultColorStyle, DefaultDashStyle, StyleProp, T } from 'tldraw'
import { icons } from './icons'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validatable<infer U> ? U : never

const props = {
  w: T.positiveNumber,
  h: T.positiveNumber,
}

export type ShapeDefinition = {
  name: ShapeName
  props: Record<string, T.Validatable<any>>
  icon: keyof typeof icons
}
export type TargetStyle = T.TypeOf<typeof targetStyle>
export const targetStyle = StyleProp.defineEnum('start:target', {
  defaultValue: 'playwright',
  values: ['playwright', 'vitest'],
})

export const Shapes = {
  start: {
    name: 'start',
    props: {
      ...props,
      color: DefaultColorStyle,
      target: targetStyle,
    },
    icon: 'start-icon',
  },
  message: {
    name: 'message',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
      dash: DefaultDashStyle,
    },
    icon: 'message-icon',
  },
  gateway: {
    name: 'gateway',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'gateway-icon',
  },
  connector: {
    name: 'connector',
    props: { ...props },
    icon: 'connector-icon',
  },
  serviceCall: {
    name: 'serviceCall',
    props: {
      ...props,
      w: T.number,
      h: T.number,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'service-call-icon',
  },
  subprocess: {
    name: 'subprocess',
    props: {
      ...props,
      w: T.number,
      h: T.number,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'sub-process-icon',
  },
  script: {
    name: 'script',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'script-icon',
  },
  customNote: {
    name: 'customNote',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'custom-note-icon',
  },
  table: {
    name: 'table',
    props: {
      ...props,
      columns: T.any,
      rows: T.any,
    },
    icon: 'table-icon',
  },
  userAction: {
    name: 'userAction',
    props: {
      ...props,
      w: T.number,
      h: T.number,
      color: DefaultColorStyle,
    },
    icon: 'user-action-icon',
  },
  signalSend: {
    name: 'signalSend',
    props: {
      ...props,
      text: T.string,
      dash: DefaultDashStyle,
      color: DefaultColorStyle,
    },
    icon: 'signal-send-icon',
  },
  signalListen: {
    name: 'signalListen',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'signal-listen-icon',
  },
  loop: {
    name: 'loop',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'loop-icon',
  },
  parallel: {
    name: 'parallel',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'parallel-icon',
  },
  timer: {
    name: 'timer',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
      dash: DefaultDashStyle,
    },
    icon: 'timer-icon',
  },
  error: {
    name: 'error',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'error-icon',
  },
  softError: {
    name: 'softError',
    props: {
      ...props,
      text: T.string,
      color: DefaultColorStyle,
    },
    icon: 'soft-error-icon',
  },
  end: {
    name: 'end',
    props: {
      ...props,
      color: DefaultColorStyle,
    },
    icon: 'end-icon',
  },
  other: {
    name: 'other',
    props: { text: T.string, ...props },
    icon: 'cross',
  },
} as const

export const ShapeNames: (keyof typeof Shapes)[] = Object.keys(
  Shapes,
) as (keyof typeof Shapes)[]
export type ShapeName = keyof typeof Shapes
