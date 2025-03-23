import {
  BaseBoxShapeUtil,
  createShapeId,
  HTMLContainer,
  toRichText,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight.tsx'
import {
  BLUE,
  BORDER,
  BORDER_RADIUS,
  DIMOND_SIDE_LENGTH,
  GREEN,
  GREY,
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
  RECTANGLE_ICON_HEIGHT,
  RECTANGLE_ICON_PADDING,
} from './util/constants.ts'
import { useEffect, useRef } from 'react'
import { createArrow } from './util/util.ts'

function createServiceCallClass(
  variant: 'service-call-fe' | 'service-call-be' | 'service-call-be-external',
) {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      'service-call-be': [
        {
          value: 'service-call-be-external',
          icon: 'service-call-be-external-preview',
        },
      ],
      'service-call-be-external': [
        { value: 'service-call-be', icon: 'service-call-be-preview' },
      ],
      'service-call-fe': [],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: RECTANGLE_DEFAULT_HEIGHT,
        w: RECTANGLE_DEFAULT_WIDTH,
        richText: toRichText('Serivce Call..'),
      }
    }

    override canEdit = () => true
    override hideSelectionBoundsFg = () => true
    override hideResizeHandles = () => false
    override canResize = () => true

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const ranOnce = useRef(false)

      useEffect(() => {
        if (!ranOnce.current) {
          ranOnce.current = true

          const parentId = shape.parentId || this.editor.getCurrentPageId()
          const inputTextId = createShapeId()

          this.editor.createShape({
            id: inputTextId,
            type: 'text',
            parentId: parentId,
            x: shape.x,
            y: shape.y + shape.props.h + 100,
            props: { richText: toRichText('Input'), font: 'sans' },
          })
          createArrow(this.editor, inputTextId, shape.id)

          const outputTextId = createShapeId()
          this.editor.createShape({
            id: outputTextId,
            type: 'text',
            parentId: parentId,
            x: shape.x + shape.props.w - 60,
            y: shape.y + shape.props.h + 100,
            props: { richText: toRichText('Output'), font: 'sans' },
          })
          createArrow(this.editor, shape.id, outputTextId)

          const gatewayId = createShapeId()
          this.editor.createShape({
            id: gatewayId,
            type: 'gateway-fe',
            parentId: parentId,
            x: shape.x + shape.props.w + 200,
            y: shape.y + shape.props.h / 2 - DIMOND_SIDE_LENGTH / 2,
            props: { text: 'Errors from service?' },
          })
          createArrow(this.editor, shape.id, gatewayId)

          const messageId = createShapeId()
          this.editor.createShape({
            id: messageId,
            type: 'message',
            parentId: parentId,
            x: shape.x + shape.props.w + 215,
            y: shape.y + shape.props.h / 2 - DIMOND_SIDE_LENGTH / 2 - 200,
            props: { text: 'Display error message' },
          })
          createArrow(this.editor, gatewayId, messageId)
        }
      }, [shape.id])

      return (
        <HTMLContainer
          style={{
            background: {
              'service-call-fe': BLUE,
              'service-call-be': GREEN,
              'service-call-be-external': GREY,
            }[variant],
            border: BORDER,
            padding: '1rem',
            borderRadius: BORDER_RADIUS,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: `${RECTANGLE_ICON_HEIGHT}px`,
            }}
          >
            <img
              src="/service-call.svg"
              height={RECTANGLE_ICON_HEIGHT}
              draggable={false}
              onError={(e) => {
                console.error(`Failed to load image: /service-call.svg`, e)
                // Set a fallback background color
                ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
              }}
            />
          </div>
          <TextLabelWithAutoHeight
            shape={shape}
            isSelected={isSelected}
            iconHeight={RECTANGLE_ICON_HEIGHT}
            minHeight={RECTANGLE_DEFAULT_HEIGHT}
            padding={RECTANGLE_ICON_PADDING}
          />
        </HTMLContainer>
      )
    }

    override indicator(shape: ShapeType) {
      return <rect width={shape.props.w} height={shape.props.h} />
    }
  }
}

export const ServiceCallFe = createServiceCallClass('service-call-fe')
export const ServiceCallBe = createServiceCallClass('service-call-be')
export const ServiceCallBeExternal = createServiceCallClass(
  'service-call-be-external',
)
