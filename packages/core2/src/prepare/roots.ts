import { Scraped } from '../scraped'
import { RootConfig } from '../index'
import { ErrorableResult } from '../../tests/utils/ErrorableResult'

export const getRoots = async ({
  scraped,
  roots,
}: {
  scraped: Scraped
  roots: RootConfig[]
}): Promise<ErrorableResult<RootConfig[]>> => {
  const allRoots = scraped.filter((n) => n.type === 'root')
  if (allRoots.length === 0) return { error: 'No roots found' }
  if (roots.length === 1 && roots[0].name === undefined && allRoots.length > 1)
    return { error: 'Multiple roots found' }
  if (
    roots.length === 1 &&
    roots[0].name === undefined &&
    allRoots.length === 1
  )
    return {
      value: allRoots.map((r) => ({ name: r.raw, target: roots[0].target })),
    }
  if (roots.length === 1 && roots[0].name === '+')
    return {
      value: allRoots.map((n) => ({
        name: n.raw,
        target: roots[0].target,
      })),
    }
  if (roots.every((r) => allRoots.map((ar) => ar.raw).includes(r.name))) {
    return { value: roots }
  }
  return { error: 'Root not found' }
}
