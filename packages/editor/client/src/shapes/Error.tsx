import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'

const CIRCLE_RADIUS = 90

function createStartClass(variant: 'error' | 'soft-error') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      error: [{ value: 'soft-error', icon: 'soft-error-preview' }],
      'soft-error': [{ value: 'error', icon: 'hard-error-preview' }],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        w: CIRCLE_RADIUS,
        h: CIRCLE_RADIUS,
        text: '',
      }
    }

    override canEdit = () => true
    override canResize = () => false
    override hideSelectionBoundsBg = () => true
    override hideSelectionBoundsFg = () => true

    override getGeometry() {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override component() {
      return (
        <HTMLContainer>
          <div
            style={{
              width: 'var(--circle-radius-px)',
              height: 'var(--circle-radius-px)',
              borderRadius: 'var(--circle-radius-px)',
              border: {
                error: 'var(--border)',
                'soft-error': 'var(--inter-border)',
              }[variant],
              background: 'var(--primary-green)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              height="60px"
              draggable={false}
              src={'/error.svg'}
              onError={(e) => {
                console.error(`Failed to load image: /error.svg`, e)
                // Set a fallback background color
                ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
              }}
            />
          </div>
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

export const HardError = createStartClass('error')
export const SoftError = createStartClass('soft-error')
