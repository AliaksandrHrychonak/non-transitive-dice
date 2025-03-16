export interface IGameService {
    createDice(dice: string[]): number[][];

    determineFirstPlayer(diceList: number[][]): Promise<boolean>;

    playerDiceSelection(
        isPersonFirst: boolean,
        diceList: number[][]
    ): Promise<{
        personDice: number[];
        computerDice: number[];
    }>;

    makePlayerTurn(
        diceList: number[][],
        dice: number[]
    ): Promise<{
        result: number;
        diceValue: number;
    }>;

    determineWinner(personResult: number, pcResult: number): void;
}
