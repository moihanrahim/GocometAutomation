import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page, 'LoginPage');
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.locator('.oxd-alert-content-text');
  }

  async open(): Promise<void> {
    await this.goto(this.path);
    await this.runStep('wait for login form', () =>
      this.loginButton.waitFor({ state: 'visible' })
    );
  }

  async login(username: string, password: string): Promise<void> {
    await this.runStep(`login as ${username}`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }

  async getErrorMessage(): Promise<string> {
    return this.runStep('read login error message', async () => {
      await this.errorAlert.waitFor({ state: 'visible', timeout: 10_000 });
      const message = ((await this.errorAlert.textContent()) ?? '').trim();
      logger.warn(`Login error displayed: ${message}`);
      return message;
    });
  }
}
