export function getXCoordinate(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  // Ensure the hash is positive and pad to 12 digits
  return hash * 20
}
