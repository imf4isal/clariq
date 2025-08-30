import { ConnectionManager, PostgreSQLConfig, version, ConfigManager, ConnectionProfile } from "@clariq/core";
import { Command } from "commander";

async function createConnectionConfig(options: any): Promise<PostgreSQLConfig> {
  const configManager = new ConfigManager();
  
  // Priority 1: Explicit URL parameter (highest priority)
  if (options.url) {
    return {
      name: options.name || "cli-connection",
      url: options.url
    };
  }

  // Priority 2: Specific profile from --profile flag
  if (options.profile) {
    const profileConfig = await configManager.getProfile(options.profile);
    if (!profileConfig) {
      throw new Error(`Profile '${options.profile}' not found`);
    }
    return { ...profileConfig, name: options.name || profileConfig.name };
  }

  // Priority 3: Explicit manual connection parameters (only if explicitly provided)
  if (options.password || (options.host !== "localhost") || (options.port !== "5432") || (options.database !== "postgres") || (options.username !== "postgres")) {
    return {
      name: options.name || "cli-connection",
      host: options.host,
      port: parseInt(options.port || "5432"),
      database: options.database,
      username: options.username,
      password: options.password || process.env.POSTGRES_PASSWORD,
    };
  }

  // Priority 4: Default profile or environment variable
  const defaultConfig = await configManager.getDefaultProfile();
  if (defaultConfig) {
    return { ...defaultConfig, name: options.name || defaultConfig.name };
  }

  // Priority 5: Error - no connection source available
  throw new Error("No connection configuration found. Use --url, --profile, set a default profile, or set CLARIQ_DATABASE_URL");
}

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
    .option("--profile <profile>", "Use saved connection profile")
    .option("--url <url>", "PostgreSQL connection URL (e.g. postgresql://user:pass@host:port/db)")
    .option("-h, --host <host>", "Database host", "localhost")
    .option("-p, --port <port>", "Database port", "5432")
    .option("-d, --database <database>", "Database name", "postgres")
    .option("-u, --username <username>", "Database username", "postgres")
    .option("--password <password>", "Database password")
    .option("-n, --name <name>", "Connection name", "default")
    .action(async (query, options) => {
      try {
        const config = await createConnectionConfig(options);

        const manager = new ConnectionManager();
        if (config.url) {
          console.log(`Connecting to PostgreSQL via URL...`);
        } else {
          console.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}...`);
        }
        
        await manager.addConnection(config);
        console.log("Connected successfully!");
        
        console.log(`Executing query: ${query}`);
        const result = await manager.executeQuery(config.name, query);
        
        console.log(JSON.stringify(result, null, 2));
        
        await manager.removeConnection(config.name);
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  program
    .command("test")
    .description("Test database connection")
    .option("--profile <profile>", "Use saved connection profile")
    .option("--url <url>", "PostgreSQL connection URL (e.g. postgresql://user:pass@host:port/db)")
    .option("-h, --host <host>", "Database host", "localhost")
    .option("-p, --port <port>", "Database port", "5432") 
    .option("-d, --database <database>", "Database name", "postgres")
    .option("-u, --username <username>", "Database username", "postgres")
    .option("--password <password>", "Database password")
    .action(async (options) => {
      try {
        const config = await createConnectionConfig({...options, name: "test"});

        const manager = new ConnectionManager();
        if (config.url) {
          console.log(`Testing connection to PostgreSQL via URL...`);
        } else {
          console.log(`Testing connection to PostgreSQL at ${config.host}:${config.port}/${config.database}...`);
        }
        
        await manager.addConnection(config);
        const isHealthy = await manager.testConnection(config.name);
        
        if (isHealthy) {
          console.log("✅ Connection successful!");
        } else {
          console.log("❌ Connection failed!");
        }
        
        await manager.removeConnection(config.name);
      } catch (error) {
        console.error("❌ Connection error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  const profileCmd = program
    .command("profile")
    .description("Manage connection profiles");

  profileCmd
    .command("add")
    .description("Add a new connection profile")
    .argument("<name>", "Profile name")
    .option("--url <url>", "PostgreSQL connection URL")
    .option("-h, --host <host>", "Database host", "localhost")
    .option("-p, --port <port>", "Database port", "5432")
    .option("-d, --database <database>", "Database name", "postgres")
    .option("-u, --username <username>", "Database username", "postgres")
    .option("--password <password>", "Database password")
    .option("--description <description>", "Profile description")
    .option("--default", "Set as default profile")
    .action(async (name, options) => {
      try {
        const configManager = new ConfigManager();
        
        const config: PostgreSQLConfig = {
          name,
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

        const profile: ConnectionProfile = {
          name,
          description: options.description,
          config
        };

        await configManager.addProfile(profile);
        
        if (options.default) {
          await configManager.setDefaultProfile(name);
        }

        console.log(`✅ Profile '${name}' saved successfully!`);
        if (options.default) {
          console.log(`✅ Set '${name}' as default profile`);
        }
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  profileCmd
    .command("list")
    .description("List all saved profiles")
    .action(async () => {
      try {
        const configManager = new ConfigManager();
        const profiles = await configManager.listProfiles();
        
        if (profiles.length === 0) {
          console.log("No profiles found. Add one with: clariq profile add <name> --url <url>");
          return;
        }

        console.log("\n📋 Saved Profiles:");
        profiles.forEach(profile => {
          console.log(`  ${profile.name}${profile.description ? ` - ${profile.description}` : ''}`);
          if (profile.lastUsed) {
            console.log(`    Last used: ${profile.lastUsed.toLocaleDateString()}`);
          }
        });
        console.log("");
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  profileCmd
    .command("remove")
    .description("Remove a connection profile")
    .argument("<name>", "Profile name to remove")
    .action(async (name) => {
      try {
        const configManager = new ConfigManager();
        const removed = await configManager.removeProfile(name);
        
        if (removed) {
          console.log(`✅ Profile '${name}' removed successfully!`);
        } else {
          console.log(`❌ Profile '${name}' not found`);
          process.exit(1);
        }
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  profileCmd
    .command("test")
    .description("Test a saved connection profile")
    .argument("<name>", "Profile name to test")
    .action(async (name) => {
      try {
        const configManager = new ConfigManager();
        const config = await configManager.getProfile(name);
        
        if (!config) {
          console.log(`❌ Profile '${name}' not found`);
          process.exit(1);
        }

        const manager = new ConnectionManager();
        const testConfig = {...config, name: "profile-test"};
        
        if (testConfig.url) {
          console.log(`Testing profile '${name}' via URL...`);
        } else {
          console.log(`Testing profile '${name}' at ${testConfig.host}:${testConfig.port}/${testConfig.database}...`);
        }
        
        await manager.addConnection(testConfig);
        const isHealthy = await manager.testConnection("profile-test");
        
        if (isHealthy) {
          console.log(`✅ Profile '${name}' connection successful!`);
        } else {
          console.log(`❌ Profile '${name}' connection failed!`);
        }
        
        await manager.removeConnection("profile-test");
      } catch (error) {
        console.error(`❌ Profile '${name}' error:`, error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  await program.parseAsync();
}