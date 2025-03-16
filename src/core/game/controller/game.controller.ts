import { IGameService } from '../interfeces';
import { IConfigService } from '@common/config/interfaces';
import type { Config } from '@config/index';

export class GameController {
    private readonly configGame: typeof this.config.game;
    private readonly config: Config;

    constructor(
        private readonly gameService: IGameService,
        private readonly configService: IConfigService
    ) {
        this.config = this.configService.getConfig();
        this.configGame = this.config.game;
    }

    async start(dice: string[]): Promise<void> {
        const diceList = this.gameService.createDice(dice);

        const isPersonFirst = await this.gameService.determineFirstPlayer(diceList);
        const { personDice, computerDice } = await this.gameService.playerDiceSelection(isPersonFirst, diceList);

        // if (isPersonFirst) {
        //     const person = await this.gameService.makePlayerTurn(diceList, personDice);
        //     const pc = await this.gameService.makePlayerTurn(diceList, computerDice);
        //     this.gameService.determineWinner(person.diceValue, pc.diceValue);
        // } else {
        //     const pc = await this.gameService.makePlayerTurn(diceList, computerDice);
        //     const person = await this.gameService.makePlayerTurn(diceList, personDice);
        //     this.gameService.determineWinner(person.diceValue, pc.diceValue);
        // }

        const [firstPlayer, secondPlayer] = isPersonFirst ? [personDice, computerDice] : [computerDice, personDice];

        const firstTurn = await this.gameService.makePlayerTurn(diceList, firstPlayer);
        const secondTurn = await this.gameService.makePlayerTurn(diceList, secondPlayer);

        this.gameService.determineWinner(
            isPersonFirst ? firstTurn.diceValue : secondTurn.diceValue,
            isPersonFirst ? secondTurn.diceValue : firstTurn.diceValue
        );
    }
}
