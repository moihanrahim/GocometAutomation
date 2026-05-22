# CI

## GitHub Actions

[`.github/workflows/ui-tests.yml`](../.github/workflows/ui-tests.yml)

## Jenkins

| File | When to use |
|------|-------------|
| [`Jenkinsfile`](../Jenkinsfile) | Default — `agent any` (no Docker plugin required) |
| [`jenkins-docker.groovy`](jenkins-docker.groovy) | Only if **Docker Pipeline** plugin is installed |
| [`jenkins-pipeline.groovy`](jenkins-pipeline.groovy) | Same as root Jenkinsfile with `tools { nodejs 'NodeJS-20' }` |

### Prerequisites on the Jenkins agent

- **Node.js 20+** and **npm** on `PATH`
- **Git** for checkout

Windows agents use `bat`; Linux agents use `sh` (handled automatically).

### Job configuration

1. Pipeline → **Pipeline script from SCM**
2. Repository: `https://github.com/moihanrahim/GocometAutomation.git`
3. **Script Path:** `Jenkinsfile`
