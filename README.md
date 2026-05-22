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

## Test coverage

| Area | Scenarios |
|------|-----------|
| Auth | Valid login → dashboard; invalid login → error |
| Search | Filter by employee ID; filter by employee name |

Demo credentials: `Admin` / `admin123`

## CI

Tests run automatically on push and pull requests. See [docs/ci.md](docs/ci.md).
