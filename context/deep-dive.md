Database Architecture Terms

Connection Manager Pattern:
- Centralized handling of multiple database connections
- Research: "Database Connection Pool Pattern", "Multi-tenant database
  architecture"

Database Driver Interface:
- Abstraction layer that standardizes different database types
- Research: "Database Abstraction Layer (DAL)", "Driver pattern in
  software architecture"

Connection Pooling:
- Reusing database connections for efficiency
- Research: "Database connection pooling", "pg.Pool in Node.js"

Query Execution Patterns

Parameter Binding:
- Safe way to include user values in SQL ($1, $2 instead of string
  concatenation)
- Research: "SQL injection prevention", "Prepared statements"

Result Standardization:
- Converting different database result formats into consistent shape
- Research: "Data normalization patterns", "Result set mapping"

Configuration Management

Environment Variable Injection:
- Using ${POSTGRES_URL} in config files
- Research: "12-factor app configuration", "Environment-based
  configuration"

Driver-based Configuration:
- Each connection specifies which database type it 