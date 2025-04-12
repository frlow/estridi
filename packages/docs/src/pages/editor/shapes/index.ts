import { type CSSProperties } from 'react'
import { Message, MessageIntermediate } from './Message.tsx'
import { StartBE, StartFE } from './Start.tsx'
import { EndBe, EndFe } from './End.tsx'
import {
  type ShapeDefinition,
  type ShapeName,
  ShapeNames,
  type ShapeProps,
} from 'editor-common'
import {
  BaseBoxShapeTool,
  ShapeUtil,
  type TLBaseShape,
  type TLShapeUtilConstructor,
} from 'tldraw'
import { Script, ScriptBe } from './Script.tsx'
import UserAction from './UserAction.tsx'
import {
  GatewayBe,
  GatewayFe,
  LoopBe,
  LoopFe,
  ParallelBe,
  ParallelFe,
} from './Gateway.tsx'
import {
  ServiceCallBe,
  ServiceCallBeExternal,
  ServiceCallFe,
} from './ServiceCall.tsx'
import {
  SignalSendBe,
  SignalSendBeInter,
  SignalSendFe,
  SignalSendFeInter,
} from './SignalSend.tsx'
import {
  SignalListenBe,
  SignalListenBeInter,
  SignalListenFe,
  SignalListenFeInter,
} from './SignalListen.tsx'
import { TableBE, TableFE } from './Table.tsx'
import Connector from './Connector.tsx'
import CustomNote from './CustomNote.tsx'
import Other from './Other.tsx'
import { HardError, SoftError } from './Error.tsx'
import {
  DevDone,
  InProgress,
  NotStarted,
  TestDone,
  TestFailed,
} from './TestResult.tsx'
import { TimerBE, TimerFE } from './Timer.tsx'
import { FrameShapeUtil } from './frame/FrameShapeUtil.tsx'
import Database from './Database.tsx'
import CameraMover from './CameraMover.tsx'
import { SubprocessBE, SubprocessFE } from './Subprocess.tsx'

const customShapeDefinitions: Record<
  ShapeName,
  TLShapeUtilConstructor<any, ShapeUtil<any>>
> = {
  'custom-note': CustomNote,
  'gateway-fe': GatewayFe,
  'gateway-be': GatewayBe,
  'loop-fe': LoopFe,
  'loop-be': LoopBe,
  'parallel-fe': ParallelFe,
  'parallel-be': ParallelBe,
  'script-fe': Script,
  'script-be': ScriptBe,
  'service-call-fe': ServiceCallFe,
  'service-call-be': ServiceCallBe,
  'service-call-be-external': ServiceCallBeExternal,
  'signal-send-fe': SignalSendFe,
  'signal-send-be': SignalSendBe,
  'signal-send-fe-inter': SignalSendFeInter,
  'signal-send-be-inter': SignalSendBeInter,
  'signal-listen-fe': SignalListenFe,
  'signal-listen-be': SignalListenBe,
  'signal-listen-fe-inter': SignalListenFeInter,
  'signal-listen-be-inter': SignalListenBeInter,
  'subprocess-fe': SubprocessFE,
  'subprocess-be': SubprocessBE,
  'user-action': UserAction,
  message: Message,
  'message-inter': MessageIntermediate,
  'start-fe': StartFE,
  'start-be': StartBE,
  'end-fe': EndFe,
  'end-be': EndBe,
  other: Other,
  'table-fe': TableFE,
  'table-be': TableBE,
  connector: Connector,
  error: HardError,
  'soft-error': SoftError,
  'timer-fe': TimerFE,
  'timer-be': TimerBE,
  'not-started': NotStarted,
  'in-progress': InProgress,
  'test-done': TestDone,
  'dev-done': DevDone,
  'test-failed': TestFailed,
  frame: FrameShapeUtil,
  database: Database,
  'camera-mover': CameraMover,
}

export const customShapes = Object.values(customShapeDefinitions)

export const customTools = ShapeNames.map(
  (name) =>
    class extends BaseBoxShapeTool {
      static override id = name
      override shapeType = name
    },
)

export const baseStyle: CSSProperties = {
  pointerEvents: 'all',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 8,
}

export const figureStyles: CSSProperties = {
  background: '#83BBE5',
  border: '4px solid black',
}

export const internalInputStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
}

export type BaseShape<T extends ShapeDefinition> = TLBaseShape<
  T['name'],
  ShapeProps<T['props']>
>
