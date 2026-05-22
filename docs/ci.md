# CI

GitHub Actions workflow: `.github/workflows/ui-tests.yml`

1. `npm ci`
2. Install Chromium
3. `npm test`
4. Upload `playwright-report/` and `test-results/` artifacts

Download artifacts from the Actions run to view the HTML report locally.
