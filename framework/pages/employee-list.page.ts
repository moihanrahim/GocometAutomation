import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class EmployeeListPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableRows: Locator;
  readonly recordCount: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameInput = page.getByPlaceholder('Type for hints...').first();
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-card');
    this.recordCount = page.getByText(/\(\d+\) Records? Found/i);
  }

  async open(): Promise<void> {
    await this.goto(this.path);
    await this.searchButton.waitFor({ state: 'visible' });
  }

  async getRecordsFoundCount(): Promise<number> {
    const text = (await this.recordCount.textContent()) ?? '';
    const match = text.match(/\((\d+)\)/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  async getFirstEmployeeId(): Promise<string> {
    const idCell = this.tableRows.first().locator('.oxd-table-cell').nth(1);
    return (await idCell.innerText()).trim();
  }

  async getFirstEmployeeFirstName(): Promise<string> {
    const nameCell = this.tableRows.first().locator('.oxd-table-cell').nth(2);
    const name = (await nameCell.innerText()).trim();
    return name.split(/\s+/)[0];
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.resetButton.click();
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
    await this.recordCount.waitFor({ state: 'visible' });
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.resetButton.click();
    await this.employeeNameInput.fill(name);

    const suggestion = this.page.locator('.oxd-autocomplete-option').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
    }

    await this.searchButton.click();
    await this.recordCount.waitFor({ state: 'visible' });
  }

  async resultsContain(text: string): Promise<boolean> {
    return (await this.tableRows.filter({ hasText: new RegExp(text, 'i') }).count()) > 0;
  }

  async hasResults(): Promise<boolean> {
    return (await this.tableRows.count()) > 0;
  }
}
