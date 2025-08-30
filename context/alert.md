
# Modular Alert / Notification System

## 1. Overview

The alert/notification system is designed as a **fully modular, query-agnostic** component.
It can run standalone or inside the main analytics platform, and can be adopted by external projects without bringing in unrelated parts of our stack.
The key principle is **loose coupling**: the engine doesn’t care what the query looks like or what domain it serves — only how to connect, run, evaluate, and notify.

---

## 2. Developer Experience (DX)

### What a developer can do with it

* Run the alert runner **standalone** with only a config file (YAML/JSON) and environment variables for secrets.
* Embed the alert logic as a **library** inside their own backend service.
* Install/run as a **CLI binary** for local testing or cron jobs.
* Deploy as a **container** in any environment (Docker, Kubernetes, serverless functions, etc.).
* Configure it once and have it execute **any SQL or stored procedure** on a schedule.
* Define simple **rules** to decide when a notification is sent:

  * `any_rows` — trigger if any row is returned.
  * `threshold` — trigger if a numeric column crosses a threshold.
  * `always` — send regardless of change/result (for digests).
  * `sql_boolean` — trigger if a query returns a single `true/false` value.
* Send notifications to various **channels** (Slack, email, WhatsApp/SMS, Microsoft Teams, generic webhooks, etc.).
* Keep it safe with **read-only DB credentials** and enforced limits.
* Observe everything via logs and optional health endpoints.

---

### Options for adding it to a project

#### 1) Standalone Container

* Use an official container image.
* Mount a config file (`alerts.yaml`) and pass environment variables for secrets.
* Run continuously as a service or one-shot (e.g., from a cron job).

#### 2) CLI Binary

* Install from an npm registry or download a compiled binary.
* Commands:

  * `alerts init` — generate a starter config.
  * `alerts run` — start the scheduler loop.
  * `alerts test --id <job>` — run a specific alert once and show the payload.

#### 3) Library / SDK

* Install the core library in a Node.js project.
* Create a runner instance programmatically and integrate with existing job systems.
* Listen to events (`onRun`, `onNotify`, `onError`) for custom handling.

#### 4) Inside Another Platform

* Use as a background service or worker pod.
* Trigger from platform-saved “Insight IDs” or raw SQL defined in the main app.
* Share logging and state with the main platform’s observability stack.

---

### Config Structure Example

```yaml
version: 0.1

connections:
  main:
    driver: postgres
    url: ${POSTGRES_URL}
    statement_timeout_ms: 30000
    max_rows: 50000
    max_bytes: 10485760

channels:
  slack_ops:
    type: slack
    webhook_url: ${SLACK_WEBHOOK_URL}
  email_daily:
    type: email
    smtp_url: ${SMTP_URL}
    from: "alerts@example.com"
    to: ["ops@example.com"]

alerts:
  - id: low_stock
    connection: main
    schedule: "*/10 * * * *"
    query: |
      select sku, name, qty
      from inventory
      where qty < $1
    params: [10]
    rule:
      any_rows: true
    notify: ["slack_ops"]
    cooldown: "30m"
    sample_rows: 5

  - id: payments_failed_recent
    connection: main
    every: "5m"
    query: |
      select id, user_id
      from payments
      where status = 'FAILED'
        and created_at > now() - interval '5 minutes'
    rule:
      any_rows: true
    notify: ["slack_ops"]

  - id: sales_daily_digest
    connection: main
    schedule: "0 7 * * *"
    query: |
      select current_date as day, sum(amount) as total
      from sales
      where created_at >= current_date - interval '1 day'
    rule:
      always: true
    notify: ["email_daily"]
```

---

## 3. Query Agnosticism

### Definition

The system is **query-agnostic**: it does not enforce any schema, domain, or query shape.
Any valid statement accepted by the underlying database driver can be executed.

### What this means

* Works with:

  * Simple `SELECT`s.
  * Joins, aggregates, window functions.
  * Stored procedures (`CALL my_proc($1)`).
  * CTEs.
* Supports multiple domains:

  * Retail, finance, IoT, monitoring, etc.
* Can target different sources (via adapters):

  * OLTP databases, warehouses, even APIs.

### How it stays agnostic

* Engine-level parameter binding (`$1`, `$2`) to support all value types without string concatenation.
* Standardized result shape:

  ```ts
  { rows: any[]; fields: Field[]; rowCount: number; truncated: boolean }
  ```

  Rules evaluate this shape, never raw driver responses.
* Rules are general-purpose — e.g., `threshold` checks a numeric field without caring about the domain.

---

## 4. How We’ll Achieve Modularity

### a) Packaging

* **Core library**: query execution, rules, scheduler, channels, state.
* **Runner service**: wraps the core, handles config loading, logs, health checks.
* Multiple distribution formats:

  * Docker image.
  * CLI binary.
  * npm package.
  * Source module for embedding.

### b) Clean Interfaces

* **SourceAdapter** — runs the query/procedure.
* **RuleAdapter** — decides whether to notify.
* **ChannelAdapter** — sends the notification.
* **Scheduler** — triggers jobs per cron/interval.

### c) Safety & Limits

* Use read-only DB roles.
* Enforce query timeout, row caps, byte caps.
* Cancel long queries.
* Limit concurrent executions per connection.

### d) State & Cooldown

* Maintain last run time, last result hash for deduplication.
* Cooldown prevents repeated notifications.

### e) Error Handling

* Query/connection errors: log and skip to next schedule.
* Notification errors: retry with backoff, dead-letter after repeated failures.
* Config errors: fail fast with line/field reference.

### f) Observability

* Structured JSON logs.
* `/healthz` endpoint (when running as a service).
* Test mode for dry-runs.

### g) Extensibility

* Add new sources, rules, or channels by dropping in adapter modules.
* Support for community-contributed adapters.

### h) Security

* No secrets in config — use env or secrets manager.
* Optional endpoint allowlists for webhooks.
* Redact sensitive values from logs.

### i) Integration Path

* Inside platform: run Insights by ID or run raw SQL from config.
* Outside platform: use config directly, no dependency on other components.

---

## 5. Acceptance Criteria for Modularity

* Able to run in all modes: Docker, CLI, library, embedded.
* Swap any channel or source without code changes.
* Add a new adapter by creating one file and referencing it in config.
* Use with any query shape or schema.
* Inside the platform or standalone, same engine and config format.
