# CI

## Jenkins — ReqRes API key

`Jenkinsfile` currently sets **`REQRES_PUBLIC_KEY`** in the `environment` block (hardcoded for demo).

Before making the GitHub repo **public**, switch to a Jenkins **Secret text** credential (`reqres-public-key`) and remove the key from `Jenkinsfile`.

---

## Pipeline stages

| Stage | Command |
|-------|---------|
| API Tests | `npm run test:api` |
| UI Tests | `npm run test:ui` |

## GitHub Actions

Secret: **`REQRES_PUBLIC_KEY`** in repo Settings → Secrets.

## Local

```bash
cp .env.example .env
# set REQRES_PUBLIC_KEY=pub_...
npm test
```
