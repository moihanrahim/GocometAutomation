import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { expect } from '@playwright/test';

export class DashboardPage extends BasePage {
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await this.breadcrumb.waitFor({ state: 'visible' });
  }

  async getBreadcrumbText(): Promise<string> {
    return (await this.breadcrumb.innerText()).trim();
  }

  async openPimEmployeeList(): Promise<void> {
    await this.page.locator('a').filter({ hasText: 'PIM' }).click();
    await this.page.locator('a').filter({ hasText: 'Employee List' }).click();
    await this.page.waitForURL(/viewEmployeeList/);
  }
}
