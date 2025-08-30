# Clariq

A lightweight, open-source analytics platform that starts with the essentials — connect to a live database, run SQL queries, and see results. From day one, it includes a modular alert/notification system so even without the full UI, teams can get value immediately.

## 🎯 Philosophy

**Incremental & Modular Development**
- Start simple, grow systematically
- Each component works standalone
- Use parts independently while we build the rest

## 🚀 Current Status

**✅ Project Setup Complete** - Turborepo monorepo with TypeScript
- `@clariq/core` - Shared utilities, database connections
- `@clariq/alert-engine` - Standalone notification system
- `@clariq/cli` - Command-line interface

**🔄 In Development** - POC Phase
- PostgreSQL connectivity
- SQL query execution
- JSON result output

## 📋 Roadmap

### Proof of Concept (POC)
- [x] Project structure and monorepo setup
- [ ] Connect to PostgreSQL database
- [ ] Run SQL queries from CLI
- [ ] Return results as JSON
- [ ] Basic alert/notification system

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
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/clariq.git
cd clariq

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development mode
pnpm dev
```

### Project Structure
```
clariq/
├── packages/
│   ├── core/           # Shared utilities, DB connections
│   ├── alert-engine/   # Standalone alert system
│   └── cli/            # Command-line interface
├── examples/           # Sample configurations
└── docs/              # Documentation
```

### Scripts
- `pnpm build` - Build all packages
- `pnpm dev` - Start development with watch mode
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean build artifacts

## 🔧 Alert Engine (Standalone)

The alert engine can be used independently:

**As Docker Container:**
```bash
docker run -v $(pwd)/alerts.yaml:/config/alerts.yaml clariq/alert-engine
```

**As CLI:**
```bash
npx @clariq/alert-engine run --config alerts.yaml
```

**As Library:**
```javascript
import { createAlertEngine } from '@clariq/alert-engine';
const engine = createAlertEngine('postgresql://...');
engine.start();
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