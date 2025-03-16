import { IGameService } from '../interfeces';
import { IConfigService } from '@common/config/interfaces';
import type { Config } from '@config/index';

export class GameController {
    private readonly configGame: typeof this.config.game;
    private readonly config: Config;

    constructor(
        private readonly gameService: IGameService,
        private readonly configService: IConfigService,
    ) {
        this.config = this.configService.getConfig();
        this.configGame = this.config.game;
    }

    async start(dice: string[]): Promise<void> {
        const diceList = this.gameService.createDice(dice);

        const isPersonFirst = await this.gameService.determineFirstPlayer(diceList);
        const { personDice, computerDice } = await this.gameService.playerDiceSelection(isPersonFirst, diceList);
        const [firstPlayer, secondPlayer] = isPersonFirst ? [personDice, computerDice] : [computerDice, personDice];

        const firstTurn = await this.gameService.makePlayerTurn(diceList, firstPlayer, isPersonFirst);
        const secondTurn = await this.gameService.makePlayerTurn(diceList, secondPlayer, !isPersonFirst);

        this.gameService.determineWinner(
            isPersonFirst ? firstTurn.diceValue : secondTurn.diceValue,
            isPersonFirst ? secondTurn.diceValue : firstTurn.diceValue,
        );
    }
}
