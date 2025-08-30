// result format of queries
export interface QueryResult {
    rows: Record<string, any>[];
    fields: Array<{
        name: string;
        type: string;
        nullable?: boolean;
    }>;
    rowCount: number;
    truncated: boolean;
    executionTimeMs: number;
}

// base connection config
export interface ConnectionConfig {
    name: string;
    url?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean;
    poolSize?: number;
    timeoutMs?: number;
}

// postgres connection config
export interface PostgreSQLConfig extends ConnectionConfig {
    schema?: string;
    applicationName?: string;
    sslMode?: 'require' | 'prefer' | 'allow' | 'disable';
    idleTimeoutMillis?: number;
    searchPath?: string[];
}

// connection profile for storage
export interface ConnectionProfile {
    name: string;
    description?: string;
    config: PostgreSQLConfig;
    createdAt?: Date;
    lastUsed?: Date;
}

// profile configuration file structure
export interface ProfileConfig {
    default?: string;
    profiles: Record<string, {
        description?: string;
        url?: string;
        host?: string;
        port?: number;
        database?: string;
        username?: string;
        password?: string;
        ssl?: boolean;
        schema?: string;
        applicationName?: string;
        sslMode?: 'require' | 'prefer' | 'allow' | 'disable';
        poolSize?: number;
        timeoutMs?: number;
        idleTimeoutMillis?: number;
        searchPath?: string[];
        createdAt?: string;
        lastUsed?: string;
    }>;
}