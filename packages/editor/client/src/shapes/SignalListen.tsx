import {
  BaseBoxShapeUtil,
  Geometry2d,
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  TEXT_PROPS,
  PlainTextLabel,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CSSProperties } from 'react'
import {
  BLUE,
  BORDER,
  CIRCLE_RADIUS,
  CIRCLE_SHAPE_TEXT_WIDTH,
  GREEN,
  INTER_BORDER,
} from './util/constants.ts'
import { mapTransformations } from './util/util.ts'
import { TransformButton } from './util/TransformButton'

const transformationMap = {
  'signal-listen-fe': [
    {
      value: 'signal-listen-fe-inter',
      icon: 'signal-listen-fe-inter-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-fe',
      icon: 'signal-send-fe-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-fe-inter',
      icon: 'signal-send-fe-inter-preview',
      updateProps: (props: any) => props,
    },
  ],
  'signal-listen-be': [
    {
      value: 'signal-listen-be-inter',
      icon: 'signal-listen-be-inter-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-be',
      icon: 'signal-send-be-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-be-inter',
      icon: 'signal-send-be-inter-preview',
      updateProps: (props: any) => props,
    },
  ],
  'signal-listen-fe-inter': [
    {
      value: 'signal-listen-fe',
      icon: 'signal-listen-fe-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-fe',
      icon: 'signal-send-fe-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-fe-inter',
      icon: 'signal-send-fe-inter-preview',
      updateProps: (props: any) => props,
    },
  ],
  'signal-listen-be-inter': [
    {
      value: 'signal-listen-be',
      icon: 'signal-listen-be-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-be',
      icon: 'signal-send-be-preview',
      updateProps: (props: any) => props,
    },
    {
      value: 'signal-send-be-inter',
      icon: 'signal-send-be-inter-preview',
      updateProps: (props: any) => props,
    },
  ],
}

function createSignalListenClass(
  variant:
    | 'signal-listen-fe'
    | 'signal-listen-be'
    | 'signal-listen-fe-inter'
    | 'signal-listen-be-inter',
) {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')
  const isInter = variant.includes('inter')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        w: CIRCLE_RADIUS,
        h: CIRCLE_RADIUS,
        text: 'Signal listen',
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
      const presetId = shape.id + '-preset-button'

      return (
        <HTMLContainer
          style={style}
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
              id={`${shape.id}-preset-button`}
              presets={mapTransformations(
                transformationMap,
                variant,
                shape,
                this.editor,
              )}
            />
          )}
          <div>
            <div
              style={{
                width: `${CIRCLE_RADIUS}px`,
                height: `${CIRCLE_RADIUS}px`,
                borderRadius: `${CIRCLE_RADIUS}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: isInter ? INTER_BORDER : BORDER,
                background: isFe ? BLUE : GREEN,
              }}
            >
              <img
                draggable={false}
                src="/signal-listen.svg"
                onError={(e) => {
                  console.error(`Failed to load image: /signal-listen.svg`, e)
                  // Set a fallback background color
                  ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
                }}
              />
            </div>
            <PlainTextLabel
              shapeId={shape.id}
              type="text"
              labelColor="black"
              style={{
                position: 'absolute',
                top: `${CIRCLE_RADIUS}px`,
              }}
              font="sans"
              textWidth={CIRCLE_SHAPE_TEXT_WIDTH}
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

export const SignalListenFe = createSignalListenClass('signal-listen-fe')
export const SignalListenBe = createSignalListenClass('signal-listen-be')
export const SignalListenFeInter = createSignalListenClass(
  'signal-listen-fe-inter',
)
export const SignalListenBeInter = createSignalListenClass(
  'signal-listen-be-inter',
)
