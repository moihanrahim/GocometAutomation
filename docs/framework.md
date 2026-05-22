# Framework

## Layout

- `framework/pages/` — page objects (`LoginPage`, `DashboardPage`, `EmployeeListPage`)
- `framework/fixtures/` — Playwright fixtures wiring page objects and credentials
- `framework/utils/env.ts` — environment configuration

## Usage

```typescript
import { test, expect } from '../../framework/fixtures/test.fixture';

test('example', async ({ loginPage, credentials, dashboardPage }) => {
  await loginPage.open();
  await loginPage.login(credentials.validUsername, credentials.validPassword);
  await dashboardPage.verifyLoaded();
});
```

## Configuration

| Variable | Default |
|----------|---------|
| `BASE_URL` | `https://opensource-demo.orangehrmlive.com` |
| `ADMIN_USERNAME` | `Admin` |
| `ADMIN_PASSWORD` | `admin123` |
