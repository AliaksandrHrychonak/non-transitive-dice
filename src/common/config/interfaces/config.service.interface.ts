import type { Config } from '@config/index';

export interface IConfigService {
    getConfig(): Config;
}
