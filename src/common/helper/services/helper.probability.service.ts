import { IHelperProbabilityService } from '../interfaces';

export class HelperProbabilityService implements IHelperProbabilityService {
    public calculateMatrix(items: number[][]): number[][] {
        return items.map((itemA) => items.map((itemB) => this.calculate(itemA, itemB)));
    }

    private calculate(setA: number[], setB: number[]): number {
        if (!setA.length || !setB.length) {
            return 0;
        }

        let winningCases = 0;
        const totalCombinations = setA.length * setB.length;

        for (const valueA of setA) {
            for (const valueB of setB) {
                if (valueA > valueB) {
                    winningCases++;
                }
            }
        }

        return winningCases / totalCombinations;
    }
}
