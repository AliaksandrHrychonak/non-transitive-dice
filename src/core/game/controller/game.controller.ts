import { IGameService } from '../interfeces';
import { IDiceValidatorService } from '@core/dice/interfaces';

export class GameController {
    constructor(
        private readonly gameService: IGameService,
        private readonly diceValidatorService: IDiceValidatorService
    ) {}

    async start(dice: string[]): Promise<void> {
        const diceList = this.diceValidatorService.validate(dice);

        const isPersonFirst = await this.gameService.determineFirstPlayer(diceList);
        const { personDice, computerDice } = await this.gameService.playerDiceSelection(isPersonFirst, diceList);
        const [firstPlayer, secondPlayer] = isPersonFirst ? [personDice, computerDice] : [computerDice, personDice];

        const firstTurn = await this.gameService.makePlayerTurn(diceList, firstPlayer, isPersonFirst);
        const secondTurn = await this.gameService.makePlayerTurn(diceList, secondPlayer, !isPersonFirst);

        this.gameService.determineWinner(
            isPersonFirst ? firstTurn.diceValue : secondTurn.diceValue,
            isPersonFirst ? secondTurn.diceValue : firstTurn.diceValue
        );
    }
}
