import type { Config } from '@config/index';
import { IConfigService } from '../interfaces';

export class ConfigService implements IConfigService {
    private static instance: ConfigService;
    private readonly config: Config;

    private constructor(initialConfig: Config) {
        this.config = initialConfig;
    }

    public static getInstance(config?: Config): ConfigService {
        if (!ConfigService.instance) {
            if (!config) {
                throw new Error('Initial config is required for first initialization');
            }
            ConfigService.instance = new ConfigService(config);
        }
        return ConfigService.instance;
    }

    public getConfig(): Config {
        return this.config;
    }
}
