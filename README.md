# Gocomet Automation

Playwright + TypeScript UI tests for [OrangeHRM](https://opensource-demo.orangehrmlive.com/).

## Structure

```
├── framework/          Page objects, fixtures, config
├── tests/              Specs by feature (auth, search)
├── ci/                 CI documentation
├── docs/               Framework and pipeline guides
└── .github/workflows/  GitHub Actions
```

## Setup

Requires Node.js 20+.

```bash
cd GocometAutomation
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` to override credentials (optional).

## Run tests

```bash
npm test                 # headless
npm run test:ui          # Playwright UI (pick & debug tests)
npm run test:headed      # visible browser
npm run test:auth        # login tests only
npm run test:search      # search tests only
npm run report           # open HTML report
```

### Windows: `git` or `npm` not recognized

Git and Node are installed, but a terminal opened before install may not see them. Refresh PATH:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
git --version
npm -v
```

Or use full paths:

```powershell
& "C:\Program Files\Git\cmd\git.exe" status
& "C:\Program Files\nodejs\npm.cmd" test
```

Restart Cursor or open a **new** terminal for a permanent fix.

### Windows: `npm` not recognized

If Node is installed but the terminal says `npm` is not found, refresh PATH (or restart Cursor):

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
npm -v
```

If `npm` is blocked by execution policy, use `npm.cmd`:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" test
```

## Framework features

- **Logging** — step-level logs in page objects; test start/pass/fail in fixtures (`framework/utils/logger.ts`)
- **Reporting** — HTML, JUnit, and console reporters; CI uploads artifacts
- **Error handling** — `AutomationError` with page/step context, Playwright timeouts, failure screenshots/video/trace

See [docs/framework.md](docs/framework.md).

## Test coverage

| Area | Scenarios |
|------|-----------|
| Auth | Valid login → dashboard; invalid login → error |
| Search | Filter by employee ID; filter by employee name |

Demo credentials: `Admin` / `admin123`

## CI

Tests run automatically on push and pull requests. See [docs/ci.md](docs/ci.md).
