import { BaseBoxShapeUtil, HTMLContainer, stopEventPropagation } from 'tldraw'
import { ShapeName, Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import {
  CIRCLE_RADIUS,
  DEV_DONE_COLOR,
  GREY,
  IN_PROGRESS_COLOR,
} from './util/constants.ts'
import { mapTransformations } from './util/util.ts'
import { TransformButton } from './util/TransformButton'

const transformationMap = {
  'not-started': [
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
      updateProps: (props: any) => props,
    },
  ],
  'in-progress': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
      updateProps: (props: any) => props,
    },
  ],
  'test-done': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
      updateProps: (props: any) => props,
    },
  ],
  'dev-done': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-failed' as ShapeName,
      icon: 'test-failed-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
      updateProps: (props: any) => props,
    },
  ],
  'test-failed': [
    {
      value: 'not-started' as ShapeName,
      icon: 'not-started-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'in-progress' as ShapeName,
      icon: 'in-progress-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'dev-done' as ShapeName,
      icon: 'dev-done-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'test-done' as ShapeName,
      icon: 'test-done-preview',
      updateProps: (props: any) => props,
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

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const presetId = shape.id + '-preset'

      return (
        <HTMLContainer
          style={{
            background: {
              'not-started': GREY,
              'in-progress': IN_PROGRESS_COLOR,
              'test-done': DEV_DONE_COLOR,
              'dev-done': DEV_DONE_COLOR,
              'test-failed': DEV_DONE_COLOR,
            }[variant],
            border: '6px solid rgba(0, 0, 0, 0.2)',
            width: `${CIRCLE_RADIUS}px`,
            height: `${CIRCLE_RADIUS}px`,
            borderRadius: `${CIRCLE_RADIUS}px`,
            padding: '10px',
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
          {isSelected && (
            <TransformButton
              id={presetId}
              presets={mapTransformations(
                transformationMap,
                variant,
                shape,
                this.editor,
              )}
            />
          )}
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
