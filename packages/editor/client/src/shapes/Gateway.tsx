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

const createGatewayClass = (variant: 'gateway' | 'loop') => {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: 0,
        w: 0,
        text: 'Edit me..',
        color: 'light-blue',
      }
    }

    override hideSelectionBoundsFg() {
      return true
    }

    override canEdit() {
      return true
    }

    override getGeometry() {
      return new Rectangle2d({
        width: sideSize,
        height: sideSize,
        isFilled: true,
      })
    }

    override canResize() {
      return false
    }

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
                  <svg
                    width="42"
                    height="46"
                    viewBox="0 0 42 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.07394 31.443C7.55908 35.2734 11.3343 38.0805 15.7113 39.3525L17.6471 34.1579C10.9412 32.0141 7.58823 27.7263 7.58823 21.2948C7.58823 13.7912 13.1765 7.35966 21 7.35966C28.8235 7.35966 34.4118 13.7912 34.4118 21.2948C34.4118 27.7263 31.2382 31.6301 27.8853 33.939L24.9524 27.2317L19.8544 39.123L32.2845 44L29.7183 38.1311C31.9536 37.0592 34.7724 34.9507 37.1666 31.0625C39.5607 27.1742 40.4815 22.5526 39.761 18.0404C39.0405 13.5281 36.7267 9.42587 33.2416 6.48163C29.7564 3.53739 25.3321 1.94731 20.7754 2.00133C16.2186 2.05536 11.8331 3.74989 8.41831 6.77593C5.00357 9.80198 2.78717 13.9579 2.17325 18.486C1.55933 23.0141 2.5888 27.6126 5.07394 31.443Z"
                      fill="white"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  </svg>
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
          height={'80px'}
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
