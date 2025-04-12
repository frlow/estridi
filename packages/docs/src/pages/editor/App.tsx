import { useMemo } from 'react'
import { useSync } from '@tldraw/sync'
import { defaultShapeUtils, Tldraw } from 'tldraw'
import { components, customAssetUrls, uiOverrides } from './ui.tsx'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { customShapes, customTools } from './shapes'

import './style.css'
import 'tldraw/tldraw.css'

function App() {
  const store = useSync({
    uri: `${WORKER_URL}/api/sync`,
    assets: multiplayerAssets,
    shapeUtils: useMemo(() => {
      // Filter out the default frame and use our custom frame implementation
      const filteredDefaultShapes = defaultShapeUtils.filter(shape => shape.type !== 'frame');
      return [...customShapes, ...filteredDefaultShapes];
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
      }}
    />
  )
}

export default App
