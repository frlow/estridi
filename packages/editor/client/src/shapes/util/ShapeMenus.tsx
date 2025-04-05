import { useState } from 'react'
import { ShapeSelectMenu } from './ShapeSelectMenu'
import { TransformButton } from './TransformButton'
import { mapTransformations } from './util'

export const ShapeMenus = ({
  isSelected,
  isEditing,
  presetId,
  selectMenuId,
  shape,
  isFe,
  editor,
  transformationMap,
}: {
  isSelected: boolean
  isEditing: boolean
  presetId: string
  selectMenuId: string
  isFe: boolean
  shape: any
  editor: any
  transformationMap: any
}) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false)

  return (
    <>
      <TransformButton
        show={isSelected && !showSelectMenu && !isEditing}
        id={presetId}
        presets={mapTransformations(transformationMap, shape, editor)}
      />
      <ShapeSelectMenu
        isFe={isFe}
        id={selectMenuId}
        sourceShapeId={shape.id}
        show={showSelectMenu}
        onClose={() => setShowSelectMenu(!showSelectMenu)}
        editor={editor}
        showNextButton={isSelected && !isEditing}
      />
    </>
  )
}
