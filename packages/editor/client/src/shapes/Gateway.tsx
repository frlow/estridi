import {
  HTMLContainer,
  ShapeUtil,
  LABEL_FONT_SIZES,
  TEXT_PROPS,
  TextLabel,
  Rectangle2d,
  useDefaultColorTheme,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, figureStyles } from './index.ts'
import { CSSProperties } from 'react'

const sideSize = 120

const createGatewayClass = (variant: 'gateway' | 'loop' | 'parallel') => {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: sideSize,
        w: sideSize,
        text: 'Edit me..',
        color: 'light-blue',
      }
    }

    override hideSelectionBoundsFg = () => true
    override canEdit = () => true
    override canResize = () => false

    override getGeometry = () =>
      new Rectangle2d({
        width: sideSize,
        height: sideSize,
        isFilled: true,
      })

    override component(shape: ShapeType) {
      const style: CSSProperties = { pointerEvents: 'all' }
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const theme = useDefaultColorTheme()

      return (
        <HTMLContainer style={style}>
          <div>
            <div
              style={{
                width: sideSize,
                height: sideSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: `${0.7 * sideSize}px`,
                  height: `${0.7 * sideSize}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: figureStyles.border,
                  borderStyle: 'solid',
                  borderRadius: '10px',
                  background: theme[shape.props.color].solid,
                  transform: 'rotate(45deg)',
                }}
              >
                {variant === 'loop' && (
                  <img
                    src="./loop.svg"
                    alt="loop"
                    draggable={false}
                    style={{ transform: 'rotate(-45deg)' }}
                  />
                )}
                {variant === 'parallel' && (
                  <img
                    src="./parallel.svg"
                    alt="loop"
                    draggable={false}
                    style={{ transform: 'rotate(-45deg)' }}
                  />
                )}
              </div>
            </div>
            <TextLabel
              shapeId={shape.id}
              type="text"
              labelColor="black"
              style={{
                position: 'absolute',
                top: `${sideSize}px`,
              }}
              font="sans"
              textWidth={130}
              fontSize={LABEL_FONT_SIZES['m']}
              lineHeight={TEXT_PROPS.lineHeight}
              align="middle"
              verticalAlign="start"
              text={shape.props.text}
              isSelected={isSelected}
              wrap
            />
          </div>
        </HTMLContainer>
      )
    }

    override indicator(_: ShapeType) {
      return (
        <rect
          x={20}
          y={20}
          width="80px"
          height="80px"
          transform="rotate(45 60 60)"
          rx="8"
          ry="8"
        />
      )
    }
  }
}

export const Gateway = createGatewayClass('gateway')
export const Loop = createGatewayClass('loop')
export const Parallel = createGatewayClass('parallel')
