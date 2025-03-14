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

const shapeType = Shapes.timer
type ShapeType = BaseShape<typeof shapeType>

const radius = 90

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      w: radius,
      h: radius,
      text: 'Signal listen',
      color: 'light-blue',
      dash: 'dashed',
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
              borderStyle: shape.props.dash,
              background: theme[shape.props.color].solid,
            }}
          >
            <img height="60px" draggable={false} src="/timer.svg" />
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
