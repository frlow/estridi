import {
  BaseBoxShapeUtil,
  Geometry2d,
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  TEXT_PROPS,
  TextLabel,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { type BaseShape } from './index.ts'
import { type CSSProperties } from 'react'
import {
  BLUE,
  BORDER,
  CIRCLE_RADIUS,
  CIRCLE_SHAPE_TEXT_WIDTH,
  GREEN,
  INTER_BORDER,
} from './util/constants.ts'

function createSignalSendClass(
  variant:
    | 'signal-send-fe'
    | 'signal-send-be'
    | 'signal-send-fe-inter'
    | 'signal-send-be-inter',
) {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')
  const isInter = variant.includes('inter')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      'signal-send-fe': [
        { value: 'signal-send-fe-inter', icon: 'signal-send-fe-inter-preview' },
        { value: 'signal-listen-fe', icon: 'signal-listen-fe-preview' },
        {
          value: 'signal-listen-fe-inter',
          icon: 'signal-listen-fe-inter-preview',
        },
      ],
      'signal-send-be': [
        { value: 'signal-send-be-inter', icon: 'signal-send-be-inter-preview' },
        { value: 'signal-listen-be', icon: 'signal-listen-be-preview' },
        {
          value: 'signal-listen-be-inter',
          icon: 'signal-listen-be-inter-preview',
        },
      ],
      'signal-send-fe-inter': [
        { value: 'signal-send-fe', icon: 'signal-send-fe-preview' },
        { value: 'signal-listen-fe', icon: 'signal-listen-fe-preview' },
        {
          value: 'signal-listen-fe-inter',
          icon: 'signal-listen-fe-inter-preview',
        },
      ],
      'signal-send-be-inter': [
        { value: 'signal-send-be', icon: 'signal-send-be-preview' },
        { value: 'signal-listen-be', icon: 'signal-listen-be-preview' },
        {
          value: 'signal-listen-be-inter',
          icon: 'signal-listen-be-inter-preview',
        },
      ],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        w: CIRCLE_RADIUS,
        h: CIRCLE_RADIUS,
        text: 'Signal send',
      }
    }

    override canResize = () => false
    override canEdit = () => true
    override hideSelectionBoundsFg = () => true

    override getGeometry(): Geometry2d {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override component(shape: ShapeType) {
      const style: CSSProperties = { pointerEvents: 'all' }
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

      return (
        <HTMLContainer style={style}>
          <div>
            <div
              style={{
                width: `${CIRCLE_RADIUS}px`,
                height: `${CIRCLE_RADIUS}px`,
                borderRadius: `${CIRCLE_RADIUS}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: isInter ? INTER_BORDER : BORDER,
                background: isFe ? BLUE : GREEN,
              }}
            >
              <img
                src="./signal-send.svg"
                alt="signal send"
                draggable={false}
                onError={(e) => {
                  console.error(`Failed to load image: ./signal-send.svg`, e)
                  // Set a fallback background color
                  ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
                }}
              />
            </div>
            <TextLabel
              shapeId={shape.id}
              type="text"
              labelColor="black"
              style={{
                position: 'absolute',
                top: `${CIRCLE_RADIUS}px`,
              }}
              font="sans"
              textWidth={CIRCLE_SHAPE_TEXT_WIDTH}
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
        <circle
          cx={CIRCLE_RADIUS / 2}
          cy={CIRCLE_RADIUS / 2}
          r={Math.min(CIRCLE_RADIUS, CIRCLE_RADIUS) / 2}
        />
      )
    }
  }
}

export const SignalSendFe = createSignalSendClass('signal-send-fe')
export const SignalSendFeInter = createSignalSendClass('signal-send-fe-inter')
export const SignalSendBe = createSignalSendClass('signal-send-be')
export const SignalSendBeInter = createSignalSendClass('signal-send-be-inter')
