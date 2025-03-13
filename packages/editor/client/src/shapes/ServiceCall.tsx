import { BaseBoxShapeUtil, HTMLContainer, useDefaultColorTheme } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, figureStyles } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight.tsx'

const shapeType = Shapes.serviceCall
type ShapeType = BaseShape<typeof shapeType>

const DEFAULT_WIDTH = 300
const MIN_HEIGHT = 150
const ICON_HEIGHT = 40

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: MIN_HEIGHT,
      w: DEFAULT_WIDTH,
      text: 'Serivce Call..',
      color: 'light-green',
    }
  }

  override canEdit = () => true
  override hideSelectionBoundsFg = () => true
  override hideResizeHandles = () => false
  override canResize = () => true

  override component(shape: ShapeType) {
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
    const theme = useDefaultColorTheme()

    return (
      <HTMLContainer
        style={{
          background: theme[shape.props.color].solid,
          border: figureStyles.border,
          padding: '1rem',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: ICON_HEIGHT + 'px',
            height: ICON_HEIGHT + 'px',
            margin: '0.5rem',
          }}
        >
          <img src="/service-call.svg" height={ICON_HEIGHT} draggable={false} />
        </div>
        <TextLabelWithAutoHeight
          shape={shape}
          isSelected={isSelected}
          iconHeight={ICON_HEIGHT}
          minHeight={MIN_HEIGHT}
          padding={16}
        />
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
