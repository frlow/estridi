import {
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TldrawUiMenuItem,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  useIsToolSelected,
  useTools,
} from 'tldraw'
import { icons, ShapeNames, Shapes } from 'editor-common'

export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons,
}

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    Object.values(Shapes).forEach((shape) => {
      tools[shape.name] = {
        id: shape.name,
        icon: shape.icon,
        label: shape.name,
        // kbd: 'c',
        onSelect: () => editor.setCurrentTool(shape.name),
      }
    })

    return tools
  },
}

// const TOOLS = [
//   { value: 'select', icon: 'tool-select' },
//   { value: 'draw', icon: 'tool-draw' },
//   { value: 'erase', icon: 'tool-erase' },
//   { value: 'text', icon: 'tool-text' },
//   { value: 'signalSend', icon: 'tool-signal-send' },
//   { value: 'signalListen', icon: 'tool-signal-listen' },
// ] as const

// const ContextToolbarComponent = track(() => {
//   const editor = useEditor()
//   const showToolbar = editor.isIn('select.idle')
//   if (!showToolbar) return null
//   const selectionRotatedPageBounds = editor.getSelectionRotatedPageBounds()
//   if (!selectionRotatedPageBounds) return null
//
//   const pageCoordinates = editor.pageToViewport(
//     selectionRotatedPageBounds.point,
//   )
//
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         pointerEvents: 'all',
//         top: pageCoordinates.y - 42,
//         left: pageCoordinates.x,
//         width: selectionRotatedPageBounds.width * editor.getZoomLevel(),
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//       onPointerDown={(e) => e.stopPropagation()}
//     >
//       <div
//         style={{
//           borderRadius: 8,
//           display: 'flex',
//           boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)',
//           background: 'var(--color-panel)',
//           width: 'fit-content',
//           alignItems: 'center',
//         }}
//       >
//         {TOOLS.map(({ value, icon }) => {
//           const isActive = editor.getCurrentToolId() === value
//           return (
//             <div
//               key={value}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: 32,
//                 width: 32,
//                 background: isActive ? 'var(--color-muted-2)' : 'transparent',
//               }}
//               onClick={() => editor.setCurrentTool(value)}
//             >
//               <TldrawUiIcon icon={icon} />
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// })

// const TOOLS = [
//   { value: 'select', icon: 'tool-select' },
//   { value: 'draw', icon: 'tool-draw' },
//   { value: 'erase', icon: 'tool-erase' },
//   { value: 'text', icon: 'tool-text' },
//   { value: 'signalSend', icon: 'tool-signal-send' },
//   { value: 'signalListen', icon: 'tool-signal-listen' },
// ] as const
//
// const ContextToolbarComponent = track(() => {
//   const editor = useEditor()
//   const showToolbar = editor.isIn('select.idle')
//   if (!showToolbar) return null
//   const selectionRotatedPageBounds = editor.getSelectionRotatedPageBounds()
//   if (!selectionRotatedPageBounds) return null
//
//   const pageCoordinates = editor.pageToViewport(
//     selectionRotatedPageBounds.point,
//   )
//
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         pointerEvents: 'all',
//         top: pageCoordinates.y - 42,
//         left: pageCoordinates.x,
//         width: selectionRotatedPageBounds.width * editor.getZoomLevel(),
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//       onPointerDown={(e) => e.stopPropagation()}
//     >
//       <div
//         style={{
//           borderRadius: 8,
//           display: 'flex',
//           boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)',
//           background: 'var(--color-panel)',
//           width: 'fit-content',
//           alignItems: 'center',
//         }}
//       >
//         {TOOLS.map(({ value, icon }) => {
//           const isActive = editor.currentTool === value
//           return (
//             <div
//               key={value}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: 32,
//                 width: 32,
//                 background: isActive ? 'var(--color-muted-2)' : 'transparent',
//               }}
//               onClick={() => editor.setCurrentTool(value)}
//             >
//               <TldrawUiIcon icon={icon} />
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// })

export const components: TLComponents = {
  // InFrontOfTheCanvas: ContextToolbarComponent,
  Toolbar: (props) => {
    const tools = useTools()
    const isSelected = ShapeNames.reduce((acc, cur) => {
      acc[cur] = useIsToolSelected(tools[cur])
      return acc
    }, {} as any)
    const toolItems = ShapeNames.filter((n) => n !== 'other').map(
      (shapeName, i) => (
        <TldrawUiMenuItem
          key={i}
          {...tools[shapeName]}
          isSelected={isSelected[shapeName]}
        />
      ),
    )
    return (
      <DefaultToolbar {...props}>
        {toolItems}
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
}
