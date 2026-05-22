# CI

## Jenkins — ReqRes API key

`Jenkinsfile` currently sets **`REQRES_PUBLIC_KEY`** in the `environment` block (hardcoded for demo).

Before making the GitHub repo **public**, switch to a Jenkins **Secret text** credential (`reqres-public-key`) and remove the key from `Jenkinsfile`.

---

## Pipeline stages

| Stage | Command | On failure |
|-------|---------|------------|
| API Tests | `npm run test:api` | Marks build **UNSTABLE**, continues |
| UI Tests | `npm run test:ui` | Marks build **UNSTABLE** |

**Post (always):** JUnit `test-results/junit-*.xml`, Playwright HTML `playwright-report/`, and Allure `allure-report/` (generated from `allure-results/`).

| Report | Where |
|--------|--------|
| Playwright HTML | `playwright-report/api/index.html`, `playwright-report/ui/index.html` |
| Allure | `allure-report/index.html` (combined API + UI runs) |

Jenkins can also publish via the **Allure Report** plugin pointing at `allure-results/`.

## GitHub Actions

Secret: **`REQRES_PUBLIC_KEY`** in repo Settings → Secrets.

## Local

```bash
cp .env.example .env
# set REQRES_PUBLIC_KEY=pub_...
npm test
```
