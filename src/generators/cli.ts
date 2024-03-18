import scraped from './expected/scraped.json'
import { generatePlaywrightTests } from './playwright'
import * as path from 'node:path'
import { writeAllFiles } from './utils/files'

const pw = generatePlaywrightTests(scraped, path.join('src', 'generators', 'expected'), 'demo')
writeAllFiles([pw])
