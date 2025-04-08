import type { Movies } from './movies.spec'
import fs from 'node:fs'
import { expect } from '@playwright/test'

const data = JSON.parse(fs.readFileSync('src/data.json', 'utf8'))

export const handles: Movies = {
  setup: async function () {
    return {}
  },
  start: async function ({ page }) {
    await page.goto('/')
  },
  test_showTitleTheMoviesPage: async function ({ page }) {
    await page
      .getByRole('heading', { name: 'Welcome to the Movies Page' })
      .waitFor()
  },
  test_showInputSearch: async function ({ page }) {
    await page.getByRole('textbox', { name: 'Search' }).waitFor()
  },
  serviceCall_searchForMoviesApiMovies: async function ({ page, gateways }) {
    await page.route('/api/movies**', async (route) => {
      const url = new URL(route.request().url())
      const query = url.searchParams.get('q') || ''
      const response =
        gateways['Error from search'] === 'yes'
          ? { status: 500 }
          : {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(
              gateways["No movies found"] === "yes" ? [] : data.filter((movie) =>
                (movie.title + movie.franchise).includes(query),
              ),
            ),
          }
      await route.fulfill(response)
    })
  },
  test_searchForMoviesApiMovies: async function (args, _) {
    const requestPromise = args.page.waitForRequest('/api/movies**')
    return async () => {
      const request = await requestPromise
      const url = new URL(request.url())
      expect(url.searchParams.get('q')).toEqual('Titanfall Legacy')
    }
  },
  action_searchingForMovies: async function (args) {
    await args.page
      .getByRole('textbox', { name: 'Search' })
      .fill('Titanfall Legacy')
    await args.page.getByRole('button', { name: 'Search' }).click()
  },
  test_showErrorPage: async function (args) {
    await expect(args.page.getByText('Error')).toBeVisible()
  },
  test_showNoResults: async function (args) {
    await expect(args.page.getByText('No results found')).toBeVisible()
  },
  test_showMovieTitleMovieFranchise: async function (args) {
    // Wait for the movie list to be visible
    await args.page.getByRole('list').waitFor()

    // Check for a movie with the title "The Colossus Wars" and franchise "Titanfall Legacy"
    await expect(args.page.locator(".movie-item .movie-title")).toHaveText("Titanfall Legacy")
    await expect(args.page.locator(".movie-item .movie-franchise")).toHaveText("The Colossus Wars")
  },
}
