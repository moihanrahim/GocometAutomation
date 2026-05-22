import { test, expect } from '../../framework/fixtures/test.fixture';

test.describe('Employee search', () => {
  test.beforeEach(async ({ loginPage, dashboardPage, employeeListPage, credentials }) => {
    await loginPage.open();
    await loginPage.login(credentials.validUsername, credentials.validPassword);
    await dashboardPage.verifyLoaded();
    await dashboardPage.openPimEmployeeList();
    await employeeListPage.verifyLoaded();
  });

  test('search by employee id returns matching results', async ({
    employeeListPage,
  }) => {
    const sampleId = await employeeListPage.getFirstEmployeeId();
    await employeeListPage.searchByEmployeeId(sampleId);
    expect(await employeeListPage.getRecordsFoundCount()).toBeGreaterThan(0);
    expect(await employeeListPage.resultsContain(sampleId)).toBe(true);
  });

  test('search with unknown id shows no records', async ({ employeeListPage }) => {
    await employeeListPage.searchByEmployeeId('999999');
    expect(await employeeListPage.getVisibleRowCount()).toBe(0);
  });
});
