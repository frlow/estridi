import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d } from 'tldraw'
import { Shapes, ShapeName } from 'editor-common'
import { BaseShape } from './index.ts'
import { BLUE, CIRCLE_RADIUS, END_BORDER, GREEN } from './util/constants.ts'
import { useEffect } from 'react'

function createStartClass(variant: 'end-fe' | 'end-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      'end-fe': [{ value: 'start-fe' as ShapeName, icon: 'start-fe-preview' }],
      'end-be': [{ value: 'start-be' as ShapeName, icon: 'start-be-preview' }],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: CIRCLE_RADIUS,
        w: CIRCLE_RADIUS,
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

    override component(shape: ShapeType) {
      useEffect(() => {
        console.log('nex props', shape.x)
      }, [shape.x])
      return (
        <HTMLContainer>
          <div
            style={{
              width: `${CIRCLE_RADIUS}px`,
              height: `${CIRCLE_RADIUS}px`,
              borderRadius: `${CIRCLE_RADIUS}px`,
              border: END_BORDER,
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

export const EndFe = createStartClass('end-fe')
export const EndBe = createStartClass('end-be')
