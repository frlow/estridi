import { BaseBoxShapeUtil, HTMLContainer, useDefaultColorTheme } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, figureStyles } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight'

const shapeType = Shapes.script
type ShapeType = BaseShape<typeof shapeType>

const DEFAULT_WIDTH = 300
const MIN_HEIGHT = 150
const PADDING = 16
const ICON_HEIGHT = 36

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: MIN_HEIGHT,
      w: DEFAULT_WIDTH,
      text: 'Script tag..',
      color: 'light-blue',
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
        <div>
          <svg
            width="29"
            height="36"
            viewBox="0 0 29 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.1364 35C26.7727 35 28 33.5217 28 32.0435V12.8261C28 11.7174 27.6281 10.6423 26.5868 9.70158C25.5455 8.76087 19.8182 3.21739 18.5909 2.1087C17.3636 1 16.5455 1 14.9091 1H3.86364C1.81818 1 1 2.1087 1 3.58696V32.413C1 34.2609 1.81818 35 3.45455 35H25.1364Z"
              fill="white"
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M19 14.5L22.8297 17.1808C23.3984 17.5789 23.3984 18.4211 22.8297 18.8192L19 21.5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="bevel"
            />
            <path
              d="M10 14.5L6.17033 17.1808C5.60162 17.5789 5.60161 18.4211 6.17033 18.8192L10 21.5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="bevel"
            />
            <path
              d="M13 22.5L16 13"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="bevel"
            />
          </svg>
        </div>
        <TextLabelWithAutoHeight
          shape={shape}
          isSelected={isSelected}
          padding={PADDING}
          iconHeight={ICON_HEIGHT}
          minHeight={MIN_HEIGHT}
        />
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx="10" ry="10" />
  }
}
