

Multi-Database Architecture Plan                                      │ │
│ │                                                                       │ │
│ │ Approach: Build multi-database foundation from POC, starting with     │ │
│ │ PostgreSQL driver but architected for extensibility.                  │ │
│ │                                                                       │ │
│ │ Phase 1: Core Multi-Database Foundation (@clariq/core)                │ │
│ │                                                                       │ │
│ │ Connection Management System:                                         │ │
│ │ - ConnectionManager class to handle multiple named connections        │ │
│ │ - DatabaseDriver interface for different database types               │ │
│ │ - PostgreSQLDriver as first implementation                            │ │
│ │ - Connection pooling per database                                     │ │
│ │ - Configuration-driven setup                                          │ │
│ │                                                                       │ │
│ │ Query Execution Engine:                                               │ │
│ │ - executeQuery(connectionName, sql, params) interface                 │ │
│ │ - Standardized result format across all database types                │ │
│ │ - Parameter binding safety ($1, $2 style)                             │ │
│ │ - Error handling and timeout management                               │ │
│ │                                                                       │ │
│ │ Configuration Structure:                                              │ │
│ │ connections:                                                          │ │
│ │   main_postgres:                                                      │ │
│ │     driver: postgres                                                  │ │
│ │     url: ${POSTGRES_URL}                                              │ │
│ │   analytics_db:                                                       │ │
│ │     driver: postgres                                                  │ │
│ │     url: ${ANALYTICS_URL}                                             │ │
│ │                                                                       │ │
│ │ Phase 2: Alert Engine Multi-DB Support (@clariq/alert-engine)         │ │
│ │                                                                       │ │
│ │ - Alerts specify which connection to use                              │ │
│ │ - Each alert can target different databases                           │ │
│ │ - Connection-specific scheduling and state management                 │ │
│ │                                                                       │ │
│ │ Phase 3: CLI Multi-DB Interface (@clariq/cli)                         │ │
│ │                                                                       │ │
│ │ - clariq run --connection main_postgres "SELECT * FROM users"         │ │
│ │ - clariq connections list to show available connections               │ │
│ │ - clariq connections test <name> to validate connections              │ │
│ │                                                                       │ │
│ │ Learning Focus: Database abstraction patterns, connection pooling,    │ │
│ │ driver architecture, configuration management                         │ │
│ │                                                                       │ │
│ │ POC Success: Connect to multiple PostgreSQL databases, run queries    │ │
│ │ against each, trigger alerts from different databases.
-----

# Next Steps: Complete POC Phase


## Current Status

✅ **Complete**: Project structure with Turborepo monorepo setup
- `@clariq/core` - Shared utilities (basic connection stub)
- `@clariq/alert-engine` - Alert system (basic stub)  
- `@clariq/cli` - Command-line interface (basic stub)

🔄 **In Progress**: POC Phase - implementations are currently placeholder stubs

## Immediate Goals: Transform Stubs into Working Implementation

### 1. Core Database Engine (`@clariq/core`)

**Current**: Basic connection stub that returns mock data
**Target**: Real PostgreSQL connection and query execution

Tasks:
- Implement actual PostgreSQL connection using existing `pg` dependency
- Add SQL query execution with parameter binding (`$1`, `$2` for safety)
- Add result formatting to standardized shape: `{rows, fields, rowCount, truncated}`
- Add safety limits (query timeouts, row caps, byte caps)
- Add proper error handling for connection/query failures
- Add connection pooling for efficiency

### 2. Alert Engine Implementation (`@clariq/alert-engine`)

**Current**: Basic stub that logs start/stop messages
**Target**: Fully functional alert system that can run standalone

Tasks:
- Implement YAML config parsing using existing `js-yaml` dependency
- Add scheduling system using existing `node-cron` dependency  
- Implement rule evaluation engines:
  - `any_rows` - trigger if query returns any results
  - `threshold` - trigger if numeric column crosses threshold
  - `always` - send notification regardless (for digests)
  - `sql_boolean` - trigger if query returns single true/false
- Add notification channels:
  - Slack webhook integration
  - Basic SMTP email support
- Add cooldown/state management to prevent notification spam
- Add query result caching and deduplication
- Ensure complete modularity (works without main platform)

### 3. CLI Interface (`@clariq/cli`)

**Current**: Basic stub that prints version and starts mock engine
**Target**: Functional CLI for running queries and managing alerts

Tasks:
- Implement proper CLI using existing `commander` dependency
- Add core commands:
  - `clariq run <query>` - execute SQL and return JSON
  - `clariq alert run --config <file>` - start alert engine
  - `clariq alert test --id <alert>` - test specific alert
  - `clariq init` - generate starter config files
- Add JSON output formatting for query results
- Add configuration file support (database connections)
- Add connection validation and testing

### 4. Configuration and Examples

**Current**: Empty example files
**Target**: Working configuration examples

Tasks:
- Create functional `examples/alerts.yaml` with real alert definitions
- Create sample database connection configs
- Add POC validation examples
- Document configuration options and formats

### 5. Safety and Security Implementation

**Current**: No safety measures
**Target**: Production-ready safety controls

Tasks:
- Enforce read-only database roles
- Implement query timeouts and cancellation
- Add row count and byte size limits
- Add concurrent execution limits per connection
- Implement parameter binding validation
- Add input sanitization and validation

## POC Success Criteria

The POC phase is complete when we can:

1. **Connect to PostgreSQL** - Real database connection with proper credentials
2. **Execute SQL queries** - Run any valid SQL with parameter binding
3. **Return JSON results** - Standardized output format from CLI
4. **Configure alerts** - YAML-based alert definitions
5. **Trigger notifications** - At least Slack webhook working
6. **Standalone operation** - Alert engine works independently
7. **Safety measures** - All limits and protections active

## Implementation Approach

Following our incremental philosophy:

1. **Start with `@clariq/core`** - Database connectivity is foundation
2. **Build minimal alert engine** - Basic scheduling and rules
3. **Enhance CLI** - User interface to the functionality
4. **Add safety measures** - Security and limits throughout
5. **Create examples** - Validate with real configurations
6. **Test end-to-end** - Ensure POC acceptance criteria met

## Next Phase Preview

Once POC is solid, Phase 0 will add:
- Basic web UI for database connection
- SQL editor with syntax highlighting  
- Query results as sortable tables
- Error handling and session management

But first, we need a working foundation that validates our core architecture and modular approach.