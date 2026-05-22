# Framework

## Layout

```
framework/
├── fixtures/       Playwright fixtures and test lifecycle hooks
├── pages/          Page objects (POM)
└── utils/
    ├── env.ts      Environment variables
    ├── logger.ts   Structured console logging
    └── errors.ts   AutomationError for failed steps
```

## Logging

`framework/utils/logger.ts` writes timestamped messages:

- `INFO` — test start/end
- `STEP` — page object actions (`LoginPage → login as Admin`)
- `WARN` — recoverable conditions (e.g. missing autocomplete)
- `ERROR` — failures with stack/cause

Set `LOG_LEVEL` is not required; all levels are emitted during local and CI runs. Playwright `list` reporter still prints pass/fail summary.

## Error handling

1. **Step wrapper** — `BasePage.runStep()` logs each action and wraps failures in `AutomationError` with page name and step context.
2. **Playwright timeouts** — global `timeout` / `expect.timeout` in `playwright.config.ts`.
3. **CI retries** — `retries: 2` when `CI=true`.
4. **Failure artifacts** — screenshot, video, and trace (on retry) attached under `test-results/`.
5. **Application errors** — `LoginPage.getErrorMessage()` for invalid-login scenarios.

Example error:

```
AutomationError: [LoginPage] login as Admin failed: Timeout 15000ms exceeded
```

## Reporting

Configured in `playwright.config.ts`:

| Reporter | Output |
|----------|--------|
| `list` | Terminal summary |
| `html` | `playwright-report/` — open with `npm run report` |
| `junit` | `test-results/junit.xml` — used in GitHub Actions |

CI uploads HTML and JUnit artifacts and publishes results via `dorny/test-reporter`.

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
