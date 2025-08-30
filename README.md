# Clariq

A lightweight, open-source analytics platform that starts with the essentials — connect to a live database, run SQL queries, and see results. From day one, it includes a modular alert/notification system so even without the full UI, teams can get value immediately.

## 🎯 Philosophy

**Incremental & Modular Development**
- Start simple, grow systematically
- Each component works standalone
- Use parts independently while we build the rest

## 🚀 Current Status

**✅ POC Phase Complete** - Ready for production use!
- PostgreSQL database connectivity with connection pooling
- CLI interface for SQL query execution  
- JSON result output with comprehensive error handling
- **Connection profile storage** - save database connections, no more repetitive URLs
- Named connection management with default profile support
- Real database validation completed

**🔄 Next Phase** - Basic Frontend (Phase 0)
- Simple web UI for database connections
- SQL editor with syntax highlighting
- Result visualization as tables

## 📋 Roadmap

### Proof of Concept (POC) ✅ **COMPLETED**
- [x] Project structure and monorepo setup
- [x] Connect to PostgreSQL database with connection pooling
- [x] Run SQL queries from CLI with parameter binding
- [x] Return results as JSON with execution metrics
- [x] Connection profile storage system (save/load/manage database connections)
- [x] Named connection management with environment variable fallback
- [x] Real database testing and validation
- [x] Comprehensive error handling and resource cleanup
- [ ] Basic alert/notification system (stub implementation exists)

### Phase 0 - Basic UI
- [ ] Simple frontend for database connection
- [ ] SQL editor with syntax highlighting
- [ ] Query results as sortable tables
- [ ] Error handling and session management

### Phase 1 - MVP
- [ ] Save queries as "Insights"
- [ ] Basic charts (bar, line, pie)
- [ ] Parameterized queries
- [ ] Alert rules and notifications
- [ ] Role-based access control

### NEXT - Advanced Features
- [ ] AI query generation
- [ ] Dashboard builder
- [ ] Plugin platform
- [ ] Advanced security & governance

## 🛠️ Development

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL (for development)

### Getting Started

#### Quick Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/clariq.git
cd clariq

# Install dependencies and build
pnpm install
pnpm build
```

#### Database Connection Setup
```bash
# Save your database connection (one-time setup)
node ./packages/cli/dist/cli.js profile add production \
  --url "postgresql://user:password@host:port/database" \
  --description "My database" \
  --default

# Test the connection
node ./packages/cli/dist/cli.js profile test production
```

#### Usage Examples
```bash
# List saved profiles
node ./packages/cli/dist/cli.js profile list

# Run queries using default profile (no URL needed!)
node ./packages/cli/dist/cli.js run "SELECT * FROM users LIMIT 10"

# Use specific profile
node ./packages/cli/dist/cli.js run "SELECT COUNT(*) FROM orders" --profile production

# Test connection
node ./packages/cli/dist/cli.js test --profile production
```

#### Development Mode
```bash
# Start development with watch mode
pnpm dev
```

### Project Structure
```
clariq/
├── packages/
│   ├── core/           # Database connectivity, connection management, config storage
│   ├── alert-engine/   # Standalone alert system (stub)
│   └── cli/            # Command-line interface with profile management
├── context/            # Project documentation and requirements
├── examples/           # Sample configurations
└── ~/.clariq/          # User profiles stored as profiles.yaml
```

### CLI Commands
```bash
# Profile Management
clariq profile add <name> --url <url> [--default]     # Save connection
clariq profile list                                   # List all profiles  
clariq profile remove <name>                          # Delete profile
clariq profile test <name>                            # Test connection

# Query Execution  
clariq run <query> [--profile <name>]                 # Execute SQL
clariq test [--profile <name>]                        # Test connection

# Connection Priority (highest to lowest)
# 1. Explicit --url flag
# 2. --profile flag  
# 3. Default profile
# 4. CLARIQ_DATABASE_URL environment variable
```

### Scripts
- `pnpm build` - Build all packages
- `pnpm dev` - Start development with watch mode
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean build artifacts

## 🚀 Quick Start for New Machines

Deploy Clariq on a new machine in 3 steps:

```bash
# 1. Clone and build
git clone <repo-url> && cd clariq
pnpm install && pnpm build

# 2. Add your database connection  
node ./packages/cli/dist/cli.js profile add production \
  --url "postgresql://user:pass@host:port/database" \
  --default

# 3. Start querying (no more connection details needed!)
node ./packages/cli/dist/cli.js run "SELECT 1"
```

## 🔧 Alert Engine (Future Enhancement)

The alert engine has stub implementation ready for development:

```javascript
import { createAlertEngine } from '@clariq/alert-engine';
const engine = createAlertEngine('postgresql://...');
engine.start(); // Currently logs "Alert engine started"
```

## 📖 Documentation

- [Project Brief](context/clariq.md) - Detailed project overview and phases
- [Alert System Design](context/alert.md) - Modular notification system specs
- [Development Guide](./CLAUDE.md) - Development principles and approach

## 🤝 Contributing

We welcome contributions! Please read our development principles:
- **Incremental approach** - deliver simple, working features one by one
- **Modularity first** - components should work as standalone tools
- **Developer experience** - focus on ease of use and adoption

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](./docs/)
- [Examples](./examples/)
- [Issues](https://github.com/imf4isal/clariq/issues)
- [Discussions](https://github.com/imf4isal/clariq/discussions)