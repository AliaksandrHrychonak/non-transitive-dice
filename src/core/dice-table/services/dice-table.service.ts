import { IDiceTableService } from '../interfaces';
import { IHelperProbabilityService } from '@common/helper/interfaces';
import CliTable from 'cli-table3';
import { IConfigService } from '@common/config/interfaces';
import { Config } from '../../../config/index';

export class DiceTableService implements IDiceTableService {
    private config = Config;
    private configTable = Config['table'];

    constructor(
        private readonly configService: IConfigService,
        private readonly helperProbabilityService: IHelperProbabilityService
    ) {
        this.config = this.configService.getConfig();
        this.configTable = this.config.table;
    }

    public createProbabilityTable(dices: number[][]): string {
        const probabilities = this.helperProbabilityService.calculateMatrix(dices);

        const headers = ['Probability Table', ...dices.map((d) => d.toString())];

        const table = new CliTable({
            head: headers,
        });

        dices.forEach((dice, i) => {
            table.push([
                dice.toString(),
                ...probabilities[i].map((prob, j) =>
                    i === j
                        ? `- (${prob.toFixed(this.configTable.decimalPlaces)})`
                        : prob.toFixed(this.configTable.decimalPlaces)
                ),
            ]);
        });

        return table.toString();
    }
}
