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
    await loginPage.login(credentials.validUsername, credentials.validPassword);
    await dashboardPage.verifyLoaded();
    await expect(page).toHaveURL(/dashboard/);
    expect((await dashboardPage.getBreadcrumbText()).toLowerCase()).toContain(
      'dashboard'
    );
  });

  test('login with invalid credentials shows error message', async ({
    loginPage,
    credentials,
  }) => {
    await loginPage.login(credentials.validUsername, credentials.invalidPassword);
    const error = await loginPage.getErrorMessage();
    expect(error.toLowerCase()).toContain('invalid');
  });
});
