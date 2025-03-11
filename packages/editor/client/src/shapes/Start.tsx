import { BaseBoxShapeUtil, HTMLContainer, useDefaultColorTheme } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'

const radius = 80

function createStartClass(variant: 'start' | 'end') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return variant === 'start' ? {
        h: radius,
        w: radius,
        text: '',
        color: 'light-blue',
        target: 'playwright'
      } : {
        h: radius,
        w: radius,
        text: '',
        color: 'light-blue'
      }
    }

    override canResize(_shape: ShapeType): boolean {
      return false
    }

    override hideSelectionBoundsFg() {
      return true
    }

    override component(shape: ShapeType) {
      const theme = useDefaultColorTheme()
      const color = ('target' in shape.props
      && shape.props.target === 'vitest') ?
        theme['light-green'] :
        theme['light-blue']
      return (
        <HTMLContainer>
          <div
            style={{
              width: `${radius}px`,
              height: `${radius}px`,
              borderRadius: `${radius}px`,
              border: { start: '2px solid black', end: '6px solid black' }[
                variant
                ],
              background: color.solid
            }}
          ></div>
        </HTMLContainer>
      )
    }

    override indicator(shape: ShapeType) {
      return (
        <circle
          cx={shape.props.w / 2}
          cy={shape.props.h / 2}
          r={Math.min(shape.props.w, shape.props.h) / 2}
        />
      )
    }
  }
}

export const Start = createStartClass('start')
export const End = createStartClass('end')
