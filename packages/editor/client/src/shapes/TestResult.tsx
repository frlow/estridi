import { BaseBoxShapeUtil, HTMLContainer, stopEventPropagation } from 'tldraw'
import { ShapeName, Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CIRCLE_RADIUS } from './util/constants.ts'
import { handleDropShapeOnArrow, mapTransformations } from './util/util.ts'
import { TransformButton } from './util/TransformButton'

const transformationMap = {
  'not-started': [
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
    },
  ],
  'in-progress': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
    },
  ],
  'test-done': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
    },
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
    },
  ],
  'dev-done': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
    },
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
    },
  ],
  'test-failed': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
    },
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
    },
  ],
}

function createShape(
  variant:
    | 'not-started'
    | 'in-progress'
    | 'dev-done'
    | 'test-done'
    | 'test-failed',
) {
  type ShapeType = BaseShape<typeof shapeType>
  const shapeType = Shapes[variant]

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: CIRCLE_RADIUS,
        w: CIRCLE_RADIUS,
      }
    }

    override canEdit = () => false
    override hideSelectionBoundsFg = () => true
    override hideResizeHandles = () => true
    override canResize = () => false
    override hideRotateHandle = () => true

    override onTranslateEnd = (shape: ShapeType) =>
      handleDropShapeOnArrow(this.editor, shape.id)

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const presetId = shape.id + '-preset'

      return (
        <HTMLContainer
          style={{
            background: {
              'not-started': 'var(--grey)',
              'in-progress': 'var(--in-progress-color)',
              'test-done': 'var(--dev-done-color)',
              'dev-done': 'var(--dev-done-color)',
              'test-failed': 'var(--dev-done-color)',
            }[variant],
            border: '6px solid rgba(0, 0, 0, 0.2)',
            width: 'var(--circle-radius-px)',
            height: 'var(--circle-radius-px)',
            borderRadius: 'var(--circle-radius-px)',
            padding: '10px',
            pointerEvents: isSelected ? 'all' : 'none',
          }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            if (
              target.id === presetId ||
              target.closest(`#${CSS.escape(presetId)}`)
            ) {
              stopEventPropagation(e)
            }
          }}
        >
          <TransformButton
            id={presetId}
            presets={mapTransformations(
              transformationMap[variant],
              shape,
              this.editor,
            )}
            show={isSelected}
          />
          {variant === 'test-failed' && (
            <span
              style={{
                fontSize: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              👎
            </span>
          )}
          {variant === 'test-done' && (
            <span
              style={{
                fontSize: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              👍
            </span>
          )}
        </HTMLContainer>
      )
    }

    override indicator() {
      return (
        <circle
          cx={CIRCLE_RADIUS / 2}
          cy={CIRCLE_RADIUS / 2}
          r={Math.min(CIRCLE_RADIUS, CIRCLE_RADIUS) / 2}
        />
      )
    }
  }
}

export const NotStarted = createShape('not-started')
export const InProgress = createShape('in-progress')
export const TestDone = createShape('test-done')
export const DevDone = createShape('dev-done')
export const TestFailed = createShape('test-failed')
