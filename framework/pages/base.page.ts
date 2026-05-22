import { Locator, Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  protected async expectVisible(locator: Locator, message: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }
}
