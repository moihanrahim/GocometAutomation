# CI

## GitHub Actions

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs **both** suites in one job:

- `npm test` → Playwright projects **`api`** + **`chromium`** (UI)

Secrets: **`REQRES_PUBLIC_KEY`** (`pub_*` key).

## Jenkins

[`Jenkinsfile`](../Jenkinsfile):

| Stage | Command | Suite |
|-------|---------|--------|
| API Tests | `npm run test:api` | ReqRes (`tests/api/`) |
| UI Tests | `npm run test:ui` | OrangeHRM (`tests/auth/`, `tests/search/`) |

### Credential (one-time)

1. Jenkins → **Credentials** → **Secret text**
2. **ID:** `reqres-public-key`
3. **Secret:** your `pub_*` ReqRes key

UI uses `ADMIN_USERNAME` / `ADMIN_PASSWORD` from the pipeline (demo: `Admin` / `admin123`).

### Artifacts

JUnit: `test-results/junit.xml` · HTML: `playwright-report/`
