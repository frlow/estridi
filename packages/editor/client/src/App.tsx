import { useMemo } from 'react'
import { useSync } from '@tldraw/sync'
import { DefaultColorThemePalette, defaultShapeUtils, Tldraw } from 'tldraw'
import { components, customAssetUrls, uiOverrides } from './ui.tsx'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { customShapes, customTools } from './shapes'
import 'tldraw/tldraw.css'

/* TODO:
 * Customize toolbar to fit all shapes
 * Remove colors we don't need
 */

DefaultColorThemePalette.lightMode['light-blue'].solid = '#83BBE5'
DefaultColorThemePalette.lightMode['light-green'].solid = '#85C74E'
DefaultColorThemePalette.lightMode['grey'].solid = '#E5E5E5'

function App() {
  const store = useSync({
    uri: `${WORKER_URL}/`,
    assets: multiplayerAssets,
    shapeUtils: useMemo(() => [...customShapes, ...defaultShapeUtils], []),
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
      onMount={(e) => {
        e.updateInstanceState({ isGridMode: true })
      }}
    />
  )
}

export default App
