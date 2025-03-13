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
      w: radius,
      h: radius,
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
            <img src="./message.svg" alt="message" draggable={false} />
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

  override indicator() {
    return (
      <circle
        cx={radius / 2}
        cy={radius / 2}
        r={Math.min(radius, radius) / 2}
      />
    )
  }
}
