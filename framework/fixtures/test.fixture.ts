import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { EmployeeListPage } from '../pages/employee-list.page';
import { uiEnv } from '../utils/env';

type UiFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  credentials: {
    validUsername: string;
    validPassword: string;
    invalidPassword: string;
  };
};

export const test = base.extend<UiFixtures>({
  credentials: async ({}, use) => {
    await use({
      validUsername: uiEnv.username,
      validPassword: uiEnv.password,
      invalidPassword: 'wrong-password',
    });
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
});

export { expect } from '@playwright/test';
