# Team MEA — Travel & Meetings Planner

A Databricks App that replaces the MEA field team's shared Excel travel/meeting
calendar. Plan multi-person trips, schedule meetings on a time-proportional grid,
track accounts and their consumption, build demand plans, and manage PTO — all
backed by Unity Catalog Delta tables and Databricks App SSO.

## Stack

- **Frontend:** React (Vite) SPA in `frontend/`.
- **Backend:** FastAPI (`app.py` + `server/`), JSON API under `/api`, SPA served for
  everything else.
- **Data:** Unity Catalog Delta tables, queried via `databricks-sql-connector`
  (SDK unified auth). Signed-in identity comes from the `X-Forwarded-Email` header.
- **Hosting:** Databricks Apps.

## Features

- **Trips** — create trips, add/remove/reorder members, per-region (BU3) theming
  and icons (Africa-Qatar / UAE).
- **Team view** — time-proportional daily grid, members as columns, status colors,
  per-day city strip, collapsible empty time ranges, per-trip column selection.
- **My view** — personal weekly calendar for the signed-in user, click-to-create.
- **Meetings** — flexible start/end, multi-attendee (appears in every attendee's
  column), status (Confirmed / Awaiting / Travel / Dinner / Off / City),
  double-booking conflict validation, account-name combobox linking a meeting to
  an account.
- **Accounts** — account book with BU3 / SA / AE filters and search; per-account
  detail page with sub-tabs: **Analytics** (DBU $ trends, product mix, platform
  split), **Use cases**, **Demand plan** (36-month consumption plan grid with Excel
  export), and **Architecture**. Account priority is editable.
- **Links** — read-only view of the shared Link Catalog (`mea_links_catalog`).
- **PTO** — rolling 26-week grid; each user edits only their own row.
- **Team directory** — editable users table, merged with AE/SA people sourced from
  the accounts table.
- **Feedback**, **About / version history**, light/dark theme, optimistic UI with
  toasts, and an append-only audit log.

## Project layout

```
app.py                    FastAPI entry point (API + SPA + /static + /assets)
app.yaml                  Databricks App config + env (schema, warehouse, tables)
server/
  api.py                  All /api routes
  db.py                   Warehouse connection (thread-local reuse) + query helpers
db/schema.sql             Reference DDL for all Delta tables
frontend/
  src/                    React source (views/, components/)
  dist/                   Built SPA (deployed; not gitignored)
static/                   Link Catalog tile icons served at /static
```

## Configuration (`app.yaml` env)

| Var | Purpose |
|-----|---------|
| `APP_SCHEMA` | UC schema backing the app (e.g. `adb_fe_uae_01.mea_travel_planner`) |
| `DATABRICKS_HTTP_PATH` | SQL warehouse HTTP path for all queries |
| `ACCOUNTS_TABLE` / `ACCOUNTS_USAGE_TABLE` | Account details + per-product monthly usage sources |
| `ACCOUNTS_DBU_COLUMNS` | JSON `[{key,label}]` describing the DBU columns to show |
| `LINKS_TABLE` | Shared Link Catalog table backing the read-only Links tab |

## Build & deploy

The built SPA in `frontend/dist` is what gets served, so **build first**:

```bash
cd frontend && npm install && npm run build && cd ..

# Sync source to the workspace (respects .gitignore, so node_modules/.venv/.git are skipped)
databricks sync . /Workspace/Users/<you>/travel-planner --profile feuae

# Tell the platform to serve it
databricks apps deploy travel-planner \
  --source-code-path /Workspace/Users/<you>/travel-planner --profile feuae
```

`databricks sync` does **not** take `--format` (that flag belongs to
`databricks workspace import`).

## Design reference

See [`PLAN.md`](PLAN.md) for the original MVP design and the "What actually shipped"
appendix describing how the app grew beyond it.
