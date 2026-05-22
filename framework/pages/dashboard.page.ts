import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly sideMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb');
    this.sideMenu = page.locator('.oxd-sidepanel');
  }

  async verifyLoaded(): Promise<void> {
    await this.page.waitForURL(/dashboard/);
    await this.expectVisible(this.dashboardHeader, 'Dashboard header');
    await this.expectVisible(this.sideMenu, 'Side menu');
  }

  async getBreadcrumbText(): Promise<string> {
    return (await this.dashboardHeader.textContent()) ?? '';
  }
}
