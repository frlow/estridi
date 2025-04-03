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
  BLUE,
  BORDER,
  BORDER_RADIUS,
  CIRCLE_RADIUS,
  DIMOND_SIDE_LENGTH,
  GREEN,
  GREY,
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
  RECTANGLE_ICON_HEIGHT,
  RECTANGLE_ICON_PADDING,
} from './util/constants.ts'
import { createArrow } from './util/util.ts'
import { PresetButton } from './util/PresetButton.tsx'

function addFePreset<T extends ShapeDefinition>(
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

function changeShape(
  shape: BaseShape<ShapeDefinition>,
  editor: Editor,
  shapeName: string,
  filterProps?: (props: any) => any,
) {
  editor.deleteShape(shape.id)
  const newShape = { ...shape, type: shapeName }
  if (filterProps) {
    newShape.props = filterProps(shape.props)
  }
  editor.createShape(newShape)
}

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
      const presetId = shape.id + '-preset'

      return (
        <HTMLContainer
          style={{
            background: {
              'service-call-fe': GREEN,
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
            />
          </div>
          <TextLabelWithAutoHeight
            shape={shape}
            isSelected={isSelected}
            iconHeight={RECTANGLE_ICON_HEIGHT}
            minHeight={RECTANGLE_DEFAULT_HEIGHT}
            padding={RECTANGLE_ICON_PADDING}
          />
          {isSelected && (
            <PresetButton
              id={presetId}
              presets={
                {
                  'service-call-be': [
                    {
                      onPresetPressed: () => addBePreset(shape, this.editor),
                      iconUrl: '/gateway-be-preview.svg',
                    },
                  ],
                  'service-call-be-external': [
                    {
                      onPresetPressed: () => addBePreset(shape, this.editor),
                      iconUrl: '/gateway-be-preview.svg',
                    },
                  ],
                  'service-call-fe': [
                    {
                      onPresetPressed: () => addFePreset(shape, this.editor),
                      iconUrl: '/gateway-fe-preview.svg',
                    },
                  ],
                }[variant]
              }
              shapesToChangeTo={
                {
                  'service-call-be': [
                    {
                      onSelected: () =>
                        changeShape(
                          shape,
                          this.editor,
                          'service-call-be-external',
                        ),
                      iconUrl: '/service-call-be-external-preview.svg',
                    },
                  ],
                  'service-call-be-external': [
                    {
                      onSelected: () =>
                        changeShape(shape, this.editor, 'service-call-be'),
                      iconUrl: '/service-call-be-preview.svg',
                    },
                  ],
                  'service-call-fe': [],
                }[variant]
              }
            />
          )}
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
