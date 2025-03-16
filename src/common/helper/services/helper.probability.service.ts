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

// public findOptimalOption(probabilities: number[][]): number {
//     if (!probabilities.length) {
//         return -1;
//     }
//
//     let bestIndex = 0;
//     let bestAverage = this.calculateRowAverage(probabilities[0], 0);
//
//     for (let i = 1; i < probabilities.length; i++) {
//         const average = this.calculateRowAverage(probabilities[i], i);
//         if (average > bestAverage) {
//             bestIndex = i;
//             bestAverage = average;
//         }
//     }
//
//     return bestIndex;
// }
//
// private calculateRowAverage(row: number[], excludeIndex: number): number {
//     const validValues = row.filter((_, index) => index !== excludeIndex);
//     if (!validValues.length) {
//         return 0;
//     }
//
//     const sum = validValues.reduce((acc, curr) => acc + curr, 0);
//     return sum / validValues.length;
// }