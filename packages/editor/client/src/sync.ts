import { TLAssetStore, uniqueId } from 'tldraw'

export const WORKER_URL = `${window.location.protocol}//${window.location.hostname}:4005`

// @ts-ignore
export const multiplayerAssets: TLAssetStore = {
  async upload(_asset, file) {
    const id = uniqueId()

    const objectName = `${id}-${file.name}`
    const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`

    const response = await fetch(url, {
      method: 'PUT',
      body: file,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`)
    }

    return { src: url }
  },
  // to retrieve an asset, we can just use the same URL. you could customize this to add extra
  // auth, or to serve optimized versions / sizes of the asset.
  resolve(asset) {
    return asset.props.src
  },
}
