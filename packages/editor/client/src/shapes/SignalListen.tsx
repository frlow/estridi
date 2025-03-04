import {
  BaseBoxShapeUtil,
  Geometry2d,
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  TEXT_PROPS,
  TextLabel,
  useDefaultColorTheme,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, figureStyles } from './index.ts'
import { CSSProperties } from 'react'

const shapeType = Shapes.signalListen
type ShapeType = BaseShape<typeof shapeType>

const radius = 90

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: radius,
      w: radius,
      text: 'Signal send..',
      color: 'light-blue',
    }
  }

  override canResize = () => false
  override canEdit = () => true
  override hideSelectionBoundsFg = () => true

  override getGeometry(_: ShapeType): Geometry2d {
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
              background: theme[shape.props.color].solid,
            }}
          >
            <svg
              width="42"
              height="36"
              viewBox="0 0 42 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.6808 1.87239L40.4022 33.4472C40.6465 33.8593 40.384 34.5 39.7214 34.5H2.27861C1.616 34.5 1.35353 33.8593 1.59782 33.4472L20.3192 1.87239C20.6136 1.37587 21.3864 1.37587 21.6808 1.87239Z"
                fill="black"
                stroke="black"
                strokeWidth="3"
                strokeLinejoin="round"
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
