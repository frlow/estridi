import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d } from 'tldraw'
import { Shapes, ShapeName } from 'editor-common'
import { BaseShape } from './index.ts'
import { BLUE, BORDER, CIRCLE_RADIUS, GREEN } from './util/constants.ts'

function createStartClass(variant: 'start-fe' | 'start-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      'start-fe': [{ value: 'end-fe' as ShapeName, icon: 'end-fe-preview' }],
      'start-be': [{ value: 'end-be' as ShapeName, icon: 'end-be-preview' }],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: CIRCLE_RADIUS,
        w: CIRCLE_RADIUS,
        target: isFe ? 'playwright' : 'vitest',
      }
    }

    override canEdit = () => false
    override canResize = () => false
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
              width: `${CIRCLE_RADIUS}px`,
              height: `${CIRCLE_RADIUS}px`,
              borderRadius: `${CIRCLE_RADIUS}px`,
              border: BORDER,
              background: isFe ? BLUE : GREEN,
            }}
          ></div>
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

export const StartFE = createStartClass('start-fe')
export const StartBE = createStartClass('start-be')
