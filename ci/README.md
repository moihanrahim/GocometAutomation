# CI

## Jenkins failure: `ERROR: reqres-public-key`

That means Jenkins could not find a credential with ID **`reqres-public-key`**. The pipeline no longer loads it at startup (so UI can still run); API Tests bind it only in that stage.

### Fix (pick one)

#### Option A — Jenkins credential (recommended)

1. **Manage Jenkins** → **Credentials** → **System** → **Global credentials (unrestricted)** → **Add Credentials**
2. **Kind:** Secret text
3. **Secret:** your ReqRes public key (`pub_…`)
4. **ID:** `reqres-public-key` (must match exactly)
5. **Description:** ReqRes API public key
6. Save → re-run the job

#### Option B — Job environment variable

1. Open your pipeline job → **Configure**
2. Check **Environment variables** (or inject via Build Environment plugin)
3. Add: `REQRES_PUBLIC_KEY` = `pub_your_key_here`
4. Save → re-run

No credential record needed if you use this option.

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
