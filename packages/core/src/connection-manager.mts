import {PostgreSQLConfig, QueryResult} from "./types";
import {PostgreSQLConnection} from "./postresql-connection";

export class ConnectionManager {
    private connections: Map<string, PostgreSQLConnection> = new Map();

    async addConnection(config: PostgreSQLConfig): Promise<void> {
        const connection = new PostgreSQLConnection(config);
        await connection.connect();
        this.connections.set(config.name, connection);
    }

    async removeConnection(name: string): Promise<void> {
        const connection = this.connections.get(name);
        if (connection) {
            await connection.disconnect();
            this.connections.delete(name);
        }
    }

    getConnection(name: string): PostgreSQLConnection | null {
        return this.connections.get(name) || null;
    }

    async executeQuery(connectionName: string, sql: string, params?: any[]): Promise<QueryResult> {
        const connection = this.connections.get(connectionName);
        if (!connection) {
            throw new Error(`Connection '${connectionName}' not found`);
        }
        return await connection.execute(sql, params);
    }

    listConnections(): Array<{name: string, type: string, connected: boolean}> {
        const result: Array<{name: string, type: string, connected: boolean}> = [];
        for (const [name, connection] of this.connections) {
            result.push({
                name,
                type: connection.getType(),
                connected: connection.isConnected()
            });
        }
        return result;
    }

    async testConnection(connectionName: string): Promise<boolean> {
        const connection = this.connections.get(connectionName);
        if (!connection) {
            throw new Error(`Connection '${connectionName}' not found`);
        }
        return await connection.testConnection();
    }

    async testAllConnections(): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};
        for (const [name, connection] of this.connections) {
            results[name] = await connection.testConnection();
        }
        return results;
    }
}