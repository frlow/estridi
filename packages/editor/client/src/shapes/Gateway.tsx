import {
  HTMLContainer,
  LABEL_FONT_SIZES,
  Rectangle2d,
  ShapeUtil,
  TEXT_PROPS,
  PlainTextLabel,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { DIMOND_SIDE_LENGTH } from './util/constants.ts'
import { ShapeMenus } from './util/ShapeMenus.tsx'
import { handleDropShapeOnArrow } from './util/util.ts'
const transformationMap = {
  'gateway-fe': [
    { value: 'loop-fe', icon: 'loop-fe-preview' },
    { value: 'parallel-fe', icon: 'parallel-fe-preview' },
  ],
  'gateway-be': [
    { value: 'loop-be', icon: 'loop-be-preview' },
    { value: 'parallel-be', icon: 'parallel-be-preview' },
  ],
  'loop-fe': [
    { value: 'gateway-fe', icon: 'gateway-fe-preview' },
    { value: 'parallel-fe', icon: 'parallel-fe-preview' },
  ],
  'loop-be': [
    { value: 'gateway-be', icon: 'gateway-be-preview' },
    { value: 'parallel-be', icon: 'parallel-be-preview' },
  ],
  'parallel-fe': [
    { value: 'gateway-fe', icon: 'gateway-fe-preview' },
    { value: 'loop-fe', icon: 'loop-fe-preview' },
  ],
  'parallel-be': [
    { value: 'gateway-be', icon: 'gateway-be-preview' },
    { value: 'loop-be', icon: 'loop-be-preview' },
  ],
}

const createGatewayClass = (
  variant:
    | 'gateway-fe'
    | 'gateway-be'
    | 'loop-fe'
    | 'loop-be'
    | 'parallel-fe'
    | 'parallel-be',
) => {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: DIMOND_SIDE_LENGTH,
        w: DIMOND_SIDE_LENGTH,
        text: 'Edit me..',
      }
    }

    override hideSelectionBoundsFg = () => true
    override canEdit = () => true
    override canResize = () => false
    override hideRotateHandle = () => true

    override onTranslateEnd = (shape: ShapeType) =>
      handleDropShapeOnArrow(this.editor, shape.id)

    override getGeometry = () =>
      new Rectangle2d({
        width: DIMOND_SIDE_LENGTH,
        height: DIMOND_SIDE_LENGTH,
        isFilled: true,
      })

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const isEditing = shape.id === this.editor.getEditingShapeId()
      const presetId = shape.id + '-preset'
      const selectMenuId = shape.id + '-select-menu'

      return (
        <HTMLContainer
          style={{ pointerEvents: isSelected ? 'all' : 'none' }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            const elementId = target.id
            const isMenuElement =
              elementId === presetId ||
              elementId === selectMenuId ||
              target.closest(`#${CSS.escape(presetId)}`) ||
              target.closest(`#${CSS.escape(selectMenuId)}`)

            if (isMenuElement) {
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
                width: 'var(--dimond-side-length-px)',
                height: 'var(--dimond-side-length-px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: `calc(0.7 * var(--dimond-side-length-px))`,
                  height: `calc(0.7 * var(--dimond-side-length-px))`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'var(--border)',
                  borderStyle: 'solid',
                  borderRadius: 'var(--border-radius-px)',
                  background: isFe
                    ? 'var(--primary-blue)'
                    : 'var(--primary-green)',
                  transform: 'rotate(45deg)',
                }}
              >
                {variant.includes('loop') && (
                  <img
                    src="./loop.svg"
                    alt="loop"
                    draggable={false}
                    style={{ transform: 'rotate(-45deg)' }}
                    onError={(e) => {
                      console.error(`Failed to load image: ./loop.svg`, e)
                      // Set a fallback background color
                      ;(e.target as HTMLImageElement).style.backgroundColor =
                        '#ddd'
                    }}
                  />
                )}
                {variant.includes('parallel') && (
                  <img
                    src="./parallel.svg"
                    alt="loop"
                    draggable={false}
                    style={{ transform: 'rotate(-45deg)' }}
                    onError={(e) => {
                      console.error(`Failed to load image: ./parallel.svg`, e)
                      // Set a fallback background color
                      ;(e.target as HTMLImageElement).style.backgroundColor =
                        '#ddd'
                    }}
                  />
                )}
              </div>
            </div>
            <PlainTextLabel
              shapeId={shape.id}
              type="text"
              labelColor="black"
              style={{
                position: 'absolute',
                top: 'var(--dimond-side-length-px)',
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
        <rect
          x={20}
          y={20}
          width="80px"
          height="80px"
          transform="rotate(45 60 60)"
          rx="8"
          ry="8"
        />
      )
    }
  }
}

export const GatewayFe = createGatewayClass('gateway-fe')
export const GatewayBe = createGatewayClass('gateway-be')

export const LoopFe = createGatewayClass('loop-fe')
export const LoopBe = createGatewayClass('loop-be')

export const ParallelFe = createGatewayClass('parallel-fe')
export const ParallelBe = createGatewayClass('parallel-be')
