import { IManagerService } from '../interfaces';
import type { Config } from '@config/index';
import { IConfigService } from '@common/config/interfaces';
import readline from 'readline-sync';
import { IHelperArrayService, IHelperNumberService } from '@common/helper/interfaces';
import { IMessageService } from '@common/message/interfaces';

export class ManagerService implements IManagerService {
    private readonly baseMenuItems: { value: string; title: string }[];
    private readonly config: Config;
    private readonly configManagerMenu: Config['manager']['menu'];

    constructor(
        private readonly configService: IConfigService,
        private readonly helperNumberService: IHelperNumberService,
        private readonly helperArrayService: IHelperArrayService,
        private readonly messageService: IMessageService
    ) {
        this.config = this.configService.getConfig();
        this.configManagerMenu = this.config.manager.menu;
        this.baseMenuItems = [this.configManagerMenu.help, this.configManagerMenu.exit];
    }

    public exit(): never {
        process.exit(0);
    }

    public showError(error: string): never {
        console.error(error);
        this.exit();
    }

    public showHint(hint: string): void {
        console.info(hint);
    }

    async promptSingleValue(
        choices: {
            value: string;
            title: string;
        }[],
        config: {
            messagePrompt: string;
            messageHelp: string;
        }
    ): Promise<number> {
        const options = [...choices, ...this.baseMenuItems];

        options.forEach((option) => this.showHint(option.title));

        const response = readline.question(config.messagePrompt).trim().toLowerCase();

        if (response === this.configManagerMenu.exit.value) {
            return this.exit();
        }

        if (response === this.configManagerMenu.help.value) {
            this.showHint(config.messageHelp);
            return this.promptSingleValue(choices, config);
        }

        if (!this.helperNumberService.validateRange(response, choices.length)) {
            console.error(
                this.messageService.getMessage('errors.readlineValue', {
                    value: response,
                })
            );
            return this.promptSingleValue(choices, config);
        }

        return Number(response);
    }

    createManagerOptionArray = (input: number | number[] | number[][]): { value: string; title: string }[] => {
        if (!Array.isArray(input)) {
            return this.helperArrayService.generateNumberArray(input);
        }

        return this.helperArrayService.generateOptionArray(input as number[]);
    };
}
