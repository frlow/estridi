import { useMemo } from 'react'
import { useSync } from '@tldraw/sync'
import { defaultShapeUtils, Tldraw } from 'tldraw'
import { components, customAssetUrls, uiOverrides } from './ui.tsx'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { customShapes, customTools } from './shapes'
import 'tldraw/tldraw.css'


function App() {
  const store = useSync({
    uri: `${WORKER_URL}/`,
    assets: multiplayerAssets,
    shapeUtils: useMemo(() => [...customShapes, ...defaultShapeUtils], [])
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
    />
  )
}

export default App


