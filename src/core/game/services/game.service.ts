import { IGameService } from '@core/game/interfeces';
import { IMessageService } from '@common/message/interfaces';
import { IManagerService } from '@common/manager/interfaces';
import { IHelperArrayService, IHelperEncryptionService } from '@common/helper/interfaces';
import type { Config } from '@config/index';
import { IConfigService } from '@common/config/interfaces';
import { IPlayerService } from '@core/player/interfeces';
import { IDiceTableService } from '@core/dice-table/interfaces';

export class GameService implements IGameService {
    private readonly configDiceLength: { min: number; max: number };
    private readonly configDiceValues: { min: number; max: number };
    private readonly configDiceFaces: { min: number; max: number };
    private readonly configGame: typeof this.config.game;
    private readonly firstMoveOptions: { value: string; title: string }[];
    private readonly config: Config;

    constructor(
        private readonly messageService: IMessageService,
        private readonly managerService: IManagerService,
        private readonly helperArrayService: IHelperArrayService,
        private readonly helperEncryptionService: IHelperEncryptionService,
        private readonly playerService: IPlayerService,
        private readonly diceTableService: IDiceTableService,
        private readonly configService: IConfigService,
    ) {
        this.config = this.configService.getConfig();
        this.configDiceLength = this.config.game.dices;
        this.configDiceValues = this.config.dice.values;
        this.configDiceFaces = this.config.dice.faces;
        this.configGame = this.config.game;
        this.firstMoveOptions = this.managerService.createManagerOptionArray(this.configGame.firstMoveChoice);
    }

    async determineFirstPlayer(diceList: number[][]): Promise<boolean> {
        this.managerService.showHint(this.messageService.getMessage('game.determineFirstMove'));

        const computerFirstMoveDecider = this.playerService.createEncryptionValue(
            this.helperEncryptionService.randomInt(0, this.configGame.firstMoveChoice),
        );

        this.managerService.showHint(
            this.messageService.getMessage('game.moveVerificationHmac', {
                range: {
                    min: 0,
                    max: this.configGame.firstMoveChoice - 1,
                },
                hmac: computerFirstMoveDecider.hmac,
            }),
        );

        this.managerService.showHint(this.messageService.getMessage('game.determineFirstMoveGuessPrompt'));

        const personFirstMoveSelectedValue = await this.managerService.promptSingleValue(this.firstMoveOptions, {
            messagePrompt: this.messageService.getMessage('game.personSelection'),
            messageHelp: this.diceTableService.createProbabilityTable(diceList),
        });

        const playerFirstMoveDecider = this.playerService.createEncryptionValue(personFirstMoveSelectedValue);

        this.managerService.showHint(
            this.messageService.getMessage('game.moveVerificationKey', {
                value: computerFirstMoveDecider.number,
                key: computerFirstMoveDecider.key,
            }),
        );

        if (!this.helperEncryptionService.hmacDecrypt(computerFirstMoveDecider)) {
            this.managerService.showError(
                this.messageService.getMessage('errors.gameCancelled', {
                    reason: 'The computer changed the value of its choice after your move.',
                }),
            );
        }

        return computerFirstMoveDecider.number === playerFirstMoveDecider.number;
    }

    private async selectOption(
        options: { value: string; title: string }[],
        config: {
            messagePrompt: string;
            messageHelp: string;
        },
    ): Promise<number> {
        return this.managerService.promptSingleValue(options, config);
    }

    public async playerDiceSelection(
        isPersonFirst: boolean,
        diceList: number[][],
    ): Promise<{
        personDice: number[];
        computerDice: number[];
    }> {
        let personDice: number[] = [];

        let computerDice: number[] = [];

        if (isPersonFirst) {
            this.managerService.showHint(this.messageService.getMessage('game.chooseDice'));

            const personDiceIndex = await this.selectOption(this.managerService.createManagerOptionArray(diceList), {
                messagePrompt: this.messageService.getMessage('game.personSelection'),
                messageHelp: this.diceTableService.createProbabilityTable(diceList),
            });

            personDice = diceList[personDiceIndex];

            this.managerService.showHint(
                this.messageService.getMessage('game.personDiceSelection', {
                    dice: personDice,
                }),
            );

            const filterDiceList = [...diceList.filter((_, i) => i !== personDiceIndex)];

            const pcDiceIndex = this.helperEncryptionService.randomInt(0, filterDiceList.length);

            computerDice = filterDiceList[pcDiceIndex];

            this.managerService.showHint(
                this.messageService.getMessage('game.computerDiceSelection', {
                    dice: computerDice,
                    isPersonFirst,
                }),
            );
        } else {
            const pcDiceIndex = this.helperEncryptionService.randomInt(0, diceList.length);

            computerDice = diceList[pcDiceIndex];

            this.managerService.showHint(
                this.messageService.getMessage('game.computerDiceSelection', {
                    dice: computerDice,
                    isPersonFirst,
                }),
            );

            this.managerService.showHint(this.messageService.getMessage('game.chooseDice'));

            const filterDiceList = [...diceList.filter((_, i) => i !== pcDiceIndex)];

            const personDiceIndex = await this.selectOption(
                this.managerService.createManagerOptionArray(filterDiceList),
                {
                    messagePrompt: this.messageService.getMessage('game.personSelection'),
                    messageHelp: this.diceTableService.createProbabilityTable(diceList),
                },
            );

            personDice = filterDiceList[personDiceIndex];

            this.managerService.showHint(
                this.messageService.getMessage('game.personDiceSelection', {
                    value: personDice,
                }),
            );
        }

        if (!personDice.length || !computerDice.length) {
            this.managerService.showError(
                this.messageService.getMessage('errors.gameCancelled', {
                    reason: 'Error when selecting the player and/or computer cube',
                }),
            );
        }

        return { personDice, computerDice };
    }

    public async makePlayerTurn(
        diceList: number[][],
        dice: number[],
        isPersonFirst: boolean,
    ): Promise<{
        result: number;
        diceValue: number;
    }> {
        this.managerService.showHint(this.messageService.getMessage('game.throw'));

        const randomValue = this.playerService.createEncryptionValue(
            this.helperEncryptionService.randomInt(0, dice.length),
        );

        this.managerService.showHint(
            this.messageService.getMessage('game.moveVerificationHmac', {
                range: {
                    min: 0,
                    max: dice.length - 1,
                },
                hmac: randomValue.hmac,
            }),
        );

        this.managerService.showHint(
            this.messageService.getMessage('game.addPlayerNumber', {
                module: dice.length,
            }),
        );

        const playerInput = await this.selectOption(this.managerService.createManagerOptionArray(dice.length), {
            messagePrompt: this.messageService.getMessage('game.personSelection'),
            messageHelp: this.diceTableService.createProbabilityTable(diceList),
        });

        this.managerService.showHint(
            this.messageService.getMessage('game.moveVerificationKey', {
                value: randomValue.number,
                key: randomValue.key,
            }),
        );

        const sum = playerInput + randomValue.number;
        const result = sum % dice.length;

        this.managerService.showHint(
            this.messageService.getMessage('game.resultCalculate', {
                personValue: playerInput,
                computerValue: randomValue.number,
                result,
                module: dice.length,
            }),
        );

        this.showThrowResultHint(dice[result], isPersonFirst);

        return {
            result,
            diceValue: dice[result],
        };
    }

    public determineWinner(personResult: number, pcResult: number): void {
        if (personResult === pcResult) {
            this.managerService.showHint(
                this.messageService.getMessage('game.deadHeat', {
                    personValue: personResult,
                    computerValue: pcResult,
                }),
            );
            return this.managerService.exit();
        }

        const win = personResult > pcResult;

        this.managerService.showHint(
            this.messageService.getMessage('game.win', {
                personValue: personResult,
                computerValue: pcResult,
                isPersonWin: win,
            }),
        );

        return this.managerService.exit();
    }

    public parseDice(dice: string[]): number[][] {
        return dice.map((e) => this.helperArrayService.parseCommaSeparatedNumbers(e));
    }

    public showThrowResultHint(result: number, isPersonFirst: boolean): void {
        return this.managerService.showHint(
            this.messageService.getMessage('game.timeThrow', {
                result,
                isPersonFirst,
            }),
        );
    }

    private validateDiceLength(dice: number[][]): void {
        if (!dice) {
            this.managerService.showError(
                this.messageService.getMessage('errors.tooFewDice', {
                    required: this.configDiceLength.min,
                    current: 0,
                    needed: this.configDiceLength.min,
                    dice: `${dice}`,
                }),
            );
        }

        if (dice.length < this.configDiceLength.min) {
            this.managerService.showError(
                this.messageService.getMessage('errors.tooFewDice', {
                    required: this.configDiceLength.min,
                    current: dice.length,
                    needed: this.configDiceLength.min - dice.length,
                    dice: `${dice}`,
                }),
            );
        }

        if (dice.length > this.configDiceLength.max) {
            this.managerService.showError(
                this.messageService.getMessage('errors.tooManyDice', {
                    maximum: this.configDiceLength.max,
                    current: dice.length,
                    excess: dice.length - this.configDiceLength.max,
                    dice: `${dice}`,
                }),
            );
        }
    }

    private validateDiceValue(faces: number[], value: number): void {
        if (!Number.isInteger(value)) {
            this.managerService.showError(
                this.messageService.getMessage('errors.invalidValueTypeDice', {
                    value: value,
                    dice: `${faces}`,
                }),
            );
        }

        if (value < this.configDiceValues.min || value > this.configDiceValues.max) {
            this.managerService.showError(
                this.messageService.getMessage('errors.invalidValueDice', {
                    min: this.configDiceValues.min,
                    max: this.configDiceValues.max,
                    value: value,
                    dice: `${faces}`,
                }),
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
                    }),
                );
            }

            if (faces.length < this.configDiceFaces.min) {
                this.managerService.showError(
                    this.messageService.getMessage('errors.tooFewFacesDice', {
                        required: this.configDiceFaces.min,
                        current: faces.length,
                        needed: this.configDiceFaces.min - faces.length,
                        dice: `${faces}`,
                    }),
                );
            }

            if (faces.length > this.configDiceFaces.max) {
                this.managerService.showError(
                    this.messageService.getMessage('errors.tooManyFacesDice', {
                        maximum: this.configDiceFaces.max,
                        current: faces.length,
                        excess: faces.length - this.configDiceFaces.max,
                        dice: `${faces}`,
                    }),
                );
            }

            faces.forEach((value) => this.validateDiceValue(faces, value));
        });
    }

    public createDice(dice: string[]): number[][] {
        const parsedDice = this.parseDice(dice);
        this.validateDiceLength(parsedDice);
        this.validateDiceFaces(parsedDice);

        return parsedDice;
    }
}
