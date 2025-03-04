import {
  LABEL_FONT_SIZES,
  TEXT_PROPS,
  TextLabel,
  TLShapeId,
  useEditor,
} from 'tldraw'
import { useEffect, useRef } from 'react'

export function TextLabelWithAutoHeight({
  shape,
  isSelected,
  padding,
  iconHeight,
  minHeight,
}: {
  shape: {
    id: TLShapeId
    type: string
    props: { text: string; w: number; h: number }
  }
  isSelected: boolean
  padding: number
  iconHeight: number
  minHeight: number
}) {
  const editor = useEditor()
  const textRef = useRef<HTMLDivElement>(null)

  // Update height after render when we have the actual DOM element
  useEffect(() => {
    if (textRef.current) {
      const textHeight = textRef.current.offsetHeight
      const newHeight = Math.max(minHeight, textHeight + iconHeight)

      if (Math.abs(newHeight - shape.props.h) > 5) {
        // Only update if the difference is significant (>5px)
        editor.updateShapes([
          {
            id: shape.id,
            type: shape.type,
            props: {
              ...shape.props,
              h: newHeight,
            },
          },
        ])
      }
    }
  }, [shape.props.text, shape.props.w, editor, shape.id, shape.type])

  return (
    <div ref={textRef}>
      <TextLabel
        style={{ position: 'relative', textShadow: 'none' }}
        shapeId={shape.id}
        type="text"
        font="sans"
        fontSize={LABEL_FONT_SIZES['s']}
        lineHeight={TEXT_PROPS.lineHeight}
        align="middle"
        verticalAlign="middle"
        text={shape.props.text}
        isSelected={isSelected}
        labelColor="black"
        wrap
        padding={padding}
      />
    </div>
  )
}
