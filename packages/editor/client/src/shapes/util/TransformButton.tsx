import React from 'react'

export function TransformButton({
  id,
  presets,
}: {
  id: string
  presets: { iconUrl: string; onSelected: () => void }[]
}): React.ReactElement | null {
  if (!presets || presets.length === 0) {
    return null
  }

  return (
    <div id={id} className="transform-menu">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {presets.map((preset) => (
          <button
            key={preset.iconUrl}
            className="shape-switch-menu-button"
            onClick={() => {
              preset.onSelected()
            }}
          >
            <img
              src={preset.iconUrl}
              style={{ padding: '5px' }}
              height="45px"
              width="45px"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

//TODO: AI generated version that makes the buttons always be on top, use ?

// import React, { useEffect, useRef, useState } from 'react'
// import ReactDOM from 'react-dom'

// interface PositionState {
//   position?: 'fixed'
//   top: string | number
//   left: string | number
//   transform?: string
//   zIndex?: number
// }

// export function PresetButton({
//   id,
//   presets,
// }: {
//   id: string
//   presets: { iconUrl: string; onSelected: () => void }[]
// }): React.ReactElement | null {
//   const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
//     null,
//   )
//   const buttonRef = useRef<HTMLDivElement>(null)
//   const [position, setPosition] = useState<PositionState>({
//     top: '-60px',
//     left: '50%',
//   })

//   useEffect(() => {
//     // Create portal container at document root
//     const portalDiv = document.createElement('div')
//     portalDiv.id = `portal-${id}`
//     document.body.appendChild(portalDiv)
//     setPortalContainer(portalDiv)

//     // Update position when canvas scrolls or zooms
//     const updatePosition = () => {
//       if (!buttonRef.current) return

//       const parent = buttonRef.current.parentElement
//       if (!parent) return

//       const rect = parent.getBoundingClientRect()
//       const newPosition: PositionState = {
//         position: 'fixed',
//         top: rect.top - 60,
//         left: rect.left + rect.width / 2,
//         transform: 'translateX(-50%)',
//         zIndex: 2147483647, // Maximum z-index value
//       }

//       setPosition(newPosition)
//     }

//     // Set up observer for canvas changes
//     const observer = new MutationObserver(updatePosition)
//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//       attributes: true,
//       attributeFilter: ['style', 'class'],
//     })

//     // Initial position and event listeners
//     updatePosition()
//     window.addEventListener('resize', updatePosition)
//     window.addEventListener('scroll', updatePosition, true)

//     // Cleanup
//     return () => {
//       document.body.removeChild(portalDiv)
//       observer.disconnect()
//       window.removeEventListener('resize', updatePosition)
//       window.removeEventListener('scroll', updatePosition, true)
//     }
//   }, [id])

//   if (!presets || presets.length === 0) {
//     return null
//   }

//   // Invisible placeholder to track position
//   const placeholder = (
//     <div
//       ref={buttonRef}
//       style={{
//         position: 'absolute',
//         top: '-60px',
//         left: '50%',
//         width: '2px',
//         height: '2px',
//         pointerEvents: 'none',
//         opacity: 0,
//       }}
//     />
//   )

//   // Content for the portal
//   const buttonContent = (
//     <div
//       style={{
//         position: position.position || 'fixed',
//         top: position.top,
//         left: position.left,
//         transform: position.transform || 'translateX(-50%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         pointerEvents: 'all',
//         zIndex: position.zIndex || 2147483647,
//       }}
//     >
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         {presets.map((preset) => (
//           <button
//             key={preset.iconUrl}
//             className="shape-switch-menu-button"
//             onClick={() => {
//               preset.onSelected()
//             }}
//           >
//             <img
//               src={preset.iconUrl}
//               style={{ padding: '5px' }}
//               height="40px"
//               width="40px"
//               draggable={false}
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {placeholder}
//       {portalContainer && ReactDOM.createPortal(buttonContent, portalContainer)}
//     </>
//   )
// }
