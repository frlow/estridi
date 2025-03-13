import { useMemo } from 'react'
import { useSync } from '@tldraw/sync'
import { DefaultColorThemePalette, defaultShapeUtils, Tldraw } from 'tldraw'
import { components, customAssetUrls, uiOverrides } from './ui.tsx'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { customShapes, customTools } from './shapes'
import './style.css'
import 'tldraw/tldraw.css'

/* TODO:
 * Customize toolbar to fit all shapes
 * Remove colors we don't need
 */

DefaultColorThemePalette.lightMode['light-blue'].solid = '#83BBE5'
DefaultColorThemePalette.lightMode['green'].solid = '#85C74E'
DefaultColorThemePalette.lightMode['light-green'].solid = '#c0dfa7'
DefaultColorThemePalette.lightMode['grey'].solid = '#E5E5E5'

function App() {
  const store = useSync({
    uri: `${WORKER_URL}/sync`,
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
      // onUiEvent={handleEvent}
      onMount={(editor) => {
        editor.updateInstanceState({ isGridMode: true })
        editor.user.updateUserPreferences({ isSnapMode: true })
      }}
    />
  )
}

export default App
