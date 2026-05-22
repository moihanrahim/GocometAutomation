# Gocomet Automation

Playwright + TypeScript — **API** (ReqRes) and **UI** (OrangeHRM).

## Run locally

```bash
npm install
npx playwright install chromium
cp .env.example .env   # REQRES_PUBLIC_KEY + optional UI overrides
```

| Command | Suite |
|---------|--------|
| `npm test` | API + UI (all projects) |
| `npm run test:api` | ReqRes API only |
| `npm run test:ui` | OrangeHRM UI only |
| `npm run test:auth` | Login tests |
| `npm run test:search` | Employee search |

## Allure report

Every test run writes raw results to `allure-results/`. Build the HTML report and open it in the browser:

```bash
npm test                    # or test:api / test:ui
npm run allure:serve        # generate + open (one step)
# or:
npm run allure:generate
npm run allure:open
```

Screenshots, traces, and videos from Playwright failures are attached automatically. CI and Jenkins archive `allure-report/` after `npm run allure:generate`.

## Structure

```
tests/api/          ReqRes — endpoints.yml + reqres.api.spec.ts
tests/auth/         UI login
tests/search/       UI employee search
framework/api/      API service layer
framework/pages/    UI page objects
framework/fixtures/ UI Playwright fixtures
```

## CI

- **GitHub Actions:** `npm test` (both suites)
- **Jenkins:** `API Tests` then `UI Tests` stages

See [ci/README.md](ci/README.md).
