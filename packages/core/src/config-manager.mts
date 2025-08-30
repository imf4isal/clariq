import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { ConnectionProfile, ProfileConfig, PostgreSQLConfig } from './types.mjs';

export class ConfigManager {
    private configDir: string;
    private profilesFile: string;
    private config: ProfileConfig | null = null;

    constructor() {
        this.configDir = path.join(os.homedir(), '.clariq');
        this.profilesFile = path.join(this.configDir, 'profiles.yaml');
    }

    private async ensureConfigDir(): Promise<void> {
        try {
            await fs.access(this.configDir);
        } catch {
            await fs.mkdir(this.configDir, { recursive: true });
        }
    }

    private async loadConfig(): Promise<ProfileConfig> {
        if (this.config) {
            return this.config;
        }

        try {
            const content = await fs.readFile(this.profilesFile, 'utf8');
            this.config = yaml.load(content) as ProfileConfig;
            if (!this.config.profiles) {
                this.config.profiles = {};
            }
        } catch {
            this.config = { profiles: {} };
        }

        return this.config;
    }

    private async saveConfig(): Promise<void> {
        await this.ensureConfigDir();
        const yamlContent = yaml.dump(this.config, { 
            indent: 2,
            lineWidth: -1,
            noRefs: true 
        });
        await fs.writeFile(this.profilesFile, yamlContent, 'utf8');
    }

    async addProfile(profile: ConnectionProfile): Promise<void> {
        const config = await this.loadConfig();
        
        const profileData: any = {
            description: profile.description
        };

        if (profile.config.url) {
            profileData.url = profile.config.url;
        } else {
            if (profile.config.host) profileData.host = profile.config.host;
            if (profile.config.port) profileData.port = profile.config.port;
            if (profile.config.database) profileData.database = profile.config.database;
            if (profile.config.username) profileData.username = profile.config.username;
            if (profile.config.password) profileData.password = profile.config.password;
            if (profile.config.ssl !== undefined) profileData.ssl = profile.config.ssl;
        }

        if (profile.config.schema) profileData.schema = profile.config.schema;
        if (profile.config.applicationName) profileData.applicationName = profile.config.applicationName;
        if (profile.config.sslMode) profileData.sslMode = profile.config.sslMode;
        if (profile.config.poolSize) profileData.poolSize = profile.config.poolSize;
        if (profile.config.timeoutMs) profileData.timeoutMs = profile.config.timeoutMs;
        if (profile.config.idleTimeoutMillis) profileData.idleTimeoutMillis = profile.config.idleTimeoutMillis;
        if (profile.config.searchPath) profileData.searchPath = profile.config.searchPath;

        profileData.createdAt = (profile.createdAt || new Date()).toISOString();
        profileData.lastUsed = (profile.lastUsed || new Date()).toISOString();

        config.profiles[profile.name] = profileData;
        await this.saveConfig();
    }

    async removeProfile(name: string): Promise<boolean> {
        const config = await this.loadConfig();
        if (config.profiles[name]) {
            delete config.profiles[name];
            if (config.default === name) {
                delete config.default;
            }
            await this.saveConfig();
            return true;
        }
        return false;
    }

    async getProfile(name: string): Promise<PostgreSQLConfig | null> {
        const config = await this.loadConfig();
        const profileData = config.profiles[name];
        
        if (!profileData) {
            return null;
        }

        await this.markProfileUsed(name);

        const result: PostgreSQLConfig = {
            name,
            ...profileData
        };

        return result;
    }

    async listProfiles(): Promise<ConnectionProfile[]> {
        const config = await this.loadConfig();
        return Object.entries(config.profiles).map(([name, data]) => ({
            name,
            description: data.description,
            config: { name, ...data } as PostgreSQLConfig,
            createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
            lastUsed: data.lastUsed ? new Date(data.lastUsed) : undefined
        }));
    }

    async getDefaultProfile(): Promise<PostgreSQLConfig | null> {
        const config = await this.loadConfig();
        
        if (config.default) {
            return this.getProfile(config.default);
        }

        const envUrl = process.env.CLARIQ_DATABASE_URL;
        if (envUrl) {
            return {
                name: 'env-default',
                url: envUrl
            };
        }

        const profiles = Object.keys(config.profiles);
        if (profiles.length === 1) {
            return this.getProfile(profiles[0]);
        }

        return null;
    }

    async setDefaultProfile(name: string): Promise<boolean> {
        const config = await this.loadConfig();
        if (config.profiles[name]) {
            config.default = name;
            await this.saveConfig();
            return true;
        }
        return false;
    }

    private async markProfileUsed(name: string): Promise<void> {
        const config = await this.loadConfig();
        if (config.profiles[name]) {
            config.profiles[name].lastUsed = new Date().toISOString();
            await this.saveConfig();
        }
    }

    async hasProfiles(): Promise<boolean> {
        const config = await this.loadConfig();
        return Object.keys(config.profiles).length > 0;
    }
}