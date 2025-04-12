import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d } from 'tldraw'
import { type ShapeName, Shapes } from 'editor-common'
import { type BaseShape } from './index.ts'
import { BLUE, CIRCLE_RADIUS, END_BORDER, GREEN } from './util/constants.ts'
import { PresetButton } from './util/PresetButton.tsx'

function createStartClass(variant: 'end-fe' | 'end-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props
    static transformations = {
      'end-fe': [{ value: 'start-fe' as ShapeName, icon: 'start-fe-preview' }],
      'end-be': [{ value: 'start-be' as ShapeName, icon: 'start-be-preview' }],
    }[variant]

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: CIRCLE_RADIUS,
        w: CIRCLE_RADIUS,
      }
    }

    override canEdit = () => false
    override canResize = () => false
    override hideSelectionBoundsFg = () => true

    override getGeometry() {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override component(shape: ShapeType) {
      const editor = this.editor
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

      return (
        <HTMLContainer>
          <div
            style={{
              width: `${CIRCLE_RADIUS}px`,
              height: `${CIRCLE_RADIUS}px`,
              borderRadius: `${CIRCLE_RADIUS}px`,
              border: END_BORDER,
              background: isFe ? BLUE : GREEN,
            }}
          ></div>
          {isSelected && (
            <PresetButton
              id={`${shape.id}-preset-button`}
              shapesToChangeTo={
                {
                  'end-fe': [
                    {
                      iconUrl: '/start-fe-preview.svg',
                      onSelected: () => {
                        editor.updateShape({
                          id: shape.id,
                          type: 'start-fe',
                        })
                      },
                    },
                  ],
                  'end-be': [
                    {
                      iconUrl: '/start-be-preview.svg',
                      onSelected: () => {
                        editor.updateShape({
                          id: shape.id,
                          type: 'start-be',
                        })
                      },
                    },
                  ],
                }[variant]
              }
              presets={[]}
            />
          )}
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

export const EndFe = createStartClass('end-fe')
export const EndBe = createStartClass('end-be')
