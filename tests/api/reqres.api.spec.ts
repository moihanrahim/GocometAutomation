import path from 'path';
import { test, expect } from '../../framework/api/api.fixture';
import { ReqResApiService, ResponseBody } from '../../framework/api';

const catalog = ReqResApiService.loadCatalog(path.join(__dirname, 'endpoints.yml'));
const ep = catalog.endpoints;

// --- Non-parameterized ---

test('TC01 — List product records (GET)', async ({ api }) => {
  const { body } = await api.invoke(ep.listProductRecords, { testName: 'TC01' });
  expect(body).not.toBeNull();
  expect((body!.meta as ResponseBody).page).toBe(1);
  expect(body!.data).toBeTruthy();
  expect((body!.data as unknown[]).length).toBeGreaterThan(0);
});

test('TC02 — Get product record by id (GET)', async ({ api }) => {
  const { body } = await api.invoke(ep.getProductRecord, { testName: 'TC02' });
  const record = body!.data as ResponseBody;
  const fields = record.data as ResponseBody;
  expect(fields.name).toBe('Wireless Headphones');
  expect(fields.price as number).toBeGreaterThan(0);
  expect(record.id).toBeTruthy();
});

test('TC03 — App user login (POST)', async ({ api }) => {
  const { body } = await api.invoke(ep.appUserLogin, { testName: 'TC03' });
  expect((body!.data as ResponseBody).sent).toBe(true);
});

test('TC04 — Update user job (PATCH)', async ({ api }) => {
  const { body } = await api.invoke(ep.updateUserJob, { testName: 'TC04' });
  expect(body!.job).toBe(ep.updateUserJob.payload?.job);
});

test('TC05 — Delete user (DELETE)', async ({ api }) => {
  const { response } = await api.invoke(ep.deleteUser, { testName: 'TC05' });
  expect(response.status()).toBe(204);
});

// --- Parameterized ---

for (const userId of catalog.parameters.userIds ?? []) {
  test(`TC06 — Get user by id (GET, userId=${userId})`, async ({ api }) => {
    const resolvedPath = ReqResApiService.resolvePath(ep.getUserById.path, { userId });
    const { body } = await api.invoke(ep.getUserById, {
      path: resolvedPath,
      testName: `TC06 userId=${userId}`,
    });
    const user = body!.data as ResponseBody;
    expect(user.id).toBe(userId);
    expect(user.email as string).toContain('@');
  });
}
