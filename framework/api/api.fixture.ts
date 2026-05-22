import { test as base } from '@playwright/test';
import { createReqResApi, ReqResApiService } from './reqres-api';

type ApiFixtures = {
  api: ReqResApiService;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(createReqResApi(request));
  },
});

export { expect } from '@playwright/test';
