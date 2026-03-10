import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { ANAKIN_MODEL_DATA, LUKE_MODEL_DATA, SHMI_MODEL_DATA, SKYWALKER } from '../../src/app/models/character.model';
import {
  MALASTARE_MODEL_DATA,
  MUSTAFAR_MODEL_DATA,
  NAL_HUTTA_MODEL_DATA,
  TATOOINE_MODEL_DATA,
  UTAPAU_MODEL_DATA
} from '../../src/app/models/planet.model';
import { SEARCH_TYPE_DATA } from '../../src/app/models/search-type.model';
import { SwapiResponseModel } from '../../src/app/models/swapi.model';
import { environment } from '../../src/environments/environment';
import { TAG } from '../data/Tag';
import { SearchPage } from '../pages/search.page';

test.describe('Star Wars Search Page Tests', { tag: '@search-page' }, () => {
  let searchPage: SearchPage;
  const characters = [{ properties: LUKE_MODEL_DATA }, { properties: ANAKIN_MODEL_DATA }, { properties: SHMI_MODEL_DATA }];
  const planets = [
    { properties: TATOOINE_MODEL_DATA },
    { properties: UTAPAU_MODEL_DATA },
    { properties: MUSTAFAR_MODEL_DATA },
    { properties: NAL_HUTTA_MODEL_DATA },
    { properties: MALASTARE_MODEL_DATA }
  ];

  test.beforeEach('Mock SWAPI responses and navigate to search page', async ({ page }) => {
    await page.route(`${environment.swapiBaseUrl}/**`, async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('name')?.toLowerCase() || '';
      const isPeoplePath = url.pathname.includes(`/${SEARCH_TYPE_DATA.PEOPLE}`);
      const isPlanetsPath = url.pathname.includes(`/${SEARCH_TYPE_DATA.PLANETS}`);
      let responseBody: SwapiResponseModel = { result: [] };
      if (isPeoplePath) {
        responseBody.result = characters.filter((person) => person.properties.name.toLowerCase().includes(query));
      } else if (isPlanetsPath) {
        responseBody.result = planets.filter((planet) => planet.properties.name.toLowerCase().includes(query));
      }
      await route.fulfill({ status: StatusCodes.OK, contentType: 'application/json', body: JSON.stringify(responseBody) });
    });
    searchPage = new SearchPage(page);
    await searchPage.navigate();
  });

  test('Should find single character', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION] }, async () => {
    const query = 'kE Sk';
    await searchPage.performSearch(query);
    await expect(searchPage.cardsLocator, 'Should only one character card be visible').toBeVisible();
    await expect(searchPage.cardSubtitleLocator(), 'Should character card subtitle have the given expected text').toHaveText(
      LUKE_MODEL_DATA.name
    );
    await expect(searchPage.page, 'Should search page have the given expected url').toHaveURL(
      `/?searchType=${SEARCH_TYPE_DATA.PEOPLE}&query=${query}`
    );
  });

  test('Should find single planet', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION] }, async () => {
    const query = 'TatoO';
    await searchPage.performSearch(query, SEARCH_TYPE_DATA.PLANETS);
    await expect(searchPage.cardsLocator, 'Should only one planet card be visible').toBeVisible();
    await expect(searchPage.cardSubtitleLocator(), 'Should planet card subtitle have the given expected text').toHaveText('Tatooine');
    await expect(searchPage.page, 'Should search page have the given expected url').toHaveURL(
      `/?searchType=${SEARCH_TYPE_DATA.PLANETS}&query=${query}`
    );
  });

  test('Should find multiple characters', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION, TAG.VISUAL] }, async () => {
    await searchPage.performSearch(SKYWALKER);
    await expect(searchPage.cardsLocator, 'Should find multiple character cards').toHaveCount(characters.length);
    await expect(searchPage.defaultLocator, 'Should search page display multiple characters').toHaveScreenshot(
      'search-page-multiple-character-cards.png'
    );
  });

  test('Should find multiple planets', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION, TAG.VISUAL] }, async () => {
    await searchPage.performSearch('ta', SEARCH_TYPE_DATA.PLANETS);
    await expect(searchPage.cardsLocator, 'Should find multiple planet cards').toHaveCount(planets.length);
    await expect(searchPage.defaultLocator, 'Should search page display multiple planets').toHaveScreenshot(
      'search-page-multiple-planet-cards.png'
    );
  });

  test('Should display not found message for invalid by type data', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION, TAG.VISUAL] }, async () => {
    await searchPage.performSearch(TATOOINE_MODEL_DATA.name);
    await expect(searchPage.defaultLocator, 'Should search page by people display not found message').toHaveScreenshot(
      'search-page-people-not-found.png'
    );
    await searchPage.performSearch(LUKE_MODEL_DATA.name, SEARCH_TYPE_DATA.PLANETS);
    await expect(searchPage.defaultLocator, 'Should search page by planets display not found message').toHaveScreenshot(
      'search-page-planets-not-found.png'
    );
  });

  test('Should clear previous search results when searching with empty input', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION] }, async () => {
    await searchPage.performSearch(LUKE_MODEL_DATA.name);
    await searchPage.performSearch('');
    await expect(searchPage.cardsLocator, 'Should be no cards').toHaveCount(0);
    await expect(searchPage.page, 'Should search page have the given expected url').toHaveURL(
      `/?searchType=${SEARCH_TYPE_DATA.PEOPLE}&query=`
    );
  });

  test('Should trigger search by pressing Enter key', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION, TAG.A11Y] }, async ({ page }) => {
    await searchPage.fillSearch(ANAKIN_MODEL_DATA.name);
    await page.keyboard.press('Enter');
    await expect(searchPage.cardsLocator, 'Should display only one people card').toBeVisible();
    await expect(searchPage.cardSubtitleLocator(), 'Should people card subtitle have the given expected text').toHaveText(
      ANAKIN_MODEL_DATA.name
    );
  });

  test(
    'Should display search page initial state',
    { tag: [TAG.FUNCTIONAL, TAG.REGRESSION, TAG.VISUAL] },
    async () =>
      await expect(searchPage.defaultLocator, 'Should display search page initial state').toHaveScreenshot('search-page-initial-state.png')
  );

  test('Should display search form focus for tabed elements', { tag: [TAG.FUNCTIONAL, TAG.REGRESSION, TAG.VISUAL] }, async ({ page }) => {
    await searchPage.fillSearch('abc');
    await searchPage.searchFormLocator.click();
    await page.keyboard.press('Tab');
    await expect(searchPage.searchFormLocator, 'Should display search form focus on radio people').toHaveScreenshot(
      'search-page-focus-radio-people.png'
    );
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(searchPage.searchFormLocator, 'Should display search form focus on radio planets').toHaveScreenshot(
      'search-page-focus-radio-planets.png'
    );
    await page.keyboard.press('Tab');
    await expect(searchPage.searchFormLocator, 'Should display search form focus on query input').toHaveScreenshot(
      'search-page-focus-query-input.png'
    );
    await page.keyboard.press('Tab');
    await expect(searchPage.searchFormLocator, 'Should display search form focus on search button').toHaveScreenshot(
      'search-page-focus-search-button.png'
    );
  });

  test.fixme('Should have no accessibility violations', { tag: [TAG.REGRESSION, TAG.A11Y] }, async ({ page }) => {
    test.fixme(
      true,
      'A comprehensive accessibility audit and baseline definition are required before enabling this test in the regression suite'
    );
    await searchPage.performSearch(SKYWALKER);
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
