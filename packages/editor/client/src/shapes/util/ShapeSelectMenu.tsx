import React, { useEffect, useRef } from 'react'
import { Editor, TLShapeId } from 'tldraw'
import { createShapeId, stopEventPropagation } from 'tldraw'
import { createArrow } from './util'

const feShapes = [
  { type: 'start-fe', iconUrl: './start-fe-preview.svg' },
  { type: 'message', iconUrl: './message-preview.svg' },
  { type: 'signal-listen-fe', iconUrl: './signal-listen-fe-preview.svg' },
  { type: 'signal-send-fe', iconUrl: './signal-send-fe-preview.svg' },
  { type: 'gateway-fe', iconUrl: './gateway-fe-preview.svg' },
  { type: 'loop-fe', iconUrl: './loop-fe-preview.svg' },
  { type: 'timer-fe', iconUrl: './timer-fe-preview.svg' },
  { type: 'parallel-fe', iconUrl: './parallel-fe-preview.svg' },
  { type: 'subprocess-fe', iconUrl: './subprocess-fe-preview.svg' },
  { type: 'service-call-fe', iconUrl: './service-call-fe-preview.svg' },
  { type: 'script-fe', iconUrl: './script-fe-preview.svg' },
  { type: 'user-action-fe', iconUrl: './user-action-preview.svg' },
  { type: 'custom-note-fe', iconUrl: './custom-note-preview.svg' },
  { type: 'table-fe', iconUrl: './table-preview.svg' },
  { type: 'connector', iconUrl: './connector-preview.svg' },
]

const beShapes = [
  { type: 'start-be', iconUrl: './start-be-preview.svg' },
  { type: 'error', iconUrl: './hard-error-preview.svg' },
  { type: 'signal-listen-be', iconUrl: './signal-listen-be-preview.svg' },
  { type: 'signal-send-be', iconUrl: './signal-send-be-preview.svg' },
  { type: 'gateway-be', iconUrl: './gateway-be-preview.svg' },
  { type: 'loop-be', iconUrl: './loop-be-preview.svg' },
  { type: 'timer-be', iconUrl: './timer-be-preview.svg' },
  { type: 'parallel-be', iconUrl: './parallel-be-preview.svg' },
  { type: 'subprocess-be', iconUrl: './subprocess-be-preview.svg' },
  { type: 'service-call-be', iconUrl: './service-call-be-preview.svg' },
  { type: 'script-be', iconUrl: './script-be-preview.svg' },
  { type: 'database', iconUrl: './database-preview.svg' },
  { type: 'custom-note-be', iconUrl: './custom-note-preview.svg' },
  { type: 'table-be', iconUrl: './table-preview.svg' },
  { type: 'connector', iconUrl: './connector-preview.svg' },
]

interface ShapeSelectMenuProps {
  id: string
  sourceShapeId: TLShapeId
  show: boolean
  onClose: () => void
  editor: Editor
  showNextButton: boolean
  isFe: boolean
}

export function ShapeSelectMenu({
  id,
  sourceShapeId,
  show,
  onClose,
  editor,
  showNextButton,
  isFe,
}: ShapeSelectMenuProps): React.ReactElement {
  const menuRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!show) return

    const handleOutsideClick = (e: MouseEvent) => {
      // Skip if click is on the menu itself or on the handle button
      if (
        menuRef.current?.contains(e.target as Node) ||
        handleRef.current?.contains(e.target as Node)
      ) {
        return
      }
      onClose()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [show, onClose])

  return (
    <>
      <div className="new-shape-handle-wrapper" id={id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button
            className="new-shape-handle"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            ref={handleRef}
            style={{
              transform: showNextButton && !show ? 'scale(1)' : 'scale(0)',
              pointerEvents: showNextButton ? 'auto' : 'none',
            }}
          ></button>
        </div>
      </div>
      <div
        className="select-menu-wrapper"
        style={{
          pointerEvents: show ? 'auto' : 'none',
        }}
        ref={menuRef}
        onPointerDown={stopEventPropagation}
      >
        <div
          className="select-menu"
          style={{
            transform: show ? 'scale(1)' : 'scale(0)',
            opacity: show ? '1' : '0',
          }}
        >
          {(isFe ? feShapes : beShapes).map((_shape) => (
            <button
              key={_shape.type}
              className="select-menu-button"
              onClick={() => {
                const newShapeId = createShapeId()
                editor.createShape({
                  id: newShapeId,
                  type: _shape.type,
                  x: (editor.getShape(sourceShapeId)?.x || 0) + 300,
                  y: editor.getShape(sourceShapeId)?.y || 0,
                })

                const createdShape = editor.getShape(newShapeId)
                if (createdShape) {
                  const sourceBounds = editor.getShapePageBounds(sourceShapeId)
                  const newShapeBounds = editor.getShapePageBounds(newShapeId)

                  if (sourceBounds && newShapeBounds) {
                    const sourceCenterY =
                      sourceBounds.y + sourceBounds.height / 2
                    const newShapeCenterY =
                      newShapeBounds.y + newShapeBounds.height / 2
                    const yOffset = sourceCenterY - newShapeCenterY

                    editor.updateShape({
                      id: newShapeId,
                      type: createdShape.type,
                      y: createdShape.y + yOffset,
                    })
                  }
                }

                createArrow(editor, sourceShapeId, newShapeId)

                // Deselect current shape and select the new shape
                editor.select(newShapeId)

                onClose()
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={_shape.iconUrl}
                  style={{ padding: '5px' }}
                  height="45px"
                  width="45px"
                  draggable={false}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
