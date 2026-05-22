import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class EmployeeListPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableRows: Locator;
  readonly recordCount: Locator;

  constructor(page: Page) {
    super(page, 'EmployeeListPage');
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
    await this.runStep('wait for search form', () =>
      this.searchButton.waitFor({ state: 'visible' })
    );
  }

  async getRecordsFoundCount(): Promise<number> {
    return this.runStep('read result count', async () => {
      const text = (await this.recordCount.textContent()) ?? '';
      const match = text.match(/\((\d+)\)/);
      return match ? Number.parseInt(match[1], 10) : 0;
    });
  }

  async getFirstEmployeeId(): Promise<string> {
    return this.runStep('read first employee id', async () => {
      const idCell = this.tableRows.first().locator('.oxd-table-cell').nth(1);
      return (await idCell.innerText()).trim();
    });
  }

  async getFirstEmployeeFirstName(): Promise<string> {
    return this.runStep('read first employee name', async () => {
      const nameCell = this.tableRows.first().locator('.oxd-table-cell').nth(2);
      const name = (await nameCell.innerText()).trim();
      return name.split(/\s+/)[0];
    });
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.runStep(`search by id: ${employeeId}`, async () => {
      await this.resetButton.click();
      await this.employeeIdInput.fill(employeeId);
      await this.searchButton.click();
      await this.recordCount.waitFor({ state: 'visible' });
    });
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.runStep(`search by name: ${name}`, async () => {
      await this.resetButton.click();
      await this.employeeNameInput.fill(name);

      const suggestion = this.page.locator('.oxd-autocomplete-option').first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      } else {
        logger.warn('No autocomplete suggestion; continuing with typed name');
      }

      await this.searchButton.click();
      await this.recordCount.waitFor({ state: 'visible' });
    });
  }

  async resultsContain(text: string): Promise<boolean> {
    return this.runStep(`check results contain "${text}"`, async () => {
      return (await this.tableRows.filter({ hasText: new RegExp(text, 'i') }).count()) > 0;
    });
  }

  async hasResults(): Promise<boolean> {
    return this.runStep('check table has rows', async () => {
      return (await this.tableRows.count()) > 0;
    });
  }
}
