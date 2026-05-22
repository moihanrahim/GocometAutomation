import { test, expect } from '../../framework/fixtures/test.fixture';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('login with valid credentials shows dashboard', async ({
    loginPage,
    dashboardPage,
    credentials,
    page,
  }) => {
    await loginPage.login(
      credentials.validUsername,
      credentials.validPassword
    );

    await dashboardPage.verifyLoaded();
    await expect(page).toHaveURL(/dashboard/);

    const breadcrumb = await dashboardPage.getBreadcrumbText();
    expect(breadcrumb.toLowerCase()).toContain('dashboard');
  });

  test('login with invalid credentials shows error message', async ({
    loginPage,
  }) => {
    await loginPage.login('InvalidUser', 'wrong-password');

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toMatch(/invalid/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
