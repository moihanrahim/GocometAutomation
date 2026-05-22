import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { EmployeeListPage } from '../pages/employee-list.page';
import { env } from '../utils/env';

type FrameworkFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  credentials: { validUsername: string; validPassword: string };
};

export const test = base.extend<FrameworkFixtures>({
  credentials: async ({}, use) => {
    await use({
      validUsername: env.adminUsername,
      validPassword: env.adminPassword,
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
