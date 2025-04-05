import {
  BaseBoxShapeUtil,
  createShapeId,
  HTMLContainer,
  toRichText,
  Editor,
  stopEventPropagation,
} from 'tldraw'
import { ShapeDefinition, Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight.tsx'
import {
  CIRCLE_RADIUS,
  DIMOND_SIDE_LENGTH,
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
  RECTANGLE_ICON_HEIGHT,
  RECTANGLE_ICON_PADDING,
} from './util/constants.ts'
import { createArrow, mapTransformations } from './util/util.ts'
import { TransformButton } from './util/TransformButton.tsx'

function addFePreset<T extends ShapeDefinition>(
  shape: BaseShape<T>,
  editor: Editor,
) {
  const parentId = shape.parentId || editor.getCurrentPageId()
  const parentIsFrame = editor.getShape(parentId)?.type === 'frame'
  console.log(parentIsFrame)
  const inputTextId = createShapeId()

  editor.createShape({
    id: inputTextId,
    type: 'text',
    parentId: parentId,
    x: shape.x + (parentIsFrame ? 10 : 0),
    y: shape.y + shape.props.h + 100,
    props: { richText: toRichText('Input'), font: 'sans' },
  })
  createArrow(editor, inputTextId, shape.id)

  const outputTextId = createShapeId()
  editor.createShape({
    id: outputTextId,
    type: 'text',
    parentId: parentId,
    x: shape.x + shape.props.w - 60 + (parentIsFrame ? 10 : 0),
    y: shape.y + shape.props.h + 100,
    props: { richText: toRichText('Output'), font: 'sans' },
  })
  createArrow(editor, shape.id, outputTextId)

  const gatewayId = createShapeId()
  editor.createShape({
    id: gatewayId,
    type: 'gateway-fe',
    parentId: parentId,
    x: shape.x + shape.props.w + 200,
    y: shape.y + shape.props.h / 2 - DIMOND_SIDE_LENGTH / 2,
    props: { text: 'Errors from service?' },
  })
  createArrow(editor, shape.id, gatewayId)

  const messageId = createShapeId()
  editor.createShape({
    id: messageId,
    type: 'message',
    parentId: parentId,
    x: shape.x + shape.props.w + 215,
    y: shape.y + shape.props.h / 2 - DIMOND_SIDE_LENGTH / 2 - 200,
    props: { text: 'Display error message' },
  })
  createArrow(editor, gatewayId, messageId)
}

function addBePreset<T extends ShapeDefinition>(
  shape: BaseShape<T>,
  editor: Editor,
) {
  const parentId = shape.parentId || editor.getCurrentPageId()
  const inputTextId = createShapeId()

  editor.createShape({
    id: inputTextId,
    type: 'text',
    parentId: parentId,
    x: shape.x,
    y: shape.y + shape.props.h + 100,
    props: { richText: toRichText('Input'), font: 'sans' },
  })
  createArrow(editor, inputTextId, shape.id)

  const outputTextId = createShapeId()
  editor.createShape({
    id: outputTextId,
    type: 'text',
    parentId: parentId,
    x: shape.x + shape.props.w - 60,
    y: shape.y + shape.props.h + 100,
    props: { richText: toRichText('Output'), font: 'sans' },
  })
  createArrow(editor, shape.id, outputTextId)

  const gatewayId = createShapeId()
  editor.createShape({
    id: gatewayId,
    type: 'error',
    x: shape.x + shape.props.w / 2 - CIRCLE_RADIUS / 2,
    y: shape.y - 200,
    props: { text: 'Errors from service?' },
  })
  createArrow(editor, shape.id, gatewayId)

  const tableId = createShapeId()
  editor.createShape({
    id: tableId,
    type: 'table-be',
    x: shape.x + shape.props.w / 2 - 175,
    y: shape.y - 320,
  })
}

const shapeChangeMap = {
  'service-call-be': [
    {
      value: 'service-call-be-external',
      icon: 'service-call-be-external-preview',
    },
  ],
  'service-call-be-external': [
    {
      value: 'service-call-be',
      icon: 'service-call-be-preview',
    },
  ],
  'service-call-fe': [],
}

function createServiceCallClass(
  variant: 'service-call-fe' | 'service-call-be' | 'service-call-be-external',
) {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

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
      const presetId = shape.id + '-preset'

      return (
        <HTMLContainer
          style={{
            background: {
              'service-call-fe': 'var(--primary-green)',
              'service-call-be': 'var(--primary-green)',
              'service-call-be-external': 'var(--grey)',
            }[variant],
            border: 'var(--border)',
            padding: '1rem',
            borderRadius: 'var(--border-radius-px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: isSelected ? 'all' : 'none',
          }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            if (
              target.id === presetId ||
              target.closest(`#${CSS.escape(presetId)}`)
            ) {
              stopEventPropagation(e)
            }
          }}
        >
          {isSelected && (
            <TransformButton
              id={presetId}
              presets={[
                ...mapTransformations(
                  shapeChangeMap,
                  variant,
                  shape,
                  this.editor,
                ),
                ...({
                  'service-call-be': [
                    {
                      onSelected: () => addBePreset(shape, this.editor),
                      iconUrl: '/service-be-preset.svg',
                    },
                  ],
                  'service-call-be-external': [
                    {
                      onSelected: () => addBePreset(shape, this.editor),
                      iconUrl: '/service-be-preset.svg',
                    },
                  ],
                  'service-call-fe': [
                    {
                      onSelected: () => addFePreset(shape, this.editor),
                      iconUrl: '/service-fe-preset.svg',
                    },
                  ],
                }[variant] || []),
              ]}
            />
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 'var(--rectangle-icon-height-px)',
            }}
          >
            <img
              src="/service-call.svg"
              height={RECTANGLE_ICON_HEIGHT}
              draggable={false}
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
