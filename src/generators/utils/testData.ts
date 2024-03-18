import { Scraped } from '../../common'
import { findAllPaths } from './paths'

export const getTestData = (scraped: Scraped) => findAllPaths(scraped).flatMap(n => n).filter((n, i, arr) => arr.indexOf(n) === i).map(id => scraped.find(s => s.id === id))
