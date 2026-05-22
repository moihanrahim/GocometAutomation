# API Framework

Enterprise-style layout: one service module, one public barrel, fixture injection.

## Layout

```
framework/api/
├── index.ts           Public exports (import from here)
├── reqres-api.ts        Config, catalog, ReqResApiService, errors
└── api.fixture.ts       Playwright fixture: { api }

tests/api/
├── endpoints.yml        Paths, methods, payloads, expected status
└── reqres.api.spec.ts   Tests + assertions
```

## Usage in specs

```typescript
import { test, expect } from '../../framework/api/api.fixture';
import { ReqResApiService } from '../../framework/api';

const catalog = ReqResApiService.loadCatalog(path.join(__dirname, 'endpoints.yml'));
const ep = catalog.endpoints;

test('TC01 — List products', async ({ api }) => {
  const { body } = await api.invoke(ep.listProductRecords, { testName: 'TC01' });
  expect(body.meta.page).toBe(1);
});
```

## ReqResApiService

| Method | Purpose |
|--------|---------|
| `static loadCatalog(path)` | Load `endpoints.yml` |
| `static resolvePath(template, params)` | Replace `{userId}` placeholders |
| `invoke(endpoint, options?)` | HTTP call + status check + logging |

## Run

```bash
npm run test:api
```
