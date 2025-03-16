import { IDiceTableService } from '../interfaces';
import { IHelperProbabilityService } from '@common/helper/interfaces';
import CliTable from 'cli-table3';

export class DiceTableService implements IDiceTableService {
    constructor(private readonly helperProbabilityService: IHelperProbabilityService) {}

    public createProbabilityTable(dices: number[][]): string {
        const probabilities = this.helperProbabilityService.calculateMatrix(dices);
        const headers = ['User dice', ...dices.map((d) => d.toString())];

        const table = new CliTable({
            head: headers,
        });

        dices.forEach((dice, i) => {
            table.push([
                dice.toString(),
                ...probabilities[i].map((prob, j) => (i === j ? `- (${prob.toFixed(4)})` : prob.toFixed(4))),
            ]);
        });

        return table.toString();
    }
}
