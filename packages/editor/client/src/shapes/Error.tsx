import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  TLUiEventSource,
  useDefaultColorTheme,
  useTools,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { useEffect } from 'react'

const radius = 90

function createStartClass(variant: 'error' | 'softError') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        w: radius,
        h: radius,
        text: '',
        color: 'light-blue',
      }
    }

    override canEdit = () => true
    override canResize = () => false
    override hideSelectionBoundsBg = () => true
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

      return (
        <HTMLContainer>
          <div
            style={{
              width: `${radius}px`,
              height: `${radius}px`,
              borderRadius: `${radius}px`,
              border: '4px solid black',
              background: theme[shape.props.color].solid,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              height="60px"
              draggable={false}
              src={variant === 'error' ? '/error.svg' : '/soft-error.svg'}
            />
          </div>
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

export const Error = createStartClass('error')
export const SoftError = createStartClass('softError')
