import {Pool, QueryResult as PgQueryResult} from "pg";
import {PostgreSQLConfig, QueryResult} from "./types";

export class PostgreSQLConnection {
    private pool: Pool;
    private config: PostgreSQLConfig;

    constructor(config: PostgreSQLConfig) {
        this.config = config;
        this.pool = new Pool({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.username,
            password: config.password,
            ssl: config.ssl,
            connectionTimeoutMillis: config.timeoutMs || 10000,
            idleTimeoutMillis: config.idleTimeoutMillis || 30000,
            application_name: config.applicationName || "Clariq",
        }) as Pool;
    }

    async connect(): Promise<void> {
        const client = await this.pool.connect();
        client.release();
    }

    async disconnect(): Promise<void> {
        await this.pool.end();
    }

    isConnected(): boolean {
        return this.pool.totalCount > 0 && !this.pool.ended;
    }

    async execute(sql: string, params?: any[]): Promise<QueryResult> {
        const startTime = Date.now();
        const result: PgQueryResult = await this.pool.query(sql,
            params || []);
        console.log(typeof result)
        return {
            rows: result.rows,
            fields: result.fields.map(field => ({
                name: field.name,
                type: field.dataTypeID.toString(),
                nullable: field.columnID !== -1
            })),
            rowCount: result.rowCount || 0,
            truncated: false,
            executionTimeMs: Date.now() - startTime,
        }
    }

    async testConnection(): Promise<boolean> {
        try{
            await this.pool.query("SELECT 1");
            return true;
        }catch(error){
            return false;
        }
    }
    getType(): string {
        return "postgresql";
    }
}