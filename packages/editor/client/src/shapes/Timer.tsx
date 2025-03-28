import {
  BaseBoxShapeUtil,
  Geometry2d,
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  TEXT_PROPS,
  TextLabel,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CSSProperties } from 'react'
import { BLUE, CIRCLE_RADIUS, GREEN, INTER_BORDER } from './util/constants.ts'

function createShape(variant: 'timer-fe' | 'timer-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        w: CIRCLE_RADIUS,
        h: CIRCLE_RADIUS,
        text: 'Wait x seconds',
      }
    }

    override canResize = () => false
    override canEdit = () => true
    override hideSelectionBoundsFg = () => true

    override getGeometry(_: ShapeType): Geometry2d {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override component(shape: ShapeType) {
      const style: CSSProperties = { pointerEvents: 'all' }
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

      return (
        <HTMLContainer style={style}>
          <div>
            <div
              style={{
                width: `${CIRCLE_RADIUS}px`,
                height: `${CIRCLE_RADIUS}px`,
                borderRadius: `${CIRCLE_RADIUS}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: INTER_BORDER,
                background: isFe ? BLUE : GREEN,
              }}
            >
              <img
                height="60px"
                draggable={false}
                src="/timer.svg"
                onError={(e) => {
                  console.error(`Failed to load image: /timer.svg`, e)
                  // Set a fallback background color
                  ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
                }}
              />
            </div>
            <TextLabel
              shapeId={shape.id}
              type="text"
              labelColor="black"
              style={{
                position: 'absolute',
                top: `${CIRCLE_RADIUS}px`,
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
          cx={CIRCLE_RADIUS / 2}
          cy={CIRCLE_RADIUS / 2}
          r={Math.min(CIRCLE_RADIUS, CIRCLE_RADIUS) / 2}
        />
      )
    }
  }
}

export const TimerFE = createShape('timer-fe')
export const TimerBE = createShape('timer-be')
