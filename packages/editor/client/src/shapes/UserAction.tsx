import {
  BaseBoxShapeUtil,
  createShapeId,
  HTMLContainer,
  stopEventPropagation,
  TLShape,
  TLShapeId,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { BLUE, BORDER, BORDER_RADIUS, CIRCLE_RADIUS } from './util/constants.ts'
import {
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
} from './util/constants.ts'
import { createArrow } from './util/util.ts'
import React from 'react'

const shapeType = Shapes['user-action']
type ShapeType = BaseShape<typeof shapeType>

export type { ShapeType }

type FlowType = 'subprocess' | 'signal-listen'
interface FlowConfig {
  targetType: string
  icon: string
  getTargetX: (baseX: number, offset: number) => number
}

const flowConfigs: Record<FlowType, FlowConfig> = {
  subprocess: {
    targetType: 'subprocess-fe',
    icon: '/subprocess-fe-preview.svg',
    getTargetX: (baseX: number, offset: number) =>
      baseX + (100 + offset) - RECTANGLE_DEFAULT_WIDTH / 2,
  },
  'signal-listen': {
    targetType: 'signal-send-fe',
    icon: '/signal-listen-fe-preview.svg',
    getTargetX: (baseX: number, offset: number) =>
      baseX + (100 + offset) - CIRCLE_RADIUS / 2,
  },
}

function FlowButton({
  flowType,
  shape,
  position,
  handleAddFlow,
}: {
  flowType: FlowType
  shape: ShapeType
  position: number
  handleAddFlow: (flowType: FlowType, shape: ShapeType) => void
}): React.ReactElement {
  const config = flowConfigs[flowType]

  return (
    <button
      className="shape-switch-menu-button"
      style={{
        position: 'absolute',
        top: 5,
        right: position,
        padding: 0,
        margin: 0,
      }}
      onClick={() => handleAddFlow(flowType, shape)}
    >
      <img
        src={config.icon}
        height="30px"
        draggable={false}
        onError={(e) => {
          console.error(`Failed to load image: ${config.icon}`, e)
          ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
        }}
      />
    </button>
  )
}

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: RECTANGLE_DEFAULT_HEIGHT,
      w: RECTANGLE_DEFAULT_WIDTH,
    }
  }

  override canEdit = () => true
  override hideSelectionBoundsFg = () => true
  override hideResizeHandles = () => false
  override canResize = () => true

  private findExistingSignals(shape: ShapeType): TLShape[] {
    const userBounds = this.editor.getShapePageBounds(shape)
    if (!userBounds) return []

    let existingSignals: TLShape[] = []

    this.editor.getCurrentPageShapeIds().forEach((id) => {
      const childShape = this.editor.getShape(id)
      if (childShape && childShape.type.startsWith('signal-listen')) {
        const childBounds = this.editor.getShapePageBounds(childShape)
        if (childBounds) {
          const isAtBottom =
            childBounds.y <= userBounds.y + userBounds.h &&
            childBounds.y >= userBounds.y &&
            childBounds.x + childBounds.w >= userBounds.x &&
            childBounds.x <= userBounds.x + userBounds.w

          if (isAtBottom) {
            existingSignals.push(childShape)
          }
        }
      }
    })

    return existingSignals
  }

  private updateShapeWidth(shape: ShapeType, existingSignals: TLShape[]): void {
    if (existingSignals.length === 0) return

    const userBounds = this.editor.getShapePageBounds(shape)
    if (!userBounds) return

    const rightmostShape = existingSignals.reduce(
      (furthest, current) => (current.x > furthest.x ? current : furthest),
      existingSignals[0],
    )

    this.editor.updateShape({
      id: shape.id,
      type: 'user-action',
      props: {
        ...shape.props,
        w: rightmostShape.x - userBounds.x + 500,
      },
    })
  }

  private createSignalListen(shape: ShapeType, offset: number): TLShapeId {
    const signalListenFeId = createShapeId()

    this.editor.createShape({
      id: signalListenFeId,
      type: 'signal-listen-fe',
      x: shape.x + (100 + offset) - CIRCLE_RADIUS / 2,
      y: shape.y + shape.props.h - CIRCLE_RADIUS / 2,
    })

    return signalListenFeId
  }

  private createTargetComponent(
    flowType: FlowType,
    shape: ShapeType,
    offset: number,
  ): TLShapeId {
    const targetId = createShapeId()
    const config = flowConfigs[flowType]

    this.editor.createShape({
      id: targetId,
      type: config.targetType,
      x: config.getTargetX(shape.x, offset),
      y: shape.y + 300,
    })

    return targetId
  }

  private handleAddFlow = (flowType: FlowType, shape: ShapeType) => {
    const existingSignals = this.findExistingSignals(shape)
    const offset = existingSignals.length * 350

    this.updateShapeWidth(shape, existingSignals)

    const signalListenFeId = this.createSignalListen(shape, offset)
    const targetId = this.createTargetComponent(flowType, shape, offset)

    createArrow(this.editor, signalListenFeId, targetId)
  }

  override component(shape: ShapeType) {
    const isEditing = this.editor.getEditingShapeId() === shape.id

    return (
      <HTMLContainer
        style={{
          background: BLUE,
          border: BORDER,
          padding: '1rem',
          borderRadius: BORDER_RADIUS,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: isEditing ? 'all' : undefined,
        }}
        onPointerDown={isEditing ? stopEventPropagation : undefined}
      >
        <img
          src="./user-action.svg"
          alt="user-action"
          onError={(e) => {
            console.error(`Failed to load image: ./user-action.svg`, e)
          }}
        />
        {isEditing && (
          <>
            <FlowButton
              flowType="subprocess"
              shape={shape}
              position={5}
              handleAddFlow={this.handleAddFlow}
            />
            <FlowButton
              flowType="signal-listen"
              shape={shape}
              position={60}
              handleAddFlow={this.handleAddFlow}
            />
          </>
        )}

        <div
          className="tl-text-label tl-text-wrapper"
          data-font="sans"
          style={{
            justifyContent: 'top',
            alignItems: 'flex-start',
            position: 'relative',
            textShadow: 'none',
            fontSize: '18px',
          }}
        >
          Action
        </div>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
