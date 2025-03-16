import { IHelperArrayService } from '../interfaces';

export class HelperArrayService implements IHelperArrayService {
    public parseCommaSeparatedNumbers(input: string): number[] {
        return input.split(',').map((i) => parseFloat(i.trim().toLowerCase()));
    }

    public generateNumberArray(input: number): Array<{ value: string; title: string }> {
        return Array.from({ length: input }, (_, index) => ({
            value: `${index}`,
            title: `${index} - ${index}`,
        }));
    }

    public generateOptionArray(arr: number[]): Array<{ value: string; title: string }> {
        return arr.map((item, index) => ({
            value: `${index}`,
            title: `${index} - [${item}]`,
        }));
    }
}
