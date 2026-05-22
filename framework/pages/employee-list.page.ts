import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class EmployeeListPage extends BasePage {
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly recordCount: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name' })
      .locator('input');
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.recordCount = page.getByText(/\(\d+\)\s+Records? Found/i);
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  async verifyLoaded(): Promise<void> {
    await this.searchButton.waitFor({ state: 'visible' });
  }

  async searchByEmployeeId(id: string): Promise<void> {
    await this.employeeIdInput.fill(id);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getVisibleRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getRecordsFoundCount(): Promise<number> {
    const text = (await this.recordCount.textContent()) ?? '';
    const match = text.match(/\((\d+)\)\s+Records? Found/i);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  async getFirstEmployeeId(): Promise<string> {
    const idCell = this.tableRows.first().locator('.oxd-table-cell').nth(1);
    await idCell.waitFor({ state: 'visible' });
    return (await idCell.innerText()).trim();
  }

  async resultsContain(text: string): Promise<boolean> {
    const row = this.tableRows.filter({ hasText: text }).first();
    return row.isVisible();
  }
}
