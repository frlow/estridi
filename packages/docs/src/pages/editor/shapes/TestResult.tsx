import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { type ShapeName, Shapes } from 'editor-common'
import type { BaseShape } from './index.ts'
import {
  CIRCLE_RADIUS,
  DEV_DONE_COLOR,
  GREY,
  IN_PROGRESS_COLOR,
} from './util/constants.ts'

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
    static transformations = {
      'not-started': [
        { value: 'in-progress' as ShapeName, icon: 'in-progress-preview' },
        { value: 'dev-done' as ShapeName, icon: 'dev-done-preview' },
        { value: 'test-done' as ShapeName, icon: 'test-done-preview' },
        { value: 'test-failed' as ShapeName, icon: 'test-failed-preview' },
      ],
      'in-progress': [
        { value: 'not-started' as ShapeName, icon: 'not-started-preview' },
        { value: 'dev-done' as ShapeName, icon: 'dev-done-preview' },
        { value: 'test-failed' as ShapeName, icon: 'test-failed-preview' },
        { value: 'test-done' as ShapeName, icon: 'test-done-preview' },
      ],
      'test-done': [
        { value: 'not-started' as ShapeName, icon: 'not-started-preview' },
        { value: 'in-progress' as ShapeName, icon: 'in-progress-preview' },
        { value: 'dev-done' as ShapeName, icon: 'dev-done-preview' },
        { value: 'test-failed' as ShapeName, icon: 'test-failed-preview' },
      ],
      'dev-done': [
        { value: 'not-started' as ShapeName, icon: 'not-started-preview' },
        { value: 'in-progress' as ShapeName, icon: 'in-progress-preview' },
        { value: 'test-failed' as ShapeName, icon: 'test-failed-preview' },
        { value: 'test-done' as ShapeName, icon: 'test-done-preview' },
      ],
      'test-failed': [
        { value: 'not-started' as ShapeName, icon: 'not-started-preview' },
        { value: 'in-progress' as ShapeName, icon: 'in-progress-preview' },
        { value: 'dev-done' as ShapeName, icon: 'dev-done-preview' },
        { value: 'test-done' as ShapeName, icon: 'test-done-preview' },
      ],
    }[variant]

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

    override component() {
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
        >
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
