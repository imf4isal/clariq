## Project Brief

A lightweight, open-source analytics platform that starts with the essentials — connect to a live database, run SQL queries, and see results. From day one, it includes a modular alert/notification system so even without the full UI, teams can get value (e.g., threshold alerts, daily digests). The product will grow in phases: Proof of Concept, Phase 0 (basic UI), Phase 1 (MVP solid features), and NEXT (advanced capabilities), so people can use parts of it while we build the rest.

Also, from development side - the building process should be in such way that, it’s scalable, easily maintainable. 

## Proof of Concept (POC)

- Connect to a live database (start with Postgres).
- Everything in terminal / local.
- Run SQL queries or stored procedures.
- Return results as bare-bones JSON or similar format.
- No UI/frontend at this stage — purely backend validation.
- Parameter binding supported at the engine level (positional $1, $2) for safety; values come from config/env.
- Include a minimal alert/notification system (Higly Modular):
    - Runs queries/procedures on a schedule.Runs queries/procedures on a schedule.
    - Rules: any_rows, threshold, always (digest).Rules: any_rows, threshold, always (digest).
    - Notify via Slack webhook or email (config-driven).Notify via Slack webhook or email (config-driven).
    - Config via YAML/JSON; Docker and CLI usable standalone.
    - Read-only DB role for safety.
    - The alert system will be super modular - may be - a docker image or something.

**Acceptance:** Able to run a query against Postgres, see JSON output, and trigger one Slack/email alert based on a simple rule.

## Phase 0

- Implement basic frontend to connect to one DB.
- Connect with DB with necessary credentials.
- Simple SQL editor (raw SQL, no builder yet).
- Execute query and show result as a table (sortable, infinite scroll).
- Manual "Reset Session" button: resets DB pool, clears editor/results/state.
- Error handling for bad SQL, timeout, DB connection loss.

**Acceptance:** Connect → run query → see table in UI; reset works; errors recover without page refresh.

## Phase 1 (MVP – Version 1)

- Save queries as Insights (name + SQL + default view type).
- Organize insights into folders.
- Basic chart types: bar, line, pie (configurable axes/grouping).
- Parameterized queries in UI: typed inputs (text/number/date), defaults, validation, URL-sync for shareable links.
- Drill-down: click value → navigate to another Insight with param auto-filled.
- Alerts/notifications in UI:
    - Create/edit rules on Insights (threshold, row existence, always).
    - Multi-channel: Slack, email (more in NEXT).
    - Permissions: Only users with access to an Insight can see/set alerts.
- Basic RBAC: Admin, Editor, Viewer roles; object-level permissions.
- Export results as CSV & Excel
- User can add their own visualization - by following given format. Something like plugin.

**Acceptance:** Non-technical user can log in, run a saved Insight with params, see charts/tables, set an alert to Slack/email, and add Insight to a dashboard.

## NEXT

### AI (Assistive)

- Generate queries – natural language → SQL suggestions with preview & safe parameter binding.
- Understanding schema – explain tables/joins, surface key fields, suggest filters/metrics.
- Answer question from data/queries.

### Core Enhancements

- Dashboard Builder (drag-and-drop, resize, rearrange tiles).
- Global Filters (apply across dashboard views).

### Plugin Platform (Differentiator)

- Viz Plugin SDK – manifest-based plugins with lifecycle methods and typed props.
- Template Gallery – create/share/import visualization, plugin, and alert templates (community-contributed).

### Security & Governance

- RBAC & Row-Level Security – workspace/Insight permissions, optional DB-side RLS helpers.
- Audit & Versioning – who ran/edited what, diffs for queries/Insights, exportable audit log.

### Performance at Scale

- Caching & Snapshots – TTL cache, scheduled materialized snapshots for heavy queries.
- Concurrency & Queuing – query queue, per-connection concurrency caps, cancellation.
- Horizontal Workers – scale out runners for queries/alerts; backpressure & rate-limits.

### Integrations & Delivery

- More channels – WhatsApp/SMS, generic webhooks, Microsoft Teams.
- Embedding – signed embeds, public read-only links with token TTL.
- Event/Webhook API – emit run/alert events for downstream automations.