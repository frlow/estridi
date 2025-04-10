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
import {
  CIRCLE_RADIUS,
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
} from './util/constants.ts'
import { createArrow, handleDropShapeOnArrow } from './util/util.ts'
import { ShapeMenus } from './util/ShapeMenus.tsx'

const shapeType = Shapes['user-action']
type ShapeType = BaseShape<typeof shapeType>

export type { ShapeType }

type FlowType = 'subprocess' | 'signal-listen' | 'script-fe'
interface FlowConfig {
  targetType: string
  icon: string
  getTargetX: (baseX: number, offset: number) => number
}

const flowConfigs: Record<FlowType, FlowConfig> = {
  subprocess: {
    targetType: 'subprocess-fe',
    icon: 'message-listen-to-subprocess',
    getTargetX: (baseX: number, offset: number) =>
      baseX + (100 + offset) - RECTANGLE_DEFAULT_WIDTH / 2,
  },
  'signal-listen': {
    targetType: 'signal-send-fe',
    icon: 'message-listen-to-send',
    getTargetX: (baseX: number, offset: number) =>
      baseX + (100 + offset) - CIRCLE_RADIUS / 2,
  },
  'script-fe': {
    targetType: 'script-fe',
    icon: 'message-listen-to-script',
    getTargetX: (baseX: number, offset: number) =>
      baseX + (100 + offset) - RECTANGLE_DEFAULT_WIDTH / 2,
  },
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
  override hideRotateHandle = () => true

  override onTranslateEnd = (shape: ShapeType) =>
    handleDropShapeOnArrow(this.editor, shape.id)

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
        w: rightmostShape.x - userBounds.x + 600,
      },
    })
  }

  private createSignalListen(
    shape: ShapeType,
    offset: number,
    parentId?: TLShapeId,
  ): TLShapeId {
    const signalListenFeId = createShapeId()

    this.editor.createShape({
      id: signalListenFeId,
      type: 'signal-listen-fe',
      x: shape.x + (100 + offset) - CIRCLE_RADIUS / 2,
      y: shape.y + shape.props.h - CIRCLE_RADIUS / 2,
      parentId: parentId ?? undefined,
    })

    return signalListenFeId
  }

  private createTargetComponent(
    flowType: FlowType,
    shape: ShapeType,
    offset: number,
    parentId?: TLShapeId,
  ): TLShapeId {
    const targetId = createShapeId()
    const config = flowConfigs[flowType]

    this.editor.createShape({
      id: targetId,
      type: config.targetType,
      x: config.getTargetX(shape.x, offset),
      y: shape.y + shape.props.h + 200,
      parentId: parentId ?? undefined,
    })

    return targetId
  }

  private handleAddFlow = (flowType: FlowType, shape: ShapeType) => {
    const existingSignals = this.findExistingSignals(shape)
    const offset = existingSignals.length * 350
    const parentId = shape.parentId
    const parentShape = parentId ? this.editor.getShape(parentId) : null
    const frameParentId =
      parentShape?.type === 'frame' ? (parentId as TLShapeId) : undefined

    this.updateShapeWidth(shape, existingSignals)

    const signalListenFeId = this.createSignalListen(
      shape,
      offset,
      frameParentId,
    )
    const targetId = this.createTargetComponent(
      flowType,
      shape,
      offset,
      frameParentId,
    )

    createArrow(this.editor, signalListenFeId, targetId)
  }

  override component(shape: ShapeType) {
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
    const presetId = shape.id + '-preset'
    const selectMenuId = shape.id + '-select-menu'

    return (
      <HTMLContainer
        style={{
          background: 'var(--primary-blue)',
          border: 'var(--border)',
          padding: '1rem',
          borderRadius: 'var(--border-radius)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: isSelected ? 'all' : 'none',
        }}
        onPointerDown={(e) => {
          const target = e.target as HTMLElement
          if (
            target.id === presetId ||
            target.closest(`#${CSS.escape(presetId)}`) ||
            target.id === selectMenuId ||
            target.closest(`#${CSS.escape(selectMenuId)}`)
          ) {
            stopEventPropagation(e)
          }
        }}
      >
        <ShapeMenus
          isSelected={isSelected}
          isEditing={false}
          presetId={presetId}
          selectMenuId={selectMenuId}
          shape={shape}
          isFe={true}
          editor={this.editor}
          transformationMap={[
            {
              onSelected: () => this.handleAddFlow('subprocess', shape),
              icon: flowConfigs['subprocess'].icon,
            },
            {
              onSelected: () => this.handleAddFlow('signal-listen', shape),
              icon: flowConfigs['signal-listen'].icon,
            },
            {
              onSelected: () => this.handleAddFlow('script-fe', shape),
              icon: flowConfigs['script-fe'].icon,
            },
          ]}
        />
        <img
          src="./user-action.svg"
          alt="user-action"
          onError={(e) => {
            console.error(`Failed to load image: ./user-action.svg`, e)
          }}
        />

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
