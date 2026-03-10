import test, { Page } from '@playwright/test';
import { SEARCH_TYPE_DATA, SearchType } from '../../src/app/models/search-type.model';

export class SearchPage {
  readonly defaultLocator = this.page.locator('.container');
  readonly searchFormLocator = this.defaultLocator.locator('app-search-form');
  readonly cardsLocator = this.searchFormLocator.locator(':scope ~ * .card-body');
  readonly cardSubtitleLocator = (number: number = 1) => this.cardsLocator.nth(number - 1).locator('.card-subtitle');
  private readonly queryInputLocator = this.searchFormLocator.locator('#query');
  private readonly searchButtonLocator = this.searchFormLocator.locator('button[type="submit"]');
  private readonly typeRadioLocator = (type: SearchType) => this.searchFormLocator.locator(`#${type}`);
  private readonly loadingIndicatorLocator = this.defaultLocator.getByText('Loading...');

  constructor(readonly page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async fillSearch(query: string, type: SearchType = SEARCH_TYPE_DATA.PEOPLE) {
    await test.step(`Select search radio type "${type}" and fill input query "${query}"`, async () => {
      await this.typeRadioLocator(type).check();
      await this.queryInputLocator.fill(query);
    });
  }

  async performSearch(query: string, type: SearchType = SEARCH_TYPE_DATA.PEOPLE) {
    await test.step(`Perform search with query "${query}" by type "${type}"`, async () => {
      await this.fillSearch(query, type);
      await this.searchButtonLocator.click();
      await this.waitForLoadingToFinish();
    });
  }

  async waitForLoadingToFinish() {
    await this.loadingIndicatorLocator.waitFor({ state: 'hidden' });
  }
}
