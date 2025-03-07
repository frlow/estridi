import { TLAssetStore, uniqueId } from 'tldraw'
import { port } from 'editor-common/config'

export const WORKER_URL = `http://${window.location.hostname}:${port}`

export const multiplayerAssets: TLAssetStore = {
  // to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
  async upload(_asset, file) {
    const id = uniqueId()

    const objectName = `${id}-${file.name}`
    const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`

    const response = await fetch(url, {
      method: 'PUT',
      body: file
    })

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`)
    }

    return url
  },
  // to retrieve an asset, we can just use the same URL. you could customize this to add extra
  // auth, or to serve optimized versions / sizes of the asset.
  resolve(asset) {
    return asset.props.src
  }
}
