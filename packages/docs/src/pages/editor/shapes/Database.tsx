import { BaseBoxShapeUtil, HTMLContainer, toRichText } from 'tldraw'
import { Shapes } from 'editor-common'
import { type BaseShape } from './index.ts'
import {
  BORDER,
  BORDER_RADIUS,
  GREEN,
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
  RECTANGLE_ICON_HEIGHT,
  RECTANGLE_ICON_PADDING,
} from './util/constants.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight.tsx'

const shapeType = Shapes.database
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: RECTANGLE_DEFAULT_HEIGHT,
      w: RECTANGLE_DEFAULT_WIDTH,
      richText: toRichText('Get x from y'),
    }
  }

  override canEdit = () => true
  override hideSelectionBoundsFg = () => true
  override hideResizeHandles = () => false
  override canResize = () => true

  override component(shape: ShapeType) {
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

    return (
      <HTMLContainer
        style={{
          background: GREEN,
          border: BORDER,
          padding: '1rem',
          borderRadius: BORDER_RADIUS,
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
            src="/database.svg"
            height={RECTANGLE_ICON_HEIGHT}
            draggable={false}
            onError={(e) => {
              console.error(`Failed to load image: /database.svg`, e)
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
    return <rect width={shape.props.w} height={shape.props.h} rx="10" ry="10" />
  }
}
