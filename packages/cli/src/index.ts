import { ConnectionManager, PostgreSQLConfig, version } from "@clariq/core";
import { Command } from "commander";

export async function main() {
  const program = new Command();
  
  program
    .name("clariq")
    .description("Clariq - Database analytics and alerting platform")
    .version(version);

  program
    .command("run")
    .description("Execute SQL query against database")
    .argument("<query>", "SQL query to execute")
    .option("--url <url>", "PostgreSQL connection URL (e.g. postgresql://user:pass@host:port/db)")
    .option("-h, --host <host>", "Database host", "localhost")
    .option("-p, --port <port>", "Database port", "5432")
    .option("-d, --database <database>", "Database name", "postgres")
    .option("-u, --username <username>", "Database username", "postgres")
    .option("--password <password>", "Database password")
    .option("-n, --name <name>", "Connection name", "default")
    .action(async (query, options) => {
      try {
        const config: PostgreSQLConfig = {
          name: options.name,
          ...(options.url ? {
            url: options.url
          } : {
            host: options.host,
            port: parseInt(options.port),
            database: options.database,
            username: options.username,
            password: options.password || process.env.POSTGRES_PASSWORD,
          })
        };

        const manager = new ConnectionManager();
        if (config.url) {
          console.log(`Connecting to PostgreSQL via URL...`);
        } else {
          console.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}...`);
        }
        
        await manager.addConnection(config);
        console.log("Connected successfully!");
        
        console.log(`Executing query: ${query}`);
        const result = await manager.executeQuery(options.name, query);
        
        console.log(JSON.stringify(result, null, 2));
        
        await manager.removeConnection(options.name);
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  program
    .command("test")
    .description("Test database connection")
    .option("--url <url>", "PostgreSQL connection URL (e.g. postgresql://user:pass@host:port/db)")
    .option("-h, --host <host>", "Database host", "localhost")
    .option("-p, --port <port>", "Database port", "5432") 
    .option("-d, --database <database>", "Database name", "postgres")
    .option("-u, --username <username>", "Database username", "postgres")
    .option("--password <password>", "Database password")
    .action(async (options) => {
      try {
        const config: PostgreSQLConfig = {
          name: "test",
          ...(options.url ? {
            url: options.url
          } : {
            host: options.host,
            port: parseInt(options.port),
            database: options.database,
            username: options.username,
            password: options.password || process.env.POSTGRES_PASSWORD,
          })
        };

        const manager = new ConnectionManager();
        if (config.url) {
          console.log(`Testing connection to PostgreSQL via URL...`);
        } else {
          console.log(`Testing connection to PostgreSQL at ${config.host}:${config.port}/${config.database}...`);
        }
        
        await manager.addConnection(config);
        const isHealthy = await manager.testConnection("test");
        
        if (isHealthy) {
          console.log("✅ Connection successful!");
        } else {
          console.log("❌ Connection failed!");
        }
        
        await manager.removeConnection("test");
      } catch (error) {
        console.error("❌ Connection error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  await program.parseAsync();
}