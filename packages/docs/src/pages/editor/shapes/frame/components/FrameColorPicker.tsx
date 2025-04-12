import { stopEventPropagation } from 'tldraw'
import { FRAME_COLORS } from '../../util/constants.ts'
import { Editor, type TLFrameShape } from '@tldraw/editor'

export const FrameColorPicker = ({
  shape,
  editor,
  isSelected,
}: {
  shape: TLFrameShape & { props: { color: string } }
  editor: Editor
  isSelected: boolean
}) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        maxWidth: 'calc(var(--tl-zoom)* 200px + var(--space-5))',
        right: 0,
        top: '-50px',
        transform: 'scale(var(--tl-scale))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        position: 'absolute',
        transformOrigin: '100% 100%',
        minWidth: '110px',
        height: 'auto',
        paddingBottom: '4px',
        pointerEvents: isSelected ? 'all' : 'none',
        padding: '4px',
      }}
      onPointerDown={isSelected ? stopEventPropagation : undefined}
    >
      <div
        style={{
          display: 'flex',
          gap: '6px',
        }}
      >
        {(Object.keys(FRAME_COLORS) as Array<keyof typeof FRAME_COLORS>).map(
          (colorKey) => (
            <button
              key={colorKey}
              onClick={() => {
                editor.updateShape({
                  id: shape.id,
                  type: shape.type,
                  props: { ...shape.props, color: colorKey },
                })
              }}
              className={`tl-color-picker-button ${shape.props.color === colorKey ? 'selected' : ''}`}
              style={{
                backgroundColor: FRAME_COLORS[colorKey],
              }}
            />
          ),
        )}
      </div>
    </div>
  )
}
