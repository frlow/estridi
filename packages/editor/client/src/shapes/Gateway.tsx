import {
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  ShapeUtil,
  TEXT_PROPS,
  TextLabel,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CSSProperties } from 'react'
import {
  BLUE,
  BORDER,
  BORDER_RADIUS,
  DIMOND_SIDE_LENGTH,
  GREEN,
} from './util/constants.ts'

const createGatewayClass = (
  variant:
    | 'gateway-fe'
    | 'gateway-be'
    | 'loop-fe'
    | 'loop-be'
    | 'parallel-fe'
    | 'parallel-be',
) => {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      'gateway-fe': [
        { value: 'loop-fe', icon: 'loop-fe-preview' },
        { value: 'parallel-fe', icon: 'parallel-fe-preview' },
      ],
      'gateway-be': [
        { value: 'loop-be', icon: 'loop-be-preview' },
        { value: 'parallel-be', icon: 'parallel-be-preview' },
      ],
      'loop-fe': [
        { value: 'gateway-fe', icon: 'gateway-fe-preview' },
        { value: 'parallel-fe', icon: 'parallel-fe-preview' },
      ],
      'loop-be': [
        { value: 'gateway-be', icon: 'gateway-be-preview' },
        { value: 'parallel-be', icon: 'parallel-be-preview' },
      ],
      'parallel-fe': [
        { value: 'gateway-fe', icon: 'gateway-fe-preview' },
        { value: 'loop-fe', icon: 'loop-fe-preview' },
      ],
      'parallel-be': [
        { value: 'gateway-be', icon: 'gateway-be-preview' },
        { value: 'loop-be', icon: 'loop-be-preview' },
      ],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: DIMOND_SIDE_LENGTH,
        w: DIMOND_SIDE_LENGTH,
        text: 'Edit me..',
      }
    }

    override hideSelectionBoundsFg = () => true
    override canEdit = () => true
    override canResize = () => false

    override getGeometry = () =>
      new Rectangle2d({
        width: DIMOND_SIDE_LENGTH,
        height: DIMOND_SIDE_LENGTH,
        isFilled: true,
      })

    override component(shape: ShapeType) {
      const style: CSSProperties = { pointerEvents: 'all' }
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

      return (
        <HTMLContainer style={style}>
          <div>
            <div
              style={{
                width: DIMOND_SIDE_LENGTH,
                height: DIMOND_SIDE_LENGTH,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: `${0.7 * DIMOND_SIDE_LENGTH}px`,
                  height: `${0.7 * DIMOND_SIDE_LENGTH}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: BORDER,
                  borderStyle: 'solid',
                  borderRadius: BORDER_RADIUS,
                  background: isFe ? BLUE : GREEN,
                  transform: 'rotate(45deg)',
                }}
              >
                {variant.includes('loop') && (
                  <img
                    src="./loop.svg"
                    alt="loop"
                    draggable={false}
                    style={{ transform: 'rotate(-45deg)' }}
                    onError={(e) => {
                      console.error(`Failed to load image: ./loop.svg`, e)
                      // Set a fallback background color
                      ;(e.target as HTMLImageElement).style.backgroundColor =
                        '#ddd'
                    }}
                  />
                )}
                {variant.includes('parallel') && (
                  <img
                    src="./parallel.svg"
                    alt="loop"
                    draggable={false}
                    style={{ transform: 'rotate(-45deg)' }}
                    onError={(e) => {
                      console.error(`Failed to load image: ./parallel.svg`, e)
                      // Set a fallback background color
                      ;(e.target as HTMLImageElement).style.backgroundColor =
                        '#ddd'
                    }}
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
                top: `${DIMOND_SIDE_LENGTH}px`,
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

    override indicator() {
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

export const GatewayFe = createGatewayClass('gateway-fe')
export const GatewayBe = createGatewayClass('gateway-be')

export const LoopFe = createGatewayClass('loop-fe')
export const LoopBe = createGatewayClass('loop-be')

export const ParallelFe = createGatewayClass('parallel-fe')
export const ParallelBe = createGatewayClass('parallel-be')
