import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  protected async expectVisible(locator: ReturnType<Page['locator']>): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
