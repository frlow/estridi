import { Scraped } from '../scraped'
import { RootConfig } from '../index'
import { getRoots } from './roots'
import { filterNodes } from './filterNodes'
import { ErrorableResult } from '../../tests/utils/ErrorableResult'

export const prepareTestableNodeTree = async ({
  scraped,
  rootConfigs,
}: {
  scraped: Scraped
  rootConfigs: RootConfig[]
}): Promise<ErrorableResult<any>> => {
  const rootsResult = await getRoots({ scraped, roots: rootConfigs })
  if (rootsResult.error) return { error: rootsResult.error }
  const scrapedByRoot = await Promise.all(
    rootsResult.value.map((r) => {
      const filtered = filterNodes({ scraped, rootName: r.name! })
    }),
  )
}
