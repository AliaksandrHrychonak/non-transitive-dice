import { IManagerService } from '@common/manager/interfaces';
import { IMessageService } from '@common/message/interfaces';
import { IHelperArrayService } from '@common/helper/interfaces';
import { IConfigService } from '@common/config/interfaces';
import type { Config } from '../../../config/index';
import { IDiceValidatorService } from '../interfaces';

export class DiceValidatorService implements IDiceValidatorService {
    private readonly configDiceLength: { min: number; max: number };
    private readonly configDiceValues: { min: number; max: number };
    private readonly configDiceFaces: { min: number; max: number };
    private readonly config: Config;

    constructor(
        private readonly configService: IConfigService,
        private readonly helperArrayService: IHelperArrayService,
        private readonly managerService: IManagerService,
        private readonly messageService: IMessageService
    ) {
        this.config = this.configService.getConfig();
        this.configDiceLength = this.config.game.dices;
        this.configDiceValues = this.config.dice.values;
        this.configDiceFaces = this.config.dice.faces;
    }

    private parseDice(dice: string[]): number[][] {
        return dice.map((e) => this.helperArrayService.parseCommaSeparatedNumbers(e));
    }

    private validateDiceLength(dice: number[][]): void {
        if (!dice) {
            this.managerService.showError(
                this.messageService.getMessage('errors.tooFewDice', {
                    required: this.configDiceLength.min,
                    current: 0,
                    needed: this.configDiceLength.min,
                    dice: `${dice}`,
                })
            );
        }

        if (dice.length < this.configDiceLength.min) {
            this.managerService.showError(
                this.messageService.getMessage('errors.tooFewDice', {
                    required: this.configDiceLength.min,
                    current: dice.length,
                    needed: this.configDiceLength.min - dice.length,
                    dice: `${dice}`,
                })
            );
        }

        if (dice.length > this.configDiceLength.max) {
            this.managerService.showError(
                this.messageService.getMessage('errors.tooManyDice', {
                    maximum: this.configDiceLength.max,
                    current: dice.length,
                    excess: dice.length - this.configDiceLength.max,
                    dice: `${dice}`,
                })
            );
        }
    }

    private validateDiceValue(faces: number[], value: number): void {
        if (!Number.isInteger(value)) {
            this.managerService.showError(
                this.messageService.getMessage('errors.invalidValueTypeDice', {
                    value: value,
                    dice: `${faces}`,
                })
            );
        }

        if (value < this.configDiceValues.min || value > this.configDiceValues.max) {
            this.managerService.showError(
                this.messageService.getMessage('errors.invalidValueDice', {
                    value: value,
                    range: {
                        min: this.configDiceValues.min,
                        max: this.configDiceValues.max,
                    },
                    dice: faces,
                })
            );
        }
    }

    private validateDiceFaces(arr: number[][]): void {
        arr.forEach((faces) => {
            if (!faces) {
                this.managerService.showError(
                    this.messageService.getMessage('errors.tooFewFacesDice', {
                        required: this.configDiceFaces.min,
                        current: 0,
                        needed: this.configDiceFaces.min,
                        dice: `${faces}`,
                    })
                );
            }

            if (faces.length < this.configDiceFaces.min) {
                this.managerService.showError(
                    this.messageService.getMessage('errors.tooFewFacesDice', {
                        required: this.configDiceFaces.min,
                        current: faces.length,
                        needed: this.configDiceFaces.min - faces.length,
                        dice: `${faces}`,
                    })
                );
            }

            if (faces.length > this.configDiceFaces.max) {
                this.managerService.showError(
                    this.messageService.getMessage('errors.tooManyFacesDice', {
                        maximum: this.configDiceFaces.max,
                        current: faces.length,
                        excess: faces.length - this.configDiceFaces.max,
                        dice: `${faces}`,
                    })
                );
            }

            faces.forEach((value) => this.validateDiceValue(faces, value));
        });
    }

    public validate(dice: string[]): number[][] {
        const parsedDice = this.parseDice(dice);
        this.validateDiceLength(parsedDice);
        this.validateDiceFaces(parsedDice);

        return parsedDice;
    }
}
