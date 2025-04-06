import {
  HTMLContainer,
  LABEL_FONT_SIZES,
  PlainTextLabel,
  Rectangle2d,
  ShapeUtil,
  stopEventPropagation,
  TEXT_PROPS,
  TLShape,
} from 'tldraw'
import { BaseShape } from './index'
import { ShapeName, Shapes } from 'editor-common'
import { CIRCLE_RADIUS, CIRCLE_SHAPE_TEXT_WIDTH } from './util/constants'
import { ShapeMenus } from './util/ShapeMenus'
import { handleDropShapeOnArrow } from './util/util'

const transformationMap = {
  message: [
    { value: 'message-inter' as ShapeName, icon: 'message-inter-preview' },
  ],
  'message-inter': [{ value: 'message' as ShapeName, icon: 'message-preview' }],
}

function createMessageClass(variant: 'message' | 'message-inter') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isIntermediate = variant.includes('inter')

  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

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
    override hideRotateHandle = () => true

    override getGeometry() {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override onTranslateEnd = (shape: ShapeType) =>
      handleDropShapeOnArrow(this.editor, shape.id)

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const isEditing = shape.id === this.editor.getEditingShapeId()
      const presetId = shape.id + '-preset'
      const selectMenuId = shape.id + '-select-menu'

      return (
        <HTMLContainer
          style={{ pointerEvents: isSelected ? 'all' : 'none' }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            if (
              target.id === presetId ||
              target.closest(`#${CSS.escape(presetId)}`) ||
              target.id === selectMenuId ||
              target.closest(`#${CSS.escape(selectMenuId)}`)
            ) {
              stopEventPropagation(e)
            }
          }}
        >
          <ShapeMenus
            isSelected={isSelected}
            isEditing={isEditing}
            presetId={presetId}
            selectMenuId={selectMenuId}
            shape={shape}
            isFe={true}
            editor={this.editor}
            transformationMap={transformationMap[variant]}
          />
          <div>
            <div
              style={{
                width: 'var(--circle-radius-px)',
                height: 'var(--circle-radius-px)',
                borderRadius: 'var(--circle-radius-px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: isIntermediate
                  ? 'var(--inter-border)'
                  : 'var(--border)',
                background: 'var(--primary-blue)',
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
                top: 'var(--circle-radius-px)',
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
