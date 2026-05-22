import { test, expect } from '../../framework/fixtures/test.fixture';

test.describe('Employee search', () => {
  test.beforeEach(async ({ loginPage, credentials, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(credentials.validUsername, credentials.validPassword);
    await dashboardPage.verifyLoaded();
  });

  test('search by employee id returns matching results', async ({
    employeeListPage,
  }) => {
    await employeeListPage.open();

    const employeeId = await employeeListPage.getFirstEmployeeId();
    const countBefore = await employeeListPage.getRecordsFoundCount();

    await employeeListPage.searchByEmployeeId(employeeId);

    expect(await employeeListPage.hasResults()).toBe(true);
    expect(await employeeListPage.resultsContain(employeeId)).toBe(true);
    expect(await employeeListPage.getRecordsFoundCount()).toBeLessThanOrEqual(
      countBefore
    );
  });

  test('search by employee name returns matching results', async ({
    employeeListPage,
  }) => {
    await employeeListPage.open();

    const searchTerm = await employeeListPage.getFirstEmployeeFirstName();
    const countBefore = await employeeListPage.getRecordsFoundCount();

    await employeeListPage.searchByEmployeeName(searchTerm);

    expect(await employeeListPage.hasResults()).toBe(true);
    expect(await employeeListPage.resultsContain(searchTerm)).toBe(true);
    expect(await employeeListPage.getRecordsFoundCount()).toBeLessThanOrEqual(
      countBefore
    );
  });
});
