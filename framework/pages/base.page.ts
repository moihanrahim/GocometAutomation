import { Locator, Page, expect } from '@playwright/test';
import { AutomationError } from '../utils/errors';
import { logger } from '../utils/logger';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly pageName: string
  ) {}

  protected async runStep<T>(step: string, action: () => Promise<T>): Promise<T> {
    logger.step(this.pageName, step);
    try {
      return await action();
    } catch (error) {
      logger.error(`${this.pageName}: ${step}`, error);
      throw AutomationError.from(step, this.pageName, error);
    }
  }

  protected async goto(path: string): Promise<void> {
    await this.runStep(`open ${path}`, () => this.page.goto(path));
  }

  protected async expectVisible(locator: Locator, message: string): Promise<void> {
    await this.runStep(`assert visible: ${message}`, () =>
      expect(locator, message).toBeVisible()
    );
  }
}
