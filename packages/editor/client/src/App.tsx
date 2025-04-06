import { useMemo } from 'react'
import { useSync } from '@tldraw/sync'
import { defaultShapeUtils, Tldraw, TLAssetId, TLImageShape } from 'tldraw'
import { components, customAssetUrls, uiOverrides } from './ui.tsx'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { customShapes, customTools } from './shapes'

import './style.css'
import 'tldraw/tldraw.css'

function App() {
  const store = useSync({
    uri: `${WORKER_URL}/sync`,
    assets: multiplayerAssets,
    shapeUtils: useMemo(() => {
      // Filter out the default frame and use our custom frame implementation
      const filteredDefaultShapes = defaultShapeUtils.filter(
        (shape) => shape.type !== 'frame',
      )
      return [...customShapes, ...filteredDefaultShapes]
    }, []),
  })

  return (
    <Tldraw
      store={store}
      shapeUtils={customShapes}
      tools={customTools}
      overrides={uiOverrides}
      components={components}
      assetUrls={customAssetUrls}
      deepLinks
      onMount={(editor) => {
        editor.updateInstanceState({ isGridMode: true })
        editor.user.updateUserPreferences({ isSnapMode: true })

        // Does not seem to be any official way of listening to asset deletions, so we have to do it manually
        editor.store.listen(
          (update) => {
            for (const record of Object.values(update.changes.removed)) {
              if (record.typeName === 'shape' && record.type === 'image') {
                const imageShape = record as TLImageShape
                if (imageShape.props.assetId) {
                  const asset = editor.store.get(
                    imageShape.props.assetId as TLAssetId,
                  )
                  if (asset && asset.props.src) {
                    const url = new URL(asset.props.src)
                    const filename = url.pathname.split('/uploads/')[1]
                    if (filename) {
                      fetch(`${WORKER_URL}/uploads/${filename}`, {
                        method: 'DELETE',
                      })
                        .then((response) => {
                          if (!response.ok) {
                            console.error(
                              `Failed to delete file on server: ${filename}`,
                              response.statusText,
                            )
                          }
                        })
                        .catch((error) => {
                          console.error(
                            `Error deleting file on server: ${filename}`,
                            error,
                          )
                        })
                    }
                  }
                }
              }
            }
          },
          { source: 'all' },
        )
      }}
    />
  )
}

export default App
