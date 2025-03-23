import { CSSProperties } from 'react'
import { Message, MessageIntermediate } from './Message.tsx'
import { StartFE, StartBE } from './Start.tsx'
import { EndFe, EndBe } from './End.tsx'
import {
  ShapeDefinition,
  ShapeName,
  ShapeNames,
  ShapeProps,
} from 'editor-common'
import {
  BaseBoxShapeTool,
  ShapeUtil,
  TLBaseShape,
  TLShapeUtilConstructor,
} from 'tldraw'
import { Script, ScriptBe } from './Script.tsx'
import UserAction from './UserAction.tsx'
import { SubprocessFE, SubprocessBE } from './Subprocess.tsx'
import {
  GatewayFe,
  GatewayBe,
  LoopFe,
  LoopBe,
  ParallelFe,
  ParallelBe,
} from './Gateway.tsx'
import {
  ServiceCallFe,
  ServiceCallBe,
  ServiceCallBeExternal,
} from './ServiceCall.tsx'
import {
  SignalSendFe,
  SignalSendBe,
  SignalSendFeInter,
  SignalSendBeInter,
} from './SignalSend.tsx'
import {
  SignalListenFe,
  SignalListenBe,
  SignalListenFeInter,
  SignalListenBeInter,
} from './SignalListen.tsx'
import { TableBE, TableFE } from './Table.tsx'
import Connector from './Connector.tsx'
import CustomNote from './CustomNote.tsx'
import Other from './Other.tsx'
import { HardError, SoftError } from './Error.tsx'
import {
  NotStarted,
  InProgress,
  TestDone,
  DevDone,
  TestFailed,
} from './TestResult.tsx'
import { TimerFE, TimerBE } from './Timer.tsx'
import { FrameShapeUtil } from './frame/FrameShapeUtil.tsx'
import Database from './Database.tsx'

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
