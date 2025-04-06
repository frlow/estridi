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
import { CIRCLE_RADIUS, CIRCLE_SHAPE_TEXT_WIDTH } from './util/constants.ts'
import { handleDropShapeOnArrow } from './util/util.ts'
import { ShapeMenus } from './util/ShapeMenus.tsx'

const transformationMap = {
  'signal-listen-fe': [
    {
      value: 'signal-listen-fe-inter',
      icon: 'signal-listen-fe-inter-preview',
    },
    {
      value: 'signal-send-fe',
      icon: 'signal-send-fe-preview',
    },
    {
      value: 'signal-send-fe-inter',
      icon: 'signal-send-fe-inter-preview',
    },
  ],
  'signal-listen-be': [
    {
      value: 'signal-listen-be-inter',
      icon: 'signal-listen-be-inter-preview',
    },
    {
      value: 'signal-send-be',
      icon: 'signal-send-be-preview',
    },
    {
      value: 'signal-send-be-inter',
      icon: 'signal-send-be-inter-preview',
    },
  ],
  'signal-listen-fe-inter': [
    {
      value: 'signal-listen-fe',
      icon: 'signal-listen-fe-preview',
    },
    {
      value: 'signal-send-fe',
      icon: 'signal-send-fe-preview',
    },
    {
      value: 'signal-send-fe-inter',
      icon: 'signal-send-fe-inter-preview',
    },
  ],
  'signal-listen-be-inter': [
    {
      value: 'signal-listen-be',
      icon: 'signal-listen-be-preview',
    },
    {
      value: 'signal-send-be',
      icon: 'signal-send-be-preview',
    },
    {
      value: 'signal-send-be-inter',
      icon: 'signal-send-be-inter-preview',
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
    override hideRotateHandle = () => true

    override onTranslateEnd = (shape: ShapeType) =>
      handleDropShapeOnArrow(this.editor, shape.id)

    override getGeometry(_: ShapeType): Geometry2d {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const isEditing = shape.id === this.editor.getEditingShapeId()
      const presetId = shape.id + '-preset-button'
      const selectMenuId = shape.id + '-select-menu'
      return (
        <HTMLContainer
          style={{ pointerEvents: isSelected ? 'all' : 'none' }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            if (
              target.id === presetId ||
              target.closest(`#${CSS.escape(presetId)}`) ||
              target.id === selectMenuId ||
              target.closest(`#${CSS.escape(selectMenuId)}`)
            ) {
              stopEventPropagation(e)
            }
          }}
        >
          <ShapeMenus
            isSelected={isSelected}
            isEditing={isEditing}
            presetId={presetId}
            selectMenuId={selectMenuId}
            shape={shape}
            isFe={isFe}
            editor={this.editor}
            transformationMap={transformationMap[variant]}
          />
          <div>
            <div
              style={{
                width: 'var(--circle-radius-px)',
                height: 'var(--circle-radius-px)',
                borderRadius: 'var(--circle-radius-px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: isInter ? 'var(--inter-border)' : 'var(--border)',
                background: isFe
                  ? 'var(--primary-blue)'
                  : 'var(--primary-green)',
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
                top: 'var(--circle-radius-px)',
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
