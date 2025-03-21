import { Scraped } from '../scraped'
import { filterScraped } from 'core'

export const filterNodes = async ({
  scraped,
  rootName,
}: {
  scraped: Scraped
  rootName: string
}): Promise<Scraped> => {
  return filterScraped(scraped, rootName)
}
