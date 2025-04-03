import {
  HTMLContainer,
  LABEL_FONT_SIZES,
  PlainTextLabel,
  Rectangle2d,
  ShapeUtil,
  TEXT_PROPS,
} from 'tldraw'
import { BaseShape } from './index'
import { CSSProperties } from 'react'
import { ShapeName, Shapes } from 'editor-common'
import {
  BLUE,
  BORDER,
  CIRCLE_RADIUS,
  CIRCLE_SHAPE_TEXT_WIDTH,
  INTER_BORDER,
} from './util/constants'

function createMessageClass(variant: 'message' | 'message-inter') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isIntermediate = variant.includes('inter')

  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      message: [
        { value: 'message-inter' as ShapeName, icon: 'message-inter-preview' },
      ],
      'message-inter': [
        { value: 'message' as ShapeName, icon: 'message-preview' },
      ],
    }[variant]

    getDefaultProps(): ShapeType['props'] {
      return {
        w: CIRCLE_RADIUS,
        h: CIRCLE_RADIUS,
        text: 'Edit me...',
      }
    }

    override canEdit = () => true
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
                border: isIntermediate ? INTER_BORDER : BORDER,
                background: BLUE,
              }}
            >
              <img
                src="./message.svg"
                alt="message"
                draggable={false}
                onError={(e) => {
                  console.error(`Failed to load image: ./message.svg`, e)
                  // Set a fallback background color
                  ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
                }}
              />
            </div>
            <PlainTextLabel
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
              isSelected={isSelected}
              wrap
              text={shape.props.text}
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

export const Message = createMessageClass('message')
export const MessageIntermediate = createMessageClass('message-inter')
