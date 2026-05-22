# CI

## GitHub Actions

[`.github/workflows/ui-tests.yml`](../.github/workflows/ui-tests.yml)

## Jenkins

| File | Use when |
|------|----------|
| [`Jenkinsfile`](../Jenkinsfile) | Docker agent with Playwright image |
| [`jenkins-pipeline.groovy`](jenkins-pipeline.groovy) | Agent with Node.js 20 tool |

Configure a Pipeline job with **Script Path** = `Jenkinsfile`.
