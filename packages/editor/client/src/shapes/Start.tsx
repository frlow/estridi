import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  useDefaultColorTheme,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'

const radius = 90

function createStartClass(variant: 'start' | 'end') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return variant === 'start'
        ? {
            h: radius,
            w: radius,
            color: 'light-blue',
            target: 'playwright',
          }
        : {
            h: radius,
            w: radius,
            color: 'green',
          }
    }

    override canEdit = () => false
    override canResize = () => false
    override hideSelectionBoundsFg = () => true

    override getGeometry() {
      return new Rectangle2d({
        width: radius,
        height: radius,
        isFilled: true,
      })
    }

    override component(shape: ShapeType) {
      const theme = useDefaultColorTheme()

      const color =
        'target' in shape.props && shape.props.target === 'vitest'
          ? theme['green']
          : theme['light-blue']
      return (
        <HTMLContainer>
          <div
            style={{
              width: `${radius}px`,
              height: `${radius}px`,
              borderRadius: `${radius}px`,
              border: { start: '4px solid black', end: '6px solid black' }[
                variant
              ],
              background: color.solid,
            }}
          ></div>
        </HTMLContainer>
      )
    }

    override indicator() {
      return (
        <circle
          cx={radius / 2}
          cy={radius / 2}
          r={Math.min(radius, radius) / 2}
        />
      )
    }
  }
}

export const Start = createStartClass('start')
export const End = createStartClass('end')
