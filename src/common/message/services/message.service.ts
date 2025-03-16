import { IMessageService } from '../interfaces';
import type { Config } from '@config/index';
import { IHelperStringService } from '@common/helper/interfaces';
import { IConfigService } from '@common/config/interfaces';

interface MessageValue {
    [key: string]: string | MessageValue | ((...args: unknown[]) => string);
}

interface Messages {
    [key: string]: MessageValue;
}

export class MessageService implements IMessageService {
    private readonly config: Config;
    private readonly messages: typeof this.config.messages;

    constructor(
        private readonly helperStringService: IHelperStringService,
        private readonly configService: IConfigService
    ) {
        this.config = this.configService.getConfig();
        this.messages = this.config.messages;
    }

    public getMessage(path: string, params: Record<string, unknown> = {}): string {
        const message = path
            .split('.')
            .reduce<MessageValue | string | ((...args: unknown[]) => string) | undefined>((obj, key) => {
                if (!obj || typeof obj !== 'object') return undefined;
                return obj[key];
            }, this.messages as Messages);

        if (typeof message === 'function') {
            return message(...Object.values(params));
        }

        console.log(message);

        return message?.toString() || '';
    }
}
