import {
  LABEL_FONT_SIZES,
  RichTextLabel,
  TEXT_PROPS,
  type TLShapeId,
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
    props: { richText?: any; w: number; h: number }
  }
  isSelected: boolean
  padding: number
  iconHeight: number
  minHeight: number
}) {
  const editor = useEditor()
  const textRef = useRef<HTMLDivElement>(null)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (textRef.current) {
      const textHeight = textRef.current.offsetHeight
      const newHeight = Math.max(
        minHeight,
        textHeight + iconHeight + padding * 2,
      )

      if (Math.abs(newHeight - shape.props.h) > 5) {
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
  }, [
    shape.props.richText,
    shape.props.h,
    editor,
    shape.id,
    shape.type,
    shape.props.w,
  ])

  return (
    <div ref={textRef}>
      <RichTextLabel
        style={{ position: 'relative', textShadow: 'none' }}
        shapeId={shape.id}
        type="text"
        font="sans"
        fontSize={LABEL_FONT_SIZES['s']}
        lineHeight={TEXT_PROPS.lineHeight}
        align="middle"
        verticalAlign="middle"
        richText={shape.props.richText}
        isSelected={isSelected}
        labelColor="black"
        wrap
        padding={padding}
      />
    </div>
  )
}
