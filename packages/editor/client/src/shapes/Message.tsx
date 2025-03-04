import {
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  ShapeUtil,
  TEXT_PROPS,
  TextLabel,
  useDefaultColorTheme,
} from 'tldraw'
import { BaseShape, figureStyles } from './index'
import { CSSProperties } from 'react'
import { Shapes } from 'editor-common'

const shapeType = Shapes.message
type ShapeType = BaseShape<typeof shapeType>

const radius = 90

export default class extends ShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  getDefaultProps(): ShapeType['props'] {
    return {
      h: radius,
      w: radius,
      text: 'Edit me..',
      color: 'light-blue',
      dash: 'solid',
    }
  }

  override canEdit = () => true
  override canResize = () => false
  override hideSelectionBoundsFg = () => true

  override getGeometry() {
    return new Rectangle2d({
      width: radius,
      height: radius,
      isFilled: true,
    })
  }

  override component(shape: ShapeType) {
    const style: CSSProperties = { pointerEvents: 'all' }
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
    const theme = useDefaultColorTheme()

    return (
      <HTMLContainer style={style}>
        <div>
          <div
            style={{
              width: `${radius}px`,
              height: `${radius}px`,
              borderRadius: `${radius}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: figureStyles.border,
              borderStyle: shape.props.dash,
              background: theme[shape.props.color].solid,
            }}
          >
            <svg
              width="50"
              height="38"
              viewBox="0 0 50 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4.61538C2 2.52308 3.80392 2 4.70588 2H45.2941C47.4588 2 48 3.13855 48 4.61538V33.3846C48 35.4769 46.1961 36 45.2941 36H4.70588C2.54118 36 2 34.2564 2 33.3846V4.61538Z"
                fill="white"
                stroke="black"
                strokeWidth="3"
              />
              <path
                d="M29.675 19.9482C29.675 19.9482 27.0625 22.3333 25 22.3333C22.9375 22.3333 20.325 19.9482 20.325 19.9482M29.675 19.9482L47 3M29.675 19.9482L47 35M20.325 19.9482L3 3M20.325 19.9482L3 35"
                stroke="black"
                strokeWidth="3"
              />
            </svg>
          </div>
          <TextLabel
            shapeId={shape.id}
            type="text"
            labelColor="black"
            style={{
              position: 'absolute',
              top: `${radius}px`,
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

  override indicator(shape: ShapeType) {
    return (
      <circle
        cx={shape.props.w / 2}
        cy={shape.props.h / 2}
        r={Math.min(shape.props.w, shape.props.h) / 2}
      />
    )
  }
}
